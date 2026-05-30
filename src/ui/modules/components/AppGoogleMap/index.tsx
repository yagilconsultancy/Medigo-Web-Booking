import {
  GoogleMap,
  Marker,
  OverlayView,
  Polyline,
} from '@react-google-maps/api';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  routeOrigin?: MarkerPosition;

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

function getDistanceSquared(a: MarkerPosition, b: MarkerPosition) {
  const latDiff = a.lat - b.lat;
  const lngDiff = a.lng - b.lng;
  return latDiff * latDiff + lngDiff * lngDiff;
}

function isSamePosition(a?: MarkerPosition | null, b?: MarkerPosition | null) {
  if (!a || !b) return false;
  return Math.abs(a.lat - b.lat) < 0.000001 && Math.abs(a.lng - b.lng) < 0.000001;
}

function projectPointToSegment(
  point: MarkerPosition,
  segmentStart: MarkerPosition,
  segmentEnd: MarkerPosition
) {
  const segmentLat = segmentEnd.lat - segmentStart.lat;
  const segmentLng = segmentEnd.lng - segmentStart.lng;
  const segmentLengthSquared = segmentLat * segmentLat + segmentLng * segmentLng;

  if (segmentLengthSquared === 0) return segmentStart;

  const ratio =
    ((point.lat - segmentStart.lat) * segmentLat +
      (point.lng - segmentStart.lng) * segmentLng) /
    segmentLengthSquared;
  const clampedRatio = Math.max(0, Math.min(1, ratio));

  return {
    lat: segmentStart.lat + segmentLat * clampedRatio,
    lng: segmentStart.lng + segmentLng * clampedRatio,
  };
}

function findNearestPointOnPolyline(
  point: MarkerPosition,
  polyline: MarkerPosition[]
) {
  if (polyline.length === 0) return point;
  if (polyline.length === 1) return polyline[0]!;

  let nearestPoint = polyline[0]!;
  let nearestDistance = getDistanceSquared(point, nearestPoint);

  for (let index = 0; index < polyline.length - 1; index += 1) {
    const segmentStart = polyline[index]!;
    const segmentEnd = polyline[index + 1]!;
    const projectedPoint = projectPointToSegment(point, segmentStart, segmentEnd);
    const projectedDistance = getDistanceSquared(point, projectedPoint);

    if (projectedDistance < nearestDistance) {
      nearestDistance = projectedDistance;
      nearestPoint = projectedPoint;
    }
  }

  return nearestPoint;
}

function getBearingDegrees(from: MarkerPosition, to: MarkerPosition) {
  const lat1 = (from.lat * Math.PI) / 180;
  const lat2 = (to.lat * Math.PI) / 180;
  const lngDelta = ((to.lng - from.lng) * Math.PI) / 180;

  const y = Math.sin(lngDelta) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lngDelta);

  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

