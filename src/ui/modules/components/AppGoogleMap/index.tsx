import {
  GoogleMap,
  Marker,
  OverlayView,
  Polyline,
} from '@react-google-maps/api';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
  routePath?: MarkerPosition[];

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
  return (
    Math.abs(a.lat - b.lat) < 0.000001 && Math.abs(a.lng - b.lng) < 0.000001
  );
}

function projectPointToSegment(
  point: MarkerPosition,
  segmentStart: MarkerPosition,
  segmentEnd: MarkerPosition
) {
  const segmentLat = segmentEnd.lat - segmentStart.lat;
  const segmentLng = segmentEnd.lng - segmentStart.lng;
  const segmentLengthSquared =
    segmentLat * segmentLat + segmentLng * segmentLng;

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
    const projectedPoint = projectPointToSegment(
      point,
      segmentStart,
      segmentEnd
    );
    const projectedDistance = getDistanceSquared(point, projectedPoint);

    if (projectedDistance < nearestDistance) {
      nearestDistance = projectedDistance;
      nearestHeading = getBearingDegrees(segmentStart, segmentEnd);
    }
  }

  return nearestHeading;
}

function projectPointToPolyline(
  point: MarkerPosition,
  polyline: MarkerPosition[]
) {
  if (polyline.length < 2) return point;

  let nearestPoint = polyline[0]!;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (let index = 0; index < polyline.length - 1; index += 1) {
    const segmentStart = polyline[index]!;
    const segmentEnd = polyline[index + 1]!;
    const projectedPoint = projectPointToSegment(
      point,
      segmentStart,
      segmentEnd
    );
    const projectedDistance = getDistanceSquared(point, projectedPoint);

    if (projectedDistance < nearestDistance) {
      nearestDistance = projectedDistance;
      nearestPoint = projectedPoint;
    }
  }

  return nearestPoint;
}

