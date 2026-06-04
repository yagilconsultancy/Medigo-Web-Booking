'use client';

import { decode } from '@googlemaps/polyline-codec';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import { io, Socket } from 'socket.io-client';
import { AppLayout } from '../../modules/partials';
import { HeaderBackButton } from '../../modules/partials/AppHeader/ui/components';
import { AppGoogleMapsProvider, AppGoogleMap } from '../../modules/components';
import type { TruckMarker } from '../../modules/components/AppGoogleMap';
import { pxToRem, getAuthToken, useChat } from '@/common';
import type { MarkerPosition } from '@/common/types';
import {
  DriverChatDrawer,
  DriverTrackingCard,
  RateDriverModal,
  RideCompletedModal,
} from './ui/components';
import sampleRoute from '../../../../scripts/sample-route.json';

type RideLocationUpdate = {
  ride_id: string;
  driver_id: string;
  latitude: number;
  longitude: number;
  heading: number;
  speed: number;
  eta_minutes: number;
  distance_remaining_miles: number;
  timestamp: string;
};

type TrackingStartedEvent = {
  ride_id: string;
  driver_id: string;
  rider_id: string;
  pickup_latitude: number;
  pickup_longitude: number;
  destination_latitude: number;
  destination_longitude: number;
  started_at: string;
};

type TrackingEndedEvent = {
  ride_id: string;
  driver_id?: string;
  completed_at?: string;
  status?: string;
};