function findNearestSegmentHeading(
  point: MarkerPosition,
  polyline: MarkerPosition[]
) {
  if (polyline.length < 2) return null;

  let nearestHeading = getBearingDegrees(polyline[0]!, polyline[1]!);
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (let index = 0; index < polyline.length - 1; index += 1) {
    const segmentStart = polyline[index]!;
    const segmentEnd = polyline[index + 1]!;
    const projectedPoint = projectPointToSegment(point, segmentStart, segmentEnd);
    const projectedDistance = getDistanceSquared(point, projectedPoint);

    if (projectedDistance < nearestDistance) {
      nearestDistance = projectedDistance;
      nearestHeading = getBearingDegrees(segmentStart, segmentEnd);
    }
  }

  return nearestHeading;
}

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
  const rotation = heading - 90;

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
          transform: `rotate(${rotation}deg)`,
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
  routeOrigin,
  truckMarker,
  computeRoute,
}: AppGoogleMapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [routePath, setRoutePath] = useState<MarkerPosition[] | null>(null);
  const [animatedTruckPosition, setAnimatedTruckPosition] = useState<MarkerPosition | null>(
    truckMarker?.position ?? null
  );
  const animationFrameRef = useRef<number | null>(null);
  const hasFittedRouteRef = useRef(false);

  const onLoad = useCallback((m: google.maps.Map) => setMap(m), []);

  const allPositions = useMemo<MarkerPosition[]>(() => {
    const points = [...markerPositions];
    if (routeOrigin && !markerPositions.some((point) => isSamePosition(point, routeOrigin))) {
      points.unshift(routeOrigin);
    }
    if (truckMarker) points.push(truckMarker.position);
    return points;
  }, [markerPositions, routeOrigin, truckMarker]);

  const routeKey = useMemo(
    () =>
      JSON.stringify({
        routeOrigin: routeOrigin ?? null,
        markerPositions,
        showDirections,
      }),
    [markerPositions, routeOrigin, showDirections]
  );

  useEffect(() => {
    setAnimatedTruckPosition(truckMarker?.position ?? null);
  }, [truckMarker?.position?.lat, truckMarker?.position?.lng]);

  useEffect(() => {
    if (!truckMarker?.position) return;

    const nextPosition = truckMarker.position;
    const startPosition = animatedTruckPosition ?? nextPosition;
    const animationDuration = 1200;
    const animationStart = performance.now();

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const animate = (timestamp: number) => {
      const progress = Math.min((timestamp - animationStart) / animationDuration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setAnimatedTruckPosition({
        lat: startPosition.lat + (nextPosition.lat - startPosition.lat) * easedProgress,
        lng: startPosition.lng + (nextPosition.lng - startPosition.lng) * easedProgress,
      });

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [truckMarker?.position?.lat, truckMarker?.position?.lng]);

  const renderedTruckPosition = useMemo(() => {
    if (!animatedTruckPosition) return null;
    if (!routePath?.length) return animatedTruckPosition;
    return findNearestPointOnPolyline(animatedTruckPosition, routePath);
  }, [animatedTruckPosition, routePath]);

  const renderedTruckHeading = useMemo(() => {
    if (!truckMarker) return 0;
    if (!renderedTruckPosition || !routePath?.length) return truckMarker.heading ?? 0;
    return findNearestSegmentHeading(renderedTruckPosition, routePath) ?? truckMarker.heading ?? 0;
  }, [renderedTruckPosition, routePath, truckMarker]);

  useEffect(() => {
    if (!map || allPositions.length === 0 || hasFittedRouteRef.current) return;
    const bounds = new google.maps.LatLngBounds();
    const positionsForBounds = routePath?.length ? routePath : allPositions;
    positionsForBounds.forEach((position) => bounds.extend(position));
    map.fitBounds(bounds, {
      top: 220,
      right: 80,
      bottom: 80,
      left: 80,
    });
    hasFittedRouteRef.current = true;
  }, [allPositions, map, routePath]);

  useEffect(() => {
    if (!showDirections || !computeRoute) {
      setRoutePath(null);
      hasFittedRouteRef.current = false;
      return;
    }

    const routePoints: MarkerPosition[] = routeOrigin
      ? [routeOrigin, ...markerPositions.filter((point) => !isSamePosition(point, routeOrigin))]
      : markerPositions;

    const [origin, ...rest] = routePoints;
    const destination = rest[rest.length - 1];
    const waypoints = rest.slice(0, -1);

    let cancelled = false;

    if (!origin || !destination) return;

    computeRoute({ origin, destination, waypoints }).then((result) => {
      if (!cancelled) {
        hasFittedRouteRef.current = false;
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
  }, [computeRoute, markerPositions, routeKey, routeOrigin, showDirections]);

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
            strokeOpacity: 1,
            strokeWeight: 6,
            zIndex: 20,
          }}
        />
      )}

      {/* Static ride markers */}
      {markerPositions.map((pos, i) => (
        <Marker key={i} position={pos} />
      ))}

      {/* Animated truck marker */}
      {truckMarker && renderedTruckPosition && (
        <TruckOverlay
          position={renderedTruckPosition}
          heading={renderedTruckHeading}
        />
      )}
    </GoogleMap>
  );
}