// ─── SVG truck icon ───────────────────────────────────────────────────────────
// A simple side-profile cargo truck rendered as an inline SVG string.
// We use a data URI so it works both as a google.maps.Icon url and as an <img>.
const TRUCK_SVG = `
  <svg width="116" height="114" viewBox="0 0 116 114" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_948_47804)">
    <path d="M19.0849 73.3782C16.7716 72.6723 15.3655 70.4104 15.6516 67.8331C16.0982 63.7785 17.3867 56.9564 20.9817 47.3931C24.5768 37.8297 28.1547 31.7062 30.5347 28.2414C32.0459 26.0379 34.6881 25.0112 37.0015 25.717L95.2193 43.4802C99.283 44.7201 101.624 48.8385 100.851 53.3537C100.081 57.849 98.7066 63.8745 96.2672 70.3637C93.8278 76.853 90.8553 82.3908 88.4336 86.3824C86.0016 90.3912 81.3665 92.3812 77.3028 91.1413L19.0849 73.3782Z" fill="#2F6FED"/>
    <path d="M62.0258 70.133L67.8246 80.0758C67.8246 80.0758 72.261 73.3479 75.7375 64.0998C79.214 54.8517 80.2284 47.0797 80.2284 47.0797L68.9168 51.8018L62.0258 70.133ZM41.5403 43.4489L37.4525 34.0281C37.4525 34.0281 33.6315 39.1191 29.5424 49.9968C25.4533 60.8746 25.0488 67.0243 25.0488 67.0243L34.6493 61.7801L41.5403 43.4489ZM54.8254 74.0662L36.9759 68.6201L29.7755 72.5533L58.8289 81.4179L54.8254 74.0662ZM65.851 44.7363L48.0015 39.2902L44.9357 32.2246L73.989 41.0892L65.851 44.7363Z" fill="#EAEAEA"/>
    <path d="M78.2056 32.1582L81.6277 33.2023L78.8713 40.5348L75.4493 39.4907L78.2056 32.1582ZM58.9109 83.4856L62.3329 84.5297L59.5766 91.8622L56.1545 90.818L58.9109 83.4856Z" fill="#2F6FED"/>
    </g>
    <defs>
    <clipPath id="clip0_948_47804">
    <rect width="89.2947" height="90.5821" fill="white" transform="matrix(0.919759 0.280632 -0.365158 0.971381 33.0767 0)"/>
    </clipPath>
    </defs>
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
      mapPaneName={OverlayView.FLOAT_PANE}
      getPixelPositionOffset={(w, h) => ({
        x: -(w / 2),
        y: -(h * 0.85),
      })}
    >
      <Box
        sx={{
          width: 64,
          height: 40,
          transform: `rotate(${rotation}deg)`,
          transition: 'transform 0.8s ease-out',
          filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.35))',
          pointerEvents: 'none',
          position: 'relative',
          zIndex: 1000,
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
  routePath: routePathProp,
  truckMarker,
  computeRoute,
}: AppGoogleMapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [routePath, setRoutePath] = useState<MarkerPosition[] | null>(null);
  const [animatedTruckPosition, setAnimatedTruckPosition] =
    useState<MarkerPosition | null>(truckMarker?.position ?? null);
  const animationFrameRef = useRef<number | null>(null);
  const previousTruckPositionRef = useRef<MarkerPosition | null>(
    truckMarker?.position ?? null
  );
  const hasFittedRouteRef = useRef(false);

  const onLoad = useCallback((m: google.maps.Map) => setMap(m), []);

  const allPositions = useMemo<MarkerPosition[]>(() => {
    const points = [...markerPositions];
    if (
      routeOrigin &&
      !markerPositions.some((point) => isSamePosition(point, routeOrigin))
    ) {
      points.unshift(routeOrigin);
    }
    if (truckMarker) points.push(truckMarker.position);
    return points;
  }, [markerPositions, routeOrigin, truckMarker]);

  const renderedRoutePath = routePathProp ?? routePath;

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
    if (!truckMarker?.position) {
      setAnimatedTruckPosition(null);
      previousTruckPositionRef.current = null;
      return;
    }

    const nextPosition = truckMarker.position;
    const startPosition = previousTruckPositionRef.current ?? nextPosition;

    if (isSamePosition(startPosition, nextPosition)) {
      setAnimatedTruckPosition(nextPosition);
      previousTruckPositionRef.current = nextPosition;
      return;
    }

    const animationDuration = 1200;
    const animationStart = performance.now();

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const animate = (timestamp: number) => {
      const progress = Math.min(
        (timestamp - animationStart) / animationDuration,
        1
      );
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setAnimatedTruckPosition({
        lat:
          startPosition.lat +
          (nextPosition.lat - startPosition.lat) * easedProgress,
        lng:
          startPosition.lng +
          (nextPosition.lng - startPosition.lng) * easedProgress,
      });

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        previousTruckPositionRef.current = nextPosition;
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
    if (!renderedRoutePath?.length) return animatedTruckPosition;
    return projectPointToPolyline(animatedTruckPosition, renderedRoutePath);
  }, [animatedTruckPosition, renderedRoutePath]);

  const renderedTruckHeading = useMemo(() => {
    if (!truckMarker) return 0;
    const routeDestination = renderedRoutePath?.[renderedRoutePath.length - 1];
    if (renderedTruckPosition && routeDestination) {
      return getBearingDegrees(renderedTruckPosition, routeDestination);
    }
    if (
      typeof truckMarker.heading === 'number' &&
      !Number.isNaN(truckMarker.heading)
    ) {
      return truckMarker.heading;
    }
    if (!renderedTruckPosition || !routePath?.length) return 0;
    return findNearestSegmentHeading(renderedTruckPosition, routePath) ?? 0;
  }, [renderedRoutePath, renderedTruckPosition, routePath, truckMarker]);

  useEffect(() => {
    if (!map || allPositions.length === 0 || hasFittedRouteRef.current) return;
    const bounds = new google.maps.LatLngBounds();
    const positionsForBounds = renderedRoutePath?.length
      ? [
          ...renderedRoutePath,
          ...markerPositions,
          ...(renderedTruckPosition ? [renderedTruckPosition] : []),
        ]
      : allPositions;
    positionsForBounds.forEach((position) => bounds.extend(position));
    map.fitBounds(bounds, {
      top: 220,
      right: 80,
      bottom: 80,
      left: 80,
    });
    hasFittedRouteRef.current = true;
  }, [
    allPositions,
    map,
    markerPositions,
    renderedRoutePath,
    renderedTruckPosition,
  ]);

  useEffect(() => {
    if (routePathProp?.length) {
      setRoutePath(null);
      hasFittedRouteRef.current = false;
      return;
    }

    if (!showDirections || !computeRoute) {
      setRoutePath(null);
      hasFittedRouteRef.current = false;
      return;
    }

    const routePoints: MarkerPosition[] = routeOrigin
      ? [
          routeOrigin,
          ...markerPositions.filter(
            (point) => !isSamePosition(point, routeOrigin)
          ),
        ]
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
      {renderedRoutePath && (
        <Polyline
          path={renderedRoutePath}
          options={{
            strokeColor: '#2F6FED',
            strokeOpacity: 1,
            strokeWeight: 6,
            zIndex: 1,
          }}
        />
      )}

      {/* Static ride markers */}
      {markerPositions.map((pos, i) => (
        <Marker
          key={i}
          position={pos}
          options={{ zIndex: i === 0 ? 30 : 31 }}
        />
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
