'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import { AppLayout } from '../../modules/partials';
import { HeaderBackButton } from '../../modules/partials/AppHeader/ui/components';
import { AppGoogleMapsProvider, AppGoogleMap } from '../../modules/components';
import type { TruckMarker } from '../../modules/components/AppGoogleMap';
import { pxToRem, useLiveTrackStore, useRideTracking } from '@/common';
import type { MarkerPosition } from '@/common/types';
import { DriverChatDrawer, DriverTrackingCard } from './ui/components';

export function LiveTrackPage() {
  const searchParams = useSearchParams();
  const rideId = searchParams.get('ride_id');
  const { driverId: storedDriverId, rideId: storedRideId } =
    useLiveTrackStore();

  const effectiveDriverId =
    storedRideId && rideId && storedRideId === rideId ? storedDriverId : null;

  const { isConnected, driverLocation, trackingStarted, error } =
    useRideTracking(
      effectiveDriverId ? { driverId: effectiveDriverId, rideId } : { rideId }
    );

  useEffect(() => {
    if (!rideId) return;
    // eslint-disable-next-line no-console
    console.log('[LiveTrackPage] socket status:', {
      rideId,
      isConnected,
      hasDriverLocation: Boolean(driverLocation),
      hasTrackingStarted: Boolean(trackingStarted),
      error,
    });
  }, [rideId, isConnected, driverLocation, trackingStarted, error]);

  useEffect(() => {
    if (!rideId || !driverLocation) return;
    // eslint-disable-next-line no-console
    console.log('[LiveTrackPage] location_update:', driverLocation);
  }, [rideId, driverLocation]);

  useEffect(() => {
    if (!rideId || !trackingStarted) return;
    // eslint-disable-next-line no-console
    console.log('[LiveTrackPage] tracking_started:', trackingStarted);
  }, [rideId, trackingStarted]);

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
