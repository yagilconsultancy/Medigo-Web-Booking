'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  Paper,
  Stack,
  Typography,
  Chip,
  CircularProgress,
} from '@mui/material';
import DirectionsCar from '@mui/icons-material/DirectionsCar';
import { AppLayout } from '../../modules/partials';
import { HeaderBackButton } from '../../modules/partials/AppHeader/ui/components';
import { AppGoogleMapsProvider, AppGoogleMap } from '../../modules/components';
import type { TruckMarker } from '../../modules/components/AppGoogleMap';
import { pxToRem, useDispatchSocket } from '@/common';
import type { MarkerPosition } from '@/common/types';

export function LiveTrackPage() {
  const searchParams = useSearchParams();
  const rideId = searchParams.get('ride_id');

  const { isConnected, isJoined, locationUpdates, error } = useDispatchSocket();

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  // Get current ride location update
  const currentUpdate = rideId ? locationUpdates.get(rideId) : null;

  const hasCoordinates =
    currentUpdate?.current_latitude != null &&
    currentUpdate?.current_longitude != null &&
    currentUpdate?.destination_latitude != null &&
    currentUpdate?.destination_longitude != null;

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

  const destinationMarker: MarkerPosition | null = currentUpdate
    ? {
        lat: currentUpdate.destination_latitude,
        lng: currentUpdate.destination_longitude,
      }
    : null;

  const truckMarker: TruckMarker | undefined =
    currentUpdate && hasCoordinates
      ? {
          position: {
            lat: currentUpdate.current_latitude,
            lng: currentUpdate.current_longitude,
          },
          heading: currentUpdate.current_heading || 0,
        }
      : undefined;

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
        {apiKey && hasCoordinates && destinationMarker ? (
          <AppGoogleMapsProvider apiKey={apiKey}>
            <AppGoogleMap
              markerPositions={[destinationMarker]}
              truckMarker={truckMarker}
              mapContainerStyle={{
                width: '100%',
                height: 'calc(100vh - 64px)',
              }}
              showDirections={true}
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

        {/* Status Card */}
        {currentUpdate && (
          <Paper
            elevation={3}
            sx={{
              position: 'absolute',
              bottom: pxToRem(24),
              left: '50%',
              transform: 'translateX(-50%)',
              width: '90%',
              maxWidth: pxToRem(600),
              borderRadius: pxToRem(16),
              p: pxToRem(20),
              boxShadow: '0px 4px 24px rgba(0,0,0,0.12)',
            }}
          >
            <Stack spacing={2}>
              {/* Live Tracking Header */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DirectionsCar
                    sx={{ color: '#2F6FED', fontSize: pxToRem(20) }}
                  />
                  <Typography
                    sx={{
                      fontSize: pxToRem(14),
                      fontWeight: 700,
                      color: '#0F172A',
                    }}
                  >
                    Live Tracking
                  </Typography>
                </Box>
                <Chip
                  label={`${currentUpdate.current_speed.toFixed(0)} mph`}
                  sx={{
                    height: pxToRem(24),
                    bgcolor: 'rgba(15,23,42,0.82)',
                    color: '#FFFFFF',
                    fontSize: pxToRem(12),
                    fontWeight: 700,
                  }}
                />
              </Box>

              {/* ETA Section */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: pxToRem(12),
                  p: pxToRem(12),
                  bgcolor: '#EFF6FF',
                  borderRadius: pxToRem(14),
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontSize: pxToRem(9),
                      fontWeight: 400,
                      color: '#94A3B8',
                    }}
                  >
                    ETA
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: pxToRem(12),
                      fontWeight: 700,
                      color: '#2563EB',
                    }}
                  >
                    {currentUpdate.eta_minutes} min
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: pxToRem(1),
                    height: pxToRem(32),
                    bgcolor: '#DBEAFE',
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontSize: pxToRem(9),
                      fontWeight: 400,
                      color: '#94A3B8',
                    }}
                  >
                    Distance Remaining
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: pxToRem(12),
                      fontWeight: 700,
                      color: '#2563EB',
                    }}
                  >
                    {currentUpdate.distance_remaining_miles.toFixed(1)} mi
                  </Typography>
                </Box>
              </Box>

              {/* Status */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: pxToRem(6),
                    height: pxToRem(6),
                    borderRadius: '50%',
                    bgcolor: '#16A34A',
                    opacity: 0.66,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: pxToRem(11),
                    fontWeight: 600,
                    color: '#16A34A',
                  }}
                >
                  {currentUpdate.status === 'driver_en_route'
                    ? 'Driver en route'
                    : currentUpdate.status === 'driver_arrived'
                      ? 'Driver arrived'
                      : currentUpdate.status === 'in_progress'
                        ? 'In progress'
                        : 'Driver assigned'}
                </Typography>
              </Box>
            </Stack>
          </Paper>
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
      </Box>
    </AppLayout>
  );
}
