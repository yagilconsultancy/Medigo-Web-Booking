'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import { io, Socket } from 'socket.io-client';
import { AppLayout } from '../../modules/partials';
import { HeaderBackButton } from '../../modules/partials/AppHeader/ui/components';
import { AppGoogleMapsProvider, AppGoogleMap } from '../../modules/components';
import type { TruckMarker } from '../../modules/components/AppGoogleMap';
import { pxToRem, getAuthToken } from '@/common';
import type { MarkerPosition } from '@/common/types';
import { DriverChatDrawer, DriverTrackingCard } from './ui/components';

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

export function LiveTrackPage() {
  const searchParams = useSearchParams();
  const rideId = searchParams.get('ride_id');

  const [isConnected, setIsConnected] = useState(false);
  const [driverLocation, setDriverLocation] =
    useState<RideLocationUpdate | null>(null);
  const [trackingStarted, setTrackingStarted] =
    useState<TrackingStartedEvent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const hasJoinedRef = useRef(false);

  // Socket.IO connection - runs once on mount
  useEffect(() => {
    if (!rideId) {
      setError('No ride ID provided');
      return;
    }

    console.log('[LiveTrack] Connecting to Socket.IO for ride:', rideId);

    const token = getAuthToken();
    const serverUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://staging.getmedigo.com';
    const socketPath = process.env.NEXT_PUBLIC_SOCKET_PATH || '/api/v1/ws/socket.io';

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
      setTrackingStarted(data);
    });

    socket.on('tracking_ended', (data: any) => {
      console.log('[LiveTrack] 🔴 Tracking ended:', data);
      setDriverLocation(null);
      setTrackingStarted(null);
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

  const driverId = trackingStarted?.driver_id ?? driverLocation?.driver_id ?? '';
  const riderId = trackingStarted?.rider_id ?? '';

  const destinationMarker: MarkerPosition | null = trackingStarted
    ? {
        lat: trackingStarted.destination_latitude,
        lng: trackingStarted.destination_longitude,
      }
    : null;

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
      try {
        const routesLib = (await google.maps.importLibrary('routes')) as any;
        const Route = routesLib.Route;

        const request: Record<string, any> = {
          origin: input.origin,
          destination: input.destination,
          travelMode: 'DRIVE',
          fields: ['path'],
        };

        if (input.waypoints?.length) {
          request.intermediates = input.waypoints;
        }

        const { routes } = await Route.computeRoutes(request);

        const route = routes?.[0];
        if (!route?.path?.length) return null;

        const polyline: MarkerPosition[] = route.path.map((point: any) => ({
          lat: typeof point.lat === 'function' ? point.lat() : point.lat,
          lng: typeof point.lng === 'function' ? point.lng() : point.lng,
        }));

        return { polyline };
      } catch {
        return null;
      }
    },
    []
  );

  const pickupMarker: MarkerPosition | null = trackingStarted
    ? {
        lat: trackingStarted.pickup_latitude,
        lng: trackingStarted.pickup_longitude,
      }
    : null;

  const truckMarker: TruckMarker | undefined =
    hasCoordinates && driverLocation
      ? {
          position: {
            lat: driverLocation.latitude,
            lng: driverLocation.longitude,
          },
          heading: driverLocation.heading ?? 0,
        }
      : undefined;

  // Debug: log truck marker data
  useEffect(() => {
    console.log('[LiveTrack] 🚚 Truck marker data:', {
      hasCoordinates,
      driverLocation,
      truckMarker,
    });
  }, [hasCoordinates, driverLocation, truckMarker]);

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

  const driverSubtitleParts = [
    driverId ? `Driver: ${driverId}` : null,
    riderId ? `Rider: ${riderId}` : null,
  ].filter(Boolean);
  const driverSubtitle =
    driverSubtitleParts.length > 0 ? driverSubtitleParts.join(' · ') : '—';

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
        {apiKey && hasCoordinates ? (
          <AppGoogleMapsProvider apiKey={apiKey}>
            <AppGoogleMap
              markerPositions={
                destinationMarker && pickupMarker
                  ? [pickupMarker, destinationMarker]
                  : destinationMarker
                    ? [destinationMarker]
                    : pickupMarker
                      ? [pickupMarker]
                      : []
              }
              truckMarker={truckMarker}
              mapContainerStyle={{
                width: '100%',
                height: 'calc(100vh - 64px)',
              }}
              showDirections={Boolean(destinationMarker)}
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
                : !hasCoordinates
                  ? 'Waiting for driver location...'
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
              statusLabel={statusLabel}
              driverName={driverId}
              driverSubtitle={driverSubtitle}
              etaMinutes={displayData.eta_minutes}
              destinationLabel={destinationLabel}
              metaLabel={`${displayData.current_speed.toFixed(0)} km/h · ${displayData.distance_remaining_miles.toFixed(1)} km remaining`}
              onMessageDriver={() => setChatOpen(true)}
            />
          </Box>
        )}

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

        {/* Chat */}
        <DriverChatDrawer
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          driverName={driverId || 'Driver'}
          driverOnlineLabel={isConnected ? 'Online' : 'Offline'}
          initialMessages={[]}
        />
      </Box>
    </AppLayout>
  );
}
