'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import { AppLayout } from '../../modules/partials';
import { HeaderBackButton } from '../../modules/partials/AppHeader/ui/components';
import { AppGoogleMapsProvider, AppGoogleMap } from '../../modules/components';
import type { TruckMarker } from '../../modules/components/AppGoogleMap';
import { pxToRem, useRideTracking } from '@/common';
import type { MarkerPosition } from '@/common/types';
import { AppButton } from '@/ui/modules/components';
import {
  DriverChatDrawer,
  DriverTrackingCard,
  RateDriverModal,
  RideCompletedModal,
} from './ui/components';

type RideStatus =
  | 'requested'
  | 'confirmed'
  | 'driver_assigned'
  | 'driver_en_route'
  | 'driver_arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export function LiveTrackPage() {
  const searchParams = useSearchParams();
  const rideId = searchParams.get('ride_id');

  const simulationEnabled = searchParams.get('simulate') === '1';

  const { isConnected, driverLocation, trackingStarted, error } =
    useRideTracking(simulationEnabled ? null : rideId);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  const [rideStatus, setRideStatus] = useState<RideStatus>(
    simulationEnabled ? 'driver_arrived' : 'in_progress'
  );
  const [chatOpen, setChatOpen] = useState(false);
  const [rateDriverOpen, setRateDriverOpen] = useState(false);
  const [rideCompletedOpen, setRideCompletedOpen] = useState(false);

  useEffect(() => {
    const statusFromQuery = searchParams.get('status') as RideStatus | null;
    if (!simulationEnabled) return;
    if (statusFromQuery) setRideStatus(statusFromQuery);
  }, [searchParams, simulationEnabled]);

  const simulatedTrackingStarted = useMemo(() => {
    if (!simulationEnabled) return null;
    return {
      ride_id: rideId ?? 'SIM-RIDE',
      driver_id: 'SIM-DRIVER',
      rider_id: 'SIM-RIDER',
      pickup_latitude: 6.5244,
      pickup_longitude: 3.3792,
      destination_latitude: 6.5212,
      destination_longitude: 3.3676,
      started_at: new Date().toISOString(),
    };
  }, [rideId, simulationEnabled]);

  const simulatedDriverLocation = useMemo(() => {
    if (!simulationEnabled) return null;
    return {
      ride_id: rideId ?? 'SIM-RIDE',
      driver_id: 'SIM-DRIVER',
      latitude: 6.5232,
      longitude: 3.3758,
      heading: 215,
      speed: 28,
      eta_minutes: 14,
      distance_remaining_miles: 8.3,
      timestamp: new Date().toISOString(),
    };
  }, [rideId, simulationEnabled]);

  const effectiveTrackingStarted = trackingStarted ?? simulatedTrackingStarted;
  const effectiveDriverLocation = driverLocation ?? simulatedDriverLocation;

  // Use socket data for both live position and destination
  const hasCoordinates =
    effectiveDriverLocation?.latitude != null &&
    effectiveDriverLocation?.longitude != null &&
    effectiveTrackingStarted?.destination_latitude != null &&
    effectiveTrackingStarted?.destination_longitude != null;

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

  const destinationMarker: MarkerPosition | null = effectiveTrackingStarted
    ? {
        lat: effectiveTrackingStarted.destination_latitude,
        lng: effectiveTrackingStarted.destination_longitude,
      }
    : null;

  const truckMarker: TruckMarker | undefined =
    hasCoordinates && effectiveDriverLocation
      ? {
          position: {
            lat: effectiveDriverLocation.latitude,
            lng: effectiveDriverLocation.longitude,
          },
          heading: effectiveDriverLocation.heading ?? 0,
        }
      : undefined;

  // Display data from socket only
  const displayData = effectiveDriverLocation
    ? {
        current_speed: effectiveDriverLocation.speed,
        eta_minutes: effectiveDriverLocation.eta_minutes,
        distance_remaining_miles:
          effectiveDriverLocation.distance_remaining_miles,
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

  const statusLabel =
    rideStatus === 'driver_arrived'
      ? 'Driver Arrived at Pickup...'
      : rideStatus === 'driver_en_route'
        ? 'Driver En Route...'
        : rideStatus === 'in_progress'
          ? 'Trip In Progress...'
          : rideStatus === 'completed'
            ? 'Trip Completed'
            : 'Tracking...';

  const ctaConfig: {
    label: string;
    disabled?: boolean;
    onClick: () => void;
  } =
    rideStatus === 'driver_arrived'
      ? {
          label: "I'm at the Car — Start Ride",
          onClick: () => setRideStatus('in_progress'),
        }
      : rideStatus === 'in_progress'
        ? {
            label: 'End Trip',
            onClick: () => setRateDriverOpen(true),
          }
        : rideStatus === 'completed'
          ? {
              label: 'Trip Completed',
              disabled: true,
              onClick: () => {},
            }
          : {
              label: 'Waiting for driver updates…',
              disabled: true,
              onClick: () => {},
            };

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

        {/* Driver Tracking UI (sim-ready) */}
        {displayData && (
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
              driverName="John Driver"
              driverSubtitle="MediGo Verified Driver · 3,241 trips"
              etaMinutes={displayData.eta_minutes}
              destinationLabel="Springfield General Hospital"
              metaLabel={`${displayData.current_speed.toFixed(0)} km/h · ${displayData.distance_remaining_miles.toFixed(1)} km remaining`}
              onMessageDriver={() => setChatOpen(true)}
            />
          </Box>
        )}

        {/* Simulator controls (no backend yet) */}
        {simulationEnabled && (
          <Paper
            elevation={3}
            sx={{
              position: 'absolute',
              top: pxToRem(16),
              right: pxToRem(16),
              zIndex: 3,
              p: pxToRem(12),
              borderRadius: pxToRem(14),
              width: pxToRem(240),
            }}
          >
            <Typography
              sx={{
                fontSize: pxToRem(12),
                fontWeight: 800,
                color: '#0F172A',
                mb: pxToRem(8),
              }}
            >
              Tracking simulator
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: pxToRem(8) }}>
              {(
                [
                  'driver_en_route',
                  'driver_arrived',
                  'in_progress',
                  'completed',
                ] as RideStatus[]
              ).map((s) => (
                <AppButton
                  key={s}
                  variant={rideStatus === s ? 'contained' : 'outlined'}
                  onClick={() => setRideStatus(s)}
                  sx={{
                    height: pxToRem(30),
                    borderRadius: pxToRem(10),
                    px: pxToRem(10),
                    minWidth: 'unset',
                    fontSize: pxToRem(11),
                    fontWeight: 800,
                    textTransform: 'none',
                    ...(rideStatus === s
                      ? {
                          bgcolor: '#2563EB',
                          '&:hover': { bgcolor: '#1D4ED8' },
                        }
                      : {
                          borderColor: '#E2E8F0',
                          color: '#0F172A',
                          '&:hover': {
                            borderColor: '#CBD5E1',
                            bgcolor: '#F8FAFC',
                          },
                        }),
                  }}
                >
                  {s}
                </AppButton>
              ))}
            </Box>
          </Paper>
        )}

        {/* Bottom CTA */}
        {displayData && (
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              bottom: pxToRem(16),
              width: '92%',
              maxWidth: pxToRem(920),
              zIndex: 2,
            }}
          >
            <AppButton
              variant="contained"
              fullWidth
              disabled={ctaConfig.disabled}
              onClick={ctaConfig.onClick}
              sx={{
                height: pxToRem(56),
                borderRadius: pxToRem(14),
                bgcolor: '#2563EB',
                fontSize: pxToRem(16),
                fontWeight: 800,
                textTransform: 'none',
                '&:hover': { bgcolor: '#1D4ED8' },
                '&.Mui-disabled': {
                  bgcolor: '#94A3B8',
                  color: '#FFFFFF',
                },
              }}
            >
              {ctaConfig.label}
            </AppButton>

            <Typography
              sx={{
                mt: pxToRem(10),
                textAlign: 'center',
                fontSize: pxToRem(12),
                fontWeight: 700,
                color: '#2563EB',
                cursor: 'pointer',
              }}
              onClick={() => {
                // Placeholder for support chat (already exists elsewhere)
                // Keeping this as a quick affordance in the simulated UI.
                setChatOpen(true);
              }}
            >
              Need a help? Chat with us
            </Typography>
          </Box>
        )}

        {/* Connection Status */}
        {!simulationEnabled && !isConnected && (
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

        {!simulationEnabled && error && (
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

        {/* Chat + Modals */}
        <DriverChatDrawer
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          driverName="John Driver"
        />

        <RateDriverModal
          open={rateDriverOpen}
          setOpen={setRateDriverOpen}
          driverName="John Driver"
          tripDuration="18 mins"
          onSubmit={() => {
            setRateDriverOpen(false);
            setRideStatus('completed');
            setRideCompletedOpen(true);
          }}
        />

        <RideCompletedModal
          open={rideCompletedOpen}
          setOpen={setRideCompletedOpen}
          onCompleteSurvey={() => {
            setRideCompletedOpen(false);
          }}
          onBackToHome={() => {
            setRideCompletedOpen(false);
          }}
        />
      </Box>
    </AppLayout>
  );
}
