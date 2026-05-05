import {
  GoogleMap,
  Marker,
  OverlayView,
  Polyline,
} from '@react-google-maps/api';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import worldMap from './ui/assets/images/world-map.png';
import { StyledImage } from '../StyledImage';

export type MarkerPosition = { lat: number; lng: number };

export type TruckMarker = {
  position: MarkerPosition;
  /** Compass heading in degrees (0 = north, 90 = east, etc.) */
  heading?: number;
};

export type AppGoogleMapProps = {
  markerPositions: MarkerPosition[];
  mapContainerStyle?: React.CSSProperties;
  showDirections?: boolean;

  /**
   * When provided, renders an animated truck SVG at the given position instead
   * of a regular pin. Used for live driver tracking on the customer app.
   * The truck rotates to match the driver's heading.
   */
  truckMarker?: TruckMarker;

  /** injected route resolver */
  computeRoute?: (input: {
    origin: MarkerPosition;
    destination: MarkerPosition;
    waypoints?: MarkerPosition[];
  }) => Promise<{ polyline: MarkerPosition[] } | null>;
};

// ─── SVG truck icon ───────────────────────────────────────────────────────────
// A simple side-profile cargo truck rendered as an inline SVG string.
// We use a data URI so it works both as a google.maps.Icon url and as an <img>.
const TRUCK_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 40" width="64" height="40">
  <!-- Truck body / cargo box -->
  <rect x="2" y="4" width="38" height="26" rx="3" ry="3" fill="#2F6FED"/>
  <!-- Cab -->
  <rect x="40" y="10" width="20" height="20" rx="3" ry="3" fill="#2F6FED"/>
  <!-- Windscreen -->
  <rect x="42" y="12" width="14" height="10" rx="2" ry="2" fill="#BAE6FD" opacity="0.9"/>
  <!-- Undercarriage -->
  <rect x="2" y="28" width="58" height="4" rx="1" ry="1" fill="#2F6FED" opacity="0.2"/>
  <!-- Wheels -->
  <circle cx="14" cy="34" r="5" fill="#1E293B"/>
  <circle cx="14" cy="34" r="2.5" fill="#94A3B8"/>
  <circle cx="48" cy="34" r="5" fill="#1E293B"/>
  <circle cx="48" cy="34" r="2.5" fill="#94A3B8"/>
  <!-- Side stripe -->
  <rect x="4" y="16" width="34" height="3" rx="1.5" ry="1.5" fill="#fff" opacity="0.3"/>
</svg>
`.trim();

const TRUCK_DATA_URI = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(TRUCK_SVG)}`;

// ─── Custom truck overlay ─────────────────────────────────────────────────────
// We use OverlayView so we can apply a CSS rotation (heading) that
// google.maps.Marker.icon doesn't support cleanly across all browsers.
type TruckOverlayProps = {
  position: MarkerPosition;
  heading: number;
};

function TruckOverlay({ position, heading }: TruckOverlayProps) {
  return (
    <OverlayView
      position={position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      getPixelPositionOffset={(w, h) => ({ x: -(w / 2), y: -(h / 2) })}
    >
      <Box
        sx={{
          width: 64,
          height: 40,
          transform: `rotate(${heading}deg)`,
          transition: 'transform 0.8s ease-out',
          filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.35))',
          pointerEvents: 'none',
        }}
      >
        <StyledImage
          src={TRUCK_DATA_URI}
          alt="driver truck"
          width={64}
          height={40}
          style={{ display: 'block' }}
        />
      </Box>
    </OverlayView>
  );
}

export function AppGoogleMap({
  markerPositions,
  mapContainerStyle = { width: '100%', height: '500px' },
  showDirections = true,
  truckMarker,
  computeRoute,
}: AppGoogleMapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [routePath, setRoutePath] = useState<MarkerPosition[] | null>(null);

  const onLoad = useCallback((m: google.maps.Map) => setMap(m), []);

  // Fit bounds to include all static markers + truck position
  const allPositions = useMemo<MarkerPosition[]>(() => {
    const pts = [...markerPositions];
    if (truckMarker) pts.push(truckMarker.position);
    return pts;
  }, [markerPositions, truckMarker]);

  useEffect(() => {
    if (!map || allPositions.length === 0) return;
    const bounds = new google.maps.LatLngBounds();
    allPositions.forEach((p) => bounds.extend(p));
    map.fitBounds(bounds);
  }, [map, allPositions]);

  // Build route key from all positions so it re-resolves when truck moves
  const routeKey = useMemo(() => JSON.stringify(allPositions), [allPositions]);

  useEffect(() => {
    if (!showDirections || !computeRoute || allPositions.length < 2) {
      setRoutePath(null);
      return;
    }

    // When a truckMarker is present, route FROM the truck TO the last static marker.
    // Otherwise fall back to the original behaviour (first → last of markerPositions).
    const routePoints: MarkerPosition[] = truckMarker
      ? [truckMarker.position, ...markerPositions]
      : allPositions;

    const [origin, ...rest] = routePoints;
    const destination = rest[rest.length - 1];
    const waypoints = rest.slice(0, -1);

    let cancelled = false;

    if (!origin || !destination) return;

    computeRoute({ origin, destination, waypoints }).then((result) => {
      if (!cancelled) {
        setRoutePath((prev) => {
          if (JSON.stringify(prev) === JSON.stringify(result?.polyline))
            return prev;
          return result?.polyline ?? null;
        });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [routeKey, showDirections]);

  // ── Empty state ──────────────────────────────────────────────────────────
  if (allPositions.length === 0) {
    return (
      <Box
        sx={{
          ...mapContainerStyle,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 2,
          overflow: 'hidden',
          '&:hover .map-overlay': { opacity: 1 },
        }}
      >
        <StyledImage
          src={worldMap}
          alt="Add a location to see it on the map"
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <Box
          className="map-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 2,
            background: 'linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.55))',
            color: 'common.white',
            textAlign: 'center',
            transition: 'opacity 0.25s ease',
            opacity: 0,
          }}
        >
          <Typography variant="h6">
            No location yet — input a location to see it here
          </Typography>
        </Box>
      </Box>
    );
  }

  // ── Live map ─────────────────────────────────────────────────────────────
  return (
    <GoogleMap mapContainerStyle={mapContainerStyle} onLoad={onLoad}>
      {/* Route polyline */}
      {routePath && (
        <Polyline
          path={routePath}
          options={{
            strokeColor: '#2F6FED',
            strokeOpacity: 0.9,
            strokeWeight: 4,
          }}
        />
      )}

      {/* Static destination markers (skip truck position — rendered separately) */}
      {markerPositions.map((pos, i) => (
        <Marker key={i} position={pos} />
      ))}

      {/* Animated truck marker */}
      {truckMarker && (
        <TruckOverlay
          position={truckMarker.position}
          heading={truckMarker.heading ?? 0}
        />
      )}
    </GoogleMap>
  );
}
