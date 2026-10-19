'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import { AppGoogleMapsProvider, AppGoogleMap } from '../../modules/components';
import type { MarkerPosition } from '../../modules/components/AppGoogleMap';

/**
 * Read-only trip view for a link a rider shared with family.
 * No login, no cookies, no rider details: the server only returns the status,
 * the addresses, the driver's first name and vehicle, and the live position
 * while the ride is active. The link stops working 1 hour after the ride ends.
 */

const POLL_MS = 10_000;

type TripView = {
  status: string;
  ended: boolean;
  pickup_address: string;
  destination_address: string;
  pickup_latitude: number | null;
  pickup_longitude: number | null;
  destination_latitude: number | null;
  destination_longitude: number | null;
  scheduled_at: string;
  driver: {
    first_name: string | null;
    vehicle_make: string | null;
    vehicle_model: string | null;
    vehicle_color: string | null;
    vehicle_plate: string | null;
  } | null;
  driver_location: { latitude: number; longitude: number } | null;
};

type Lang = 'en' | 'fr';

const TEXT = {
  en: {
    title: 'Following a MediGo trip',
    readOnly:
      'This is a read-only view. You can follow the trip but you cannot change it.',
    loading: 'Loading the trip…',
    unavailableTitle: 'This trip link is no longer available',
    unavailableBody:
      'Trip links stop working one hour after the trip ends, or the link may be incorrect. Please ask the rider to share a new link if the trip is still going.',
    retrying: 'We could not refresh the trip. Trying again…',
    updated: 'Updates every 10 seconds',
    pickup: 'Pickup',
    destination: 'Destination',
    scheduled: 'Scheduled for',
    driver: 'Driver',
    vehicle: 'Vehicle',
    plate: 'Plate',
    noDriverYet: 'A driver has not been assigned yet.',
    mapLabel: 'Map showing the pickup, the destination and the driver',
    status: {
      waiting: 'Waiting for a driver',
      driver_assigned: 'A driver has been assigned',
      driver_en_route: 'The driver is on the way',
      driver_arrived: 'The driver has arrived',
      in_progress: 'The trip is in progress',
      completed: 'The trip is complete',
      cancelled: 'The trip was cancelled',
      no_show: 'The trip ended (no show)',
    },
  },
  fr: {
    title: 'Suivi d’un trajet MediGo',
    readOnly:
      'Cette vue est en lecture seule. Vous pouvez suivre le trajet, mais vous ne pouvez pas le modifier.',
    loading: 'Chargement du trajet…',
    unavailableTitle: 'Ce lien de trajet n’est plus disponible',
    unavailableBody:
      'Les liens de trajet cessent de fonctionner une heure après la fin du trajet, ou le lien est peut-être incorrect. Demandez au passager de partager un nouveau lien si le trajet est toujours en cours.',
    retrying: 'Impossible d’actualiser le trajet. Nouvelle tentative…',
    updated: 'Mise à jour toutes les 10 secondes',
    pickup: 'Prise en charge',
    destination: 'Destination',
    scheduled: 'Prévu pour',
    driver: 'Chauffeur',
    vehicle: 'Véhicule',
    plate: 'Plaque',
    noDriverYet: 'Aucun chauffeur n’a encore été assigné.',
    mapLabel: 'Carte montrant le point de départ, la destination et le chauffeur',
    status: {
      waiting: 'En attente d’un chauffeur',
      driver_assigned: 'Un chauffeur a été assigné',
      driver_en_route: 'Le chauffeur est en route',
      driver_arrived: 'Le chauffeur est arrivé',
      in_progress: 'Le trajet est en cours',
      completed: 'Le trajet est terminé',
      cancelled: 'Le trajet a été annulé',
      no_show: 'Le trajet est terminé (absence)',
    },
  },
} as const;

function pickLang(): Lang {
  if (typeof navigator === 'undefined') return 'en';
  return navigator.language?.toLowerCase().startsWith('fr') ? 'fr' : 'en';
}

function statusKey(status: string): keyof (typeof TEXT)['en']['status'] {
  switch (status) {
    case 'driver_assigned':
    case 'driver_en_route':
    case 'driver_arrived':
    case 'in_progress':
    case 'completed':
    case 'cancelled':
    case 'no_show':
      return status;
    default:
      return 'waiting';
  }
}

