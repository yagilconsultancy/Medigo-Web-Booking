#!/usr/bin/env node
/**
 * Driver location simulator for the Socket.IO tracking service.
 *
 * This emits `update_location` events (driver-side) so the rider web app can
 * receive `location_update` after joining the ride room.
 *
 * Usage:
 *   DRIVER_TOKEN=... RIDE_ID=... node scripts/simulate-driver-location.mjs
 *
 * Optional:
 *   DRIVER_ID=driver-uuid
 *   INTERVAL_MS=5000
 *   ROUTE_FILE=./scripts/sample-route.json
 *   LOOP=1
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { io } from 'socket.io-client';

const SERVER_URL = process.env.SOCKET_URL || 'https://staging.getmedigo.com/tracking';
const SOCKET_PATH = process.env.SOCKET_PATH || '/api/v1/ws/socket.io';

const rideId = "17626a2b-56f9-4b12-bc7e-02dff370712b";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhNDY1NjcyZS1kNmRjLTRiOWQtYTFhYy1iMWY1YjM2YzhiZDciLCJyb2xlIjoiZHJpdmVyIiwiYnVzaW5lc3NfaWQiOiIyMGNmNzJmZC1kYjU4LTQ4NTUtYjM1ZC01YWMzYjFiODU1NmQiLCJlbWFpbCI6ImdhZmFyYWRldHVuamk0NzErZHJpdmVyQGdtYWlsLmNvbSIsImp0aSI6IjgxM2VjNWQ1LTNkOTItNGZjMi1hODZjLTJmODNhM2NjMWZiZSIsImlhdCI6MTc3OTczMDM3MSwiZXhwIjoxNzc5NzQ4MzcxLCJ0eXBlIjoiYWNjZXNzIn0.10n9mLqvrs7SDw5AIC_QrcVXO-xpBni619pJHQhzjF0";
const driverId = "a465672e-d6dc-4b9d-a1ac-b1f5b36c8bd7";
const intervalMs = Number(process.env.INTERVAL_MS || 5000);
const loop = process.env.LOOP === '1';
const routeFile = process.env.ROUTE_FILE || './scripts/sample-route.json';
const durationMs = Number(process.env.DURATION_MS || 10 * 60 * 1000);

if (!rideId) {
  console.error('Missing RIDE_ID env var.');
  process.exit(1);
}

if (!token) {
  console.error(
    'Missing DRIVER_TOKEN env var. `update_location` typically requires driver auth.'
  );
  process.exit(1);
}

function loadRoute() {
  if (routeFile) {
    const scriptDir = path.dirname(fileURLToPath(import.meta.url));
    const candidates = [
      routeFile,
      path.resolve(process.cwd(), routeFile),
      path.resolve(scriptDir, routeFile),
    ];

    const existing = candidates.find((p) => {
      try {
        return fs.existsSync(p);
      } catch {
        return false;
      }
    });

    if (!existing) {
      throw new Error(
        `ROUTE_FILE not found. Tried: ${candidates.join(', ')}. ` +
          `Tip: use ROUTE_FILE=./scripts/sample-route.json`
      );
    }

    const raw = fs.readFileSync(existing, 'utf8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error('ROUTE_FILE must be a JSON array of waypoints.');
    }
    return parsed;
  }

  // Default short route (Lagos-ish). Update as needed.
  return [
    { lat: 6.5244, lng: 3.3792, heading: 45, speed: 0 },
    { lat: 6.5239, lng: 3.3783, heading: 60, speed: 22 },
    { lat: 6.5232, lng: 3.3768, heading: 70, speed: 30 },
    { lat: 6.5224, lng: 3.3749, heading: 95, speed: 28 },
    { lat: 6.5212, lng: 3.3676, heading: 120, speed: 0 },
  ];
}

const route = loadRoute();

const socket = io(SERVER_URL, {
  path: SOCKET_PATH,
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  auth: { token },
});

let timer = null;
let index = 0;
let startedAtMs = 0;

function stop() {
  if (timer) clearInterval(timer);
  timer = null;
  try {
    socket.disconnect();
  } catch {
    // ignore
  }
}

function emitLocation(waypoint) {
  const payload = {
    ride_id: rideId,
    latitude: waypoint.lat,
    longitude: waypoint.lng,
    heading: waypoint.heading ?? null,
    speed: waypoint.speed ?? null, // km/h (server may convert if needed)
  };

  socket.emit('update_location', payload, (response) => {
    if (response?.error) {
      console.error('[update_location] error:', response.error);
      return;
    }
    console.log(
      `[update_location] ok ride=${rideId} driver=${driverId || '(env DRIVER_ID missing)'} lat=${payload.latitude} lng=${payload.longitude} heading=${payload.heading} speed=${payload.speed}`
    );
  });
}

socket.on('connect', () => {
  console.log('[tracking] connected:', socket.id);

  // Join ride room is not strictly required for emitting updates,
  // but it helps verify you're connected to the right namespace.
  socket.emit('join_ride', { ride_id: rideId }, (response) => {
    if (response?.error) {
      console.error('[join_ride] error:', response.error);
    } else {
      console.log('[join_ride] joined:', response?.room || '(room unknown)');
    }
  });

  if (timer) return;

  startedAtMs = Date.now();

  console.log(
    `[sim] starting route (${route.length} waypoints) interval=${intervalMs}ms loop=${loop ? 'on' : 'off'} durationMs=${durationMs}`
  );

  emitLocation(route[index]);
  timer = setInterval(() => {
    const elapsed = Date.now() - startedAtMs;
    if (Number.isFinite(durationMs) && durationMs > 0 && elapsed >= durationMs) {
      console.log(
        `[sim] duration reached (${Math.round(elapsed / 1000)}s); stopping.`
      );
      stop();
      return;
    }

    index += 1;
    if (index >= route.length) {
      if (loop) {
        index = 0;
      } else {
        // Keep emitting the last point until duration is reached (helps keep the map active).
        index = route.length - 1;
      }
    }
    emitLocation(route[index]);
  }, intervalMs);
});

socket.on('disconnect', (reason) => {
  console.log('[tracking] disconnected:', reason);
});

socket.on('connect_error', (err) => {
  console.error('[tracking] connect_error:', err?.message || err);
});

process.on('SIGINT', () => {
  console.log('\n[sim] stopping (SIGINT)');
  stop();
  process.exit(0);
});
