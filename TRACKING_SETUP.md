# Driver Tracking Setup & Testing Guide

## Architecture Overview

### Rider App (This Project) - LISTEN ONLY

- **Role:** Facility/Rider - watches driver location
- **Action:** Joins ride room via `join_ride` event
- **Receives:** `location_update` events from server
- **Does NOT:** Send location updates (that's the driver's job)

### Driver App (Mobile) - SEND ONLY

- **Role:** Driver - sends their GPS location
- **Action:** Emits `update_location` events
- **Server broadcasts:** `location_update` to ride room

### Test Script - Simulates Driver

- Located at: `scripts/simulate-driver-location.mjs`
- Mimics driver mobile app behavior for testing
- Not part of this project's production code

---

## How to Test Driver Tracking

### Step 1: Start the Rider App

```bash
npm run dev
```

Navigate to: `http://localhost:3000/live-track?ride_id=17626a2b-56f9-4b12-bc7e-02dff370712b`

### Step 2: Open Browser Console

Open DevTools and watch for these logs:

```
[SocketClient] Creating new socket connection: { url: '...', path: '...', hasToken: true }
[RideTracking] Connected to tracking server
[RideTracking] Joined ride room: ride_17626a2b-56f9-4b12-bc7e-02dff370712b
```

### Step 3: Start Driver Simulator (in separate terminal)

```bash
node scripts/simulate-driver-location.mjs
```

You should see:

```
[tracking] connected: <socket-id>
[join_ride] joined: ride_17626a2b-56f9-4b12-bc7e-02dff370712b
[update_location] ok ride=... lat=... lng=...
```

### Step 4: Verify Rider Receives Updates

In the browser console, you should now see:

```
[RideTracking] event: location_update { ride_id: '...', latitude: ..., longitude: ..., ... }
[LiveTrackPage] location_update: { ... }
```

The map should show:

- Driver truck marker moving along the route
- Driver speed, ETA, and distance remaining updating in real-time

---

## Troubleshooting

### No Connection

**Symptom:** "Connecting to tracking server..." never disappears

**Check:**

1. Is `NEXT_PUBLIC_SOCKET_URL` set correctly in `.env.local`?

   ```bash
   NEXT_PUBLIC_SOCKET_URL=https://staging.getmedigo.com
   NEXT_PUBLIC_SOCKET_PATH=/api/v1/ws/socket.io
   ```

2. Do you have a valid auth token?
   - Check browser DevTools → Application → Cookies → `ff_sid`
   - Or check console: `[SocketClient] hasToken: true`

3. Is the WebSocket server running?
   - Try: `curl https://staging.getmedigo.com/api/v1/ws/socket.io/`
   - Should return Socket.IO handshake response

### Connected But No Location Updates

**Symptom:** "Tracking live driver location" shows, but driver doesn't move

**Check:**

1. Is the driver simulator running? (`node scripts/simulate-driver-location.mjs`)
2. Are both using the same `RIDE_ID`?
3. Check driver simulator output - does it show `[update_location] ok`?
4. Check browser console - do you see `[RideTracking] event: location_update`?

### Map Not Showing

**Symptom:** Gray box with "Waiting for driver location..."

**Check:**

1. Is `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` set in `.env.local`?
2. Has `tracking_started` event been received?
   - This event includes pickup/destination coordinates
   - Without it, map won't have markers to display

### Wrong Ride Room

**Symptom:** Driver sends updates but rider doesn't receive them

**Check:**

1. URL parameter: `/live-track?ride_id=<RIDE_ID>`
2. Simulator `RIDE_ID` constant (line 27 in script)
3. Both must match exactly

---

## Socket Event Flow

### When Rider Opens `/live-track?ride_id=XXX`

```
1. useRideTracking hook initializes
   ↓
2. getTrackingSocket() creates socket connection
   ↓
3. Socket connects to wss://staging.getmedigo.com/tracking
   ↓
4. 'connect' event fires
   ↓
5. Emits 'join_ride' with { ride_id: 'XXX' }
   ↓
6. Server acknowledges: { status: 'joined', room: 'ride_XXX' }
   ↓
7. Hook sets isJoined = true
   ↓
8. Now listening for:
   - location_update (driver position)
   - tracking_started (ride metadata)
   - tracking_ended (ride complete)
```

### When Driver Starts Trip

```
1. Driver mobile app (or simulator) connects
   ↓
2. Emits 'update_location' with:
   { ride_id, latitude, longitude, heading, speed }
   ↓
3. Server receives update
   ↓
4. Server broadcasts 'location_update' to ride room
   ↓
5. All clients in ride room receive update
   ↓
6. Rider hook updates driverLocation state
   ↓
7. LiveTrackPage re-renders with new position
   ↓
8. Map shows updated truck marker
```

---

## Configuration Reference

### Environment Variables

```bash
# Socket.IO Connection
NEXT_PUBLIC_SOCKET_URL=https://staging.getmedigo.com
NEXT_PUBLIC_SOCKET_PATH=/api/v1/ws/socket.io

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here

# Auth Cookie Name (set by main app)
# Cookie: ff_sid=<JWT token>
```

### Test Data (scripts/simulate-driver-location.mjs)

```javascript
const rideId = '17626a2b-56f9-4b12-bc7e-02dff370712b';
const token = 'eyJ...'; // Driver JWT token
const driverId = 'a465672e-d6dc-4b9d-a1ac-b1f5b36c8bd7';
```

### Socket Connection Options

```typescript
{
  path: '/api/v1/ws/socket.io',
  auth: { token: '<JWT>' },
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 10,
  timeout: 10000,
  transports: ['websocket', 'polling']
}
```

---

## Key Files

### Rider App (This Project)

- `src/common/lib/socket-client.ts` - Socket.IO client singleton
- `src/common/hooks/useRideTracking/index.ts` - Tracking hook
- `src/ui/pages/LiveTrackPage/index.tsx` - Tracking UI
- `src/common/types/tracking.ts` - Socket event types

### Test Utilities

- `scripts/simulate-driver-location.mjs` - Driver simulator
- `scripts/sample-route.json` - Test route waypoints

---

## Production vs Development

### Development

- Use simulator script to test without real driver
- Console logs show all socket events (`onAny` listener)
- React DevTools show state updates

### Production

- Real driver mobile app sends `update_location`
- Rider app just listens (same code)
- Remove verbose console logs

---

## Common Mistakes

❌ **DO NOT** emit `update_location` from rider app
✅ **DO** only listen for `location_update`

❌ **DO NOT** modify the socket event names
✅ **DO** use exact event names from `SocketEvent` enum

❌ **DO NOT** hardcode socket URL in components
✅ **DO** use `getTrackingSocket()` from `socket-client.ts`

❌ **DO NOT** disconnect socket on component unmount
✅ **DO** just remove listeners (socket is shared singleton)

---

## Next Steps

1. ✅ Verify rider can connect and join ride room
2. ✅ Test with driver simulator
3. ✅ Confirm location updates appear on map
4. 🔄 Test with real driver mobile app
5. 🔄 Test reconnection behavior (kill server, restart)
6. 🔄 Test multiple riders tracking same driver
7. 🔄 Remove verbose logs for production

---

## Support

If tracking still doesn't work after following this guide:

1. Check browser console for errors
2. Check Network tab for WebSocket connection
3. Verify JWT token is valid and has correct role
4. Test with the working `join_ride.js` reference script
5. Compare socket connection options with working script