function toPosition(
  lat: number | null | undefined,
  lng: number | null | undefined
): MarkerPosition | null {
  if (typeof lat !== 'number' || typeof lng !== 'number') return null;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

export function TrackSharedRidePage({ token }: { token: string }) {
  const [lang, setLang] = useState<Lang>('en');
  const [trip, setTrip] = useState<TripView | null>(null);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const stoppedRef = useRef(false);

  useEffect(() => setLang(pickLang()), []);
  const t = TEXT[lang];

  const load = useCallback(async () => {
    const base = process.env['NEXT_PUBLIC_BASE_API_URL'];
    if (!base) {
      setRetrying(true);
      return;
    }
    try {
      const response = await fetch(
        `${base}/v1/rides/public/track/${encodeURIComponent(token)}`,
        {
          method: 'GET',
          headers: { Accept: 'application/json' },
          cache: 'no-store',
          credentials: 'omit',
          referrerPolicy: 'no-referrer',
        }
      );
      // 429 (too many requests) or 408 (timeout) are temporary: keep the
      // trip on screen, say we are retrying, and try again on the next tick.
      if (response.status === 429 || response.status === 408) {
        setRetrying(true);
        return;
      }
      if (response.status >= 400 && response.status < 500) {
        stoppedRef.current = true;
        setUnavailable(true);
        setTrip(null);
        return;
      }
      if (!response.ok) throw new Error('bad response');
      const body = await response.json();
      setTrip(body.data as TripView);
      setRetrying(false);
      if ((body.data as TripView).ended) stoppedRef.current = true;
    } catch {
      setRetrying(true);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    stoppedRef.current = false;
    load();
    const timer = window.setInterval(() => {
      if (stoppedRef.current || document.hidden) return;
      load();
    }, POLL_MS);
    return () => window.clearInterval(timer);
  }, [load]);

  const pickup = toPosition(trip?.pickup_latitude, trip?.pickup_longitude);
  const destination = toPosition(
    trip?.destination_latitude,
    trip?.destination_longitude
  );
  const driverPosition = toPosition(
    trip?.driver_location?.latitude,
    trip?.driver_location?.longitude
  );
  const markers = useMemo(
    () =>
      [pickup, destination].filter((p): p is MarkerPosition => p !== null),
    [pickup?.lat, pickup?.lng, destination?.lat, destination?.lng] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const apiKey = process.env['NEXT_PUBLIC_GOOGLE_MAPS_API_KEY'];

  const scheduled = trip
    ? new Date(trip.scheduled_at).toLocaleString(
        lang === 'fr' ? 'fr-CA' : 'en-CA',
        { dateStyle: 'medium', timeStyle: 'short' }
      )
    : '';

  const vehicle = trip?.driver
    ? [
        trip.driver.vehicle_color,
        trip.driver.vehicle_make,
        trip.driver.vehicle_model,
      ]
        .filter(Boolean)
        .join(' ')
    : '';

  return (
    <Box
      component="main"
      lang={lang}
      sx={{ maxWidth: 720, mx: 'auto', px: 2, py: 3 }}
    >
      <Typography component="h1" variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        {t.title}
      </Typography>
      <Typography sx={{ color: 'text.secondary', mb: 2 }}>
        {t.readOnly}
      </Typography>

      {loading && (
        <Stack direction="row" spacing={1.5} alignItems="center" role="status">
          <CircularProgress size={20} aria-hidden />
          <Typography>{t.loading}</Typography>
        </Stack>
      )}

      {unavailable && (
        <Paper variant="outlined" sx={{ p: 3 }} role="alert">
          <Typography component="h2" variant="h6" sx={{ mb: 1 }}>
            {t.unavailableTitle}
          </Typography>
          <Typography>{t.unavailableBody}</Typography>
        </Paper>
      )}

      {trip && (
        <>
          <Paper variant="outlined" sx={{ p: 2.5, mb: 2 }}>
            <Typography
              component="h2"
              variant="h6"
              sx={{ fontWeight: 700 }}
              role="status"
              aria-live="polite"
            >
              {t.status[statusKey(trip.status)]}
            </Typography>
            {!trip.ended && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {t.updated}
              </Typography>
            )}
            {retrying && (
              <Typography variant="body2" sx={{ color: 'error.main', mt: 1 }}>
                {t.retrying}
              </Typography>
            )}
          </Paper>

          {apiKey && markers.length > 0 && (
            <Box
              role="img"
              aria-label={t.mapLabel}
              sx={{ borderRadius: 2, overflow: 'hidden', mb: 2 }}
            >
              <AppGoogleMapsProvider apiKey={apiKey}>
                <AppGoogleMap
                  markerPositions={markers}
                  truckMarker={
                    driverPosition ? { position: driverPosition } : undefined
                  }
                  mapContainerStyle={{ width: '100%', height: '320px' }}
                />
              </AppGoogleMapsProvider>
            </Box>
          )}

          <Paper variant="outlined" sx={{ p: 2.5, mb: 2 }}>
            <Stack spacing={2} component="dl" sx={{ m: 0 }}>
              <Box>
                <Typography component="dt" variant="subtitle2">
                  {t.pickup}
                </Typography>
                <Typography component="dd" sx={{ m: 0 }}>
                  {trip.pickup_address}
                </Typography>
              </Box>
              <Box>
                <Typography component="dt" variant="subtitle2">
                  {t.destination}
                </Typography>
                <Typography component="dd" sx={{ m: 0 }}>
                  {trip.destination_address}
                </Typography>
              </Box>
              {!trip.ended && (
                <Box>
                  <Typography component="dt" variant="subtitle2">
                    {t.scheduled}
                  </Typography>
                  <Typography component="dd" sx={{ m: 0 }}>
                    {scheduled}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Paper>

          {!trip.ended && (
            <Paper variant="outlined" sx={{ p: 2.5 }}>
              {trip.driver ? (
                <Stack spacing={2} component="dl" sx={{ m: 0 }}>
                  {trip.driver.first_name && (
                    <Box>
                      <Typography component="dt" variant="subtitle2">
                        {t.driver}
                      </Typography>
                      <Typography component="dd" sx={{ m: 0 }}>
                        {trip.driver.first_name}
                      </Typography>
                    </Box>
                  )}
                  {vehicle && (
                    <Box>
                      <Typography component="dt" variant="subtitle2">
                        {t.vehicle}
                      </Typography>
                      <Typography component="dd" sx={{ m: 0 }}>
                        {vehicle}
                      </Typography>
                    </Box>
                  )}
                  {trip.driver.vehicle_plate && (
                    <Box>
                      <Typography component="dt" variant="subtitle2">
                        {t.plate}
                      </Typography>
                      <Typography component="dd" sx={{ m: 0 }}>
                        {trip.driver.vehicle_plate}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              ) : (
                <Typography>{t.noDriverYet}</Typography>
              )}
            </Paper>
          )}
        </>
      )}
    </Box>
  );
}