export function LiveTrackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rideId = searchParams.get('ride_id');
  const conversationId = searchParams.get('conversation_id');

  const [isConnected, setIsConnected] = useState(false);
  const [driverLocation, setDriverLocation] =
    useState<RideLocationUpdate | null>(null);
  const [trackingStarted, setTrackingStarted] =
    useState<TrackingStartedEvent | null>(null);
  const [rateDriverOpen, setRateDriverOpen] = useState(false);
  const [rideCompletedOpen, setRideCompletedOpen] = useState(false);
  const [tripDurationLabel, setTripDurationLabel] = useState('Trip completed');
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const hasJoinedRef = useRef(false);
  const rideStartedAtRef = useRef<string | null>(null);

  const formatTripDuration = useCallback(
    (startedAt: string | null, endedAt: string | null) => {
      if (!startedAt || !endedAt) return 'Trip completed';

      const startedMs = new Date(startedAt).getTime();
      const endedMs = new Date(endedAt).getTime();
      if (!Number.isFinite(startedMs) || !Number.isFinite(endedMs)) {
        return 'Trip completed';
      }

      const durationMinutes = Math.max(
        1,
        Math.round((endedMs - startedMs) / 60000)
      );

      return `${durationMinutes} min`;
    },
    []
  );

  // Socket.IO connection - runs once on mount
  useEffect(() => {
    if (!rideId) {
      setError('No ride ID provided');
      return;
    }

    console.log('[LiveTrack] Connecting to Socket.IO for ride:', rideId);

    const token = getAuthToken();
    const serverUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || 'https://staging.getmedigo.com';
    const socketPath =
      process.env.NEXT_PUBLIC_SOCKET_PATH || '/api/v1/ws/socket.io';

    const socket = io(`${serverUrl}/tracking`, {
      path: socketPath,
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 10,
      timeout: 10000,
    });

    socketRef.current = socket;

    // Connection handlers
    socket.on('connect', () => {
      console.log('[LiveTrack] Connected, socket ID:', socket.id);
      setIsConnected(true);
      setError(null);

      // Join ride room only once
      if (!hasJoinedRef.current) {
        console.log('[LiveTrack] Joining ride room:', rideId);
        socket.emit('join_ride', { ride_id: rideId }, (response: any) => {
          if (response?.error) {
            console.error('[LiveTrack] Join error:', response.error);
            setError(response.error);
          } else {
            console.log('[LiveTrack] Joined room:', response?.room || 'OK');
            hasJoinedRef.current = true;
          }
        });
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('[LiveTrack] Disconnected:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('[LiveTrack] Connection error:', err.message);
      setError(`Connection error: ${err.message}`);
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log('[LiveTrack] Reconnected after', attemptNumber, 'attempts');
      // Re-join room after reconnect
      socket.emit('join_ride', { ride_id: rideId });
    });

    // Tracking event handlers
    socket.on('location_update', (data: RideLocationUpdate) => {
      console.log('[LiveTrack] 🚗 Location update received:', data);
      setDriverLocation(data);
    });

    socket.on('tracking_started', (data: TrackingStartedEvent) => {
      console.log('[LiveTrack] 🟢 Tracking started:', data);
      rideStartedAtRef.current = data.started_at;
      setTrackingStarted(data);
    });

    socket.on('tracking_ended', (data: TrackingEndedEvent) => {
      console.log('[LiveTrack] 🔴 Tracking ended:', data);
      setTripDurationLabel(
        formatTripDuration(
          rideStartedAtRef.current,
          data.completed_at ?? new Date().toISOString()
        )
      );
      setDriverLocation(null);
      setTrackingStarted(null);
      setRateDriverOpen(true);
    });

    // Debug: log ALL events
    socket.onAny((eventName, ...args) => {
      console.log('[LiveTrack] 📡 Event received:', eventName, args);
    });

    // Cleanup on unmount
    return () => {
      console.log('[LiveTrack] Component unmounting, cleaning up socket');
      if (hasJoinedRef.current) {
        socket.emit('leave_ride', { ride_id: rideId });
      }
      socket.disconnect();
      hasJoinedRef.current = false;
      socketRef.current = null;
    };
  }, [rideId]); // Only re-run if rideId changes

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  const [chatOpen, setChatOpen] = useState(false);
  const {
    messages,
    connected: chatConnected,
    typing,
    currentUserId,
    sendMessage,
    markRead,
    sendTyping,
  } = useChat({
    conversationId: conversationId ?? undefined,
  });

  useEffect(() => {
    console.log('[LiveTrack] chat state:', {
      conversationId,
      chatConnected,
      currentUserId,
      action: chatConnected ? 'chat connected' : 'chat disconnected',
    });
  }, [chatConnected, conversationId, currentUserId]);

  const driverId =
    trackingStarted?.driver_id ?? driverLocation?.driver_id ?? '';
  const riderId = trackingStarted?.rider_id ?? '';

  const destinationMarker = useMemo<MarkerPosition | null>(
    () =>
      trackingStarted
        ? {
            lat: trackingStarted.destination_latitude,
            lng: trackingStarted.destination_longitude,
          }
        : (sampleRoute as MarkerPosition[]).length > 1
          ? (sampleRoute as MarkerPosition[])[
              (sampleRoute as MarkerPosition[]).length - 1
            ]!
          : null,
    [trackingStarted]
  );

  const destinationLabel =
    destinationMarker != null
      ? `Destination (${destinationMarker.lat.toFixed(
          5
        )}, ${destinationMarker.lng.toFixed(5)})`
      : 'Destination pending';

  // Use socket data for live position.
  const hasCoordinates =
    driverLocation?.latitude != null && driverLocation?.longitude != null;

  const computeRoute = useCallback(
    async (input: {
      origin: MarkerPosition;
      destination: MarkerPosition;
      waypoints?: MarkerPosition[];
    }): Promise<{ polyline: MarkerPosition[] } | null> => {
      const summarizeRouteResult = (routeResult: any) => {
        if (!routeResult) return null;

        const json =
          typeof routeResult?.toJSON === 'function'
            ? routeResult.toJSON()
            : null;
        const path = routeResult?.path;
        const legPathLengths = Array.isArray(routeResult?.legs)
          ? routeResult.legs.map((leg: any) =>
              Array.isArray(leg?.path) ? leg.path.length : 0
            )
          : [];

        return {
          hasToJSON: typeof routeResult?.toJSON === 'function',
          keys: Object.keys(routeResult ?? {}),
          hasPath: Array.isArray(path),
          pathLength: Array.isArray(path) ? path.length : null,
          hasLegs: Array.isArray(routeResult?.legs),
          legCount: Array.isArray(routeResult?.legs)
            ? routeResult.legs.length
            : 0,
          legPathLengths,
          polyline: routeResult?.polyline ?? json?.polyline ?? null,
          json,
        };
      };

      try {
        const routesLibrary = (await google.maps.importLibrary(
          'routes'
        )) as any;
        const coordinateResponse = await routesLibrary.Route.computeRoutes({
          origin: input.origin,
          destination: input.destination,
          intermediates: input.waypoints?.map((point) => ({
            location: point,
          })),
          travelMode: 'DRIVING',
          fields: ['path', 'legs'],
          polylineQuality: routesLibrary.PolylineQuality?.OVERVIEW,
        });

        const route = coordinateResponse?.routes?.[0];
        console.log('[LiveTrack] computeRoute coordinate request', {
          input,
          geocodingResults: coordinateResponse?.geocodingResults ?? null,
          routeSummary: summarizeRouteResult(route),
        });

        const getPolylineFromRoute = (routeResult: any): MarkerPosition[] => {
          if (!routeResult) return [];

          const encodedPolyline =
            routeResult?.polyline?.encodedPolyline ??
            routeResult?.toJSON?.()?.polyline?.encodedPolyline;

          if (
            typeof encodedPolyline === 'string' &&
            encodedPolyline.length > 0
          ) {
            return decode(encodedPolyline).map(([lat, lng]) => ({
              lat,
              lng,
            }));
          }

          const path = routeResult?.path;
          if (Array.isArray(path) && path.length > 0) {
            return path.map((point: any) => ({
              lat: typeof point.lat === 'function' ? point.lat() : point.lat,
              lng: typeof point.lng === 'function' ? point.lng() : point.lng,
            }));
          }

          const legPath = routeResult?.legs?.flatMap((leg: any) =>
            Array.isArray(leg?.path)
              ? leg.path.map((point: any) => ({
                  lat:
                    typeof point.lat === 'function' ? point.lat() : point.lat,
                  lng:
                    typeof point.lng === 'function' ? point.lng() : point.lng,
                }))
              : []
          );

          return Array.isArray(legPath) ? legPath : [];
        };

        const polyline = getPolylineFromRoute(route);

        if (polyline.length === 0) {
          console.warn(
            '[LiveTrack] Route API returned no path',
            coordinateResponse
          );
          return null;
        }

        return { polyline };
      } catch (routeError) {
        console.error('[LiveTrack] Failed to compute route', routeError);
        return null;
      }
    },
    []
  );

  const pickupMarker = useMemo<MarkerPosition | null>(
    () =>
      trackingStarted
        ? {
            lat: trackingStarted.pickup_latitude,
            lng: trackingStarted.pickup_longitude,
          }
        : (sampleRoute as MarkerPosition[]).length > 0
          ? (sampleRoute as MarkerPosition[])[0]!
          : null,
    [trackingStarted]
  );

  const routeMarkers = useMemo<MarkerPosition[]>(() => {
    if (pickupMarker && destinationMarker)
      return [pickupMarker, destinationMarker];
    if (pickupMarker) return [pickupMarker];
    if (destinationMarker) return [destinationMarker];
    return [];
  }, [destinationMarker, pickupMarker]);
  const simulatedRoute = sampleRoute as MarkerPosition[];
  const routePath = trackingStarted
    ? undefined
    : simulatedRoute.length >= 2
      ? simulatedRoute
      : undefined;
  const hasMapData =
    hasCoordinates || pickupMarker != null || destinationMarker != null;

  const truckMarker = useMemo<TruckMarker | undefined>(
    () =>
      hasCoordinates && driverLocation
        ? {
            position: {
              lat: driverLocation.latitude,
              lng: driverLocation.longitude,
            },
            heading: driverLocation.heading ?? 0,
          }
        : undefined,
    [driverLocation, hasCoordinates]
  );

  // Debug: log truck marker data
  useEffect(() => {
    if (!driverLocation) return;
    console.log('[LiveTrack] 🚚 Truck marker data:', {
      hasCoordinates,
      driverLocation,
      truckMarker,
    });
  }, [driverLocation]);

  // Display data from socket only
  const displayData = driverLocation
    ? {
        current_speed: driverLocation.speed,
        eta_minutes: driverLocation.eta_minutes,
        distance_remaining_miles: driverLocation.distance_remaining_miles,
      }
    : null;

  if (!rideId) {
    return (
      <AppLayout
        headerProps={{
          showRightContent: true,
          rightContent: <HeaderBackButton />,
        }}
      >
        <Box
          sx={{
            width: '100%',
            minHeight: '100vh',
            bgcolor: '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography>No ride ID provided</Typography>
        </Box>
      </AppLayout>
    );
  }

  const statusLabel = trackingStarted
    ? 'Tracking live driver location'
    : 'Waiting for tracking to start...';

  return (
    <AppLayout
      headerProps={{
        showRightContent: true,
        rightContent: <HeaderBackButton />,
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: 'calc(100vh - 64px)',
          bgcolor: '#F8FAFC',
          position: 'relative',
        }}
      >
        {/* Map */}
        {apiKey && hasMapData ? (
          <AppGoogleMapsProvider apiKey={apiKey}>
            <AppGoogleMap
              markerPositions={routeMarkers}
              routeOrigin={pickupMarker ?? undefined}
              routePath={routePath}
              truckMarker={truckMarker}
              mapContainerStyle={{
                width: '100%',
                height: 'calc(100vh - 64px)',
              }}
              showDirections={Boolean(
                trackingStarted && pickupMarker && destinationMarker
              )}
              computeRoute={computeRoute}
            />
          </AppGoogleMapsProvider>
        ) : (
          <Box
            sx={{
              width: '100%',
              height: 'calc(100vh - 64px)',
              background: '#E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              sx={{
                color: '#9CA3AF',
                fontSize: pxToRem(16),
                fontWeight: 500,
              }}
            >
              {!apiKey
                ? 'Google Maps API key not configured'
                : !hasMapData
                  ? 'Waiting for route or driver location...'
                  : 'Map not available'}
            </Typography>
          </Box>
        )}

        {/* Driver Tracking UI (socket-only) */}
        {displayData && driverId && (
          <Box
            sx={{
              position: 'absolute',
              top: pxToRem(16),
              left: '50%',
              transform: 'translateX(-50%)',
              width: '92%',
              maxWidth: pxToRem(920),
              zIndex: 2,
            }}
          >
            <DriverTrackingCard
              rideId={rideId}
              statusLabel={statusLabel}
              onMessageDriver={() => setChatOpen((prev) => !prev)}
            />

            <DriverChatDrawer
              open={chatOpen}
              onClose={() => setChatOpen(false)}
              driverName={driverId || 'Driver'}
              driverOnlineLabel={chatConnected ? 'Online' : 'Offline'}
              messages={messages}
              connected={chatConnected}
              currentUserId={currentUserId}
              typingUserId={typing}
              onSendMessage={sendMessage}
              onTypingChange={sendTyping}
              onMarkRead={markRead}
            />
          </Box>
        )}

        <RideCompletedModal
          open={rideCompletedOpen}
          setOpen={setRideCompletedOpen}
          onBackToHome={() => {
            router.push('/my-rides');
          }}
        />

        <RateDriverModal
          open={rateDriverOpen}
          setOpen={setRateDriverOpen}
          rideId={rideId}
          tripDuration={tripDurationLabel}
          onSubmitted={() => {
            setRateDriverOpen(false);
            setRideCompletedOpen(true);
          }}
        />

        {/* Connection Status */}
        {!isConnected && (
          <Paper
            elevation={2}
            sx={{
              position: 'absolute',
              top: pxToRem(24),
              left: '50%',
              transform: 'translateX(-50%)',
              p: pxToRem(12),
              borderRadius: pxToRem(12),
              display: 'flex',
              alignItems: 'center',
              gap: pxToRem(12),
            }}
          >
            <CircularProgress size={16} />
            <Typography sx={{ fontSize: pxToRem(12), color: '#64748B' }}>
              Connecting to tracking server...
            </Typography>
          </Paper>
        )}

        {error && (
          <Paper
            elevation={2}
            sx={{
              position: 'absolute',
              top: pxToRem(24),
              left: '50%',
              transform: 'translateX(-50%)',
              p: pxToRem(12),
              borderRadius: pxToRem(12),
              bgcolor: '#FEF2F2',
              border: '1px solid #FCA5A5',
            }}
          >
            <Typography sx={{ fontSize: pxToRem(12), color: '#B91C1C' }}>
              {error}
            </Typography>
          </Paper>
        )}
      </Box>
    </AppLayout>
  );
}
