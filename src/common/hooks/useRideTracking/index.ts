import { useEffect, useRef, useState } from 'react';
import type { Socket } from 'socket.io-client';
import {
  getTrackingSocket,
} from '../../lib/socket-client';
import type {
  DispatchLocationUpdate,
  RideLocationUpdate,
  TrackingStartedEvent,
  TrackingEndedEvent,
  JoinRideResponse,
} from '../../types';
import { SocketEvent } from '../../types';

export interface UseRideTrackingReturn {
  isConnected: boolean;
  isJoined: boolean;
  socket: Socket | null;
  driverLocation: RideLocationUpdate | null;
  trackingStarted: TrackingStartedEvent | null;
  error: string | null;
}

/**
 * Hook to manage Socket.IO connection for rider to track their specific ride
 * @param params - Provide either `rideId` (join ride room) or `driverId` (listen for driver updates)
 */
export const useRideTracking = (params: {
  rideId?: string | null;
  driverId?: string | null;
}): UseRideTrackingReturn => {
  const rideId = params.rideId ?? null;
  const driverId = params.driverId ?? null;
  const [isConnected, setIsConnected] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [driverLocation, setDriverLocation] =
    useState<RideLocationUpdate | null>(null);
  const [trackingStarted, setTrackingStarted] =
    useState<TrackingStartedEvent | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!rideId && !driverId) {
      setError('No ride ID or driver ID provided');
      return;
    }

    let onConnect: (() => void) | undefined;
    let onDisconnect: ((reason: string) => void) | undefined;
    let onConnectError: ((err: Error) => void) | undefined;
    let onReconnect: ((attemptNumber: number) => void) | undefined;
    let onReconnectFailed: (() => void) | undefined;
    let onLocationUpdate: ((data: RideLocationUpdate) => void) | undefined;
    let onDispatchLocationUpdate:
      | ((data: DispatchLocationUpdate) => void)
      | undefined;
    let onTrackingStarted: ((data: TrackingStartedEvent) => void) | undefined;
    let onTrackingEnded: ((data: TrackingEndedEvent) => void) | undefined;
    let onAnyEvent:
      | ((eventName: string, ...args: unknown[]) => void)
      | undefined;

    try {
      const socket = getTrackingSocket();
      socketRef.current = socket;

      const joinRideRoom = () => {
        if (!rideId) return;
        socket.emit(
          SocketEvent.JOIN_RIDE,
          { ride_id: rideId },
          (response?: JoinRideResponse) => {
            if (!response) {
              console.info('[RideTracking] Join ride ack missing');
              // Some deployments may not acknowledge join_ride; don't treat as fatal.
              setIsJoined(true);
              return;
            }

            if (response.error) {
              console.error(
                '[RideTracking] Failed to join ride:',
                response.error
              );
              setError(response.error);
              return;
            }

            if (response.status === 'joined') {
              console.log(`[RideTracking] Joined ride room: ${response.room}`);
              setIsJoined(true);
            }
          }
        );
      };

      onConnect = () => {
        console.log('[RideTracking] Connected to tracking server');
        setIsConnected(true);
        setError(null);

        if (driverId) {
          // No room join required for this mode (server must broadcast dispatch updates).
          setIsJoined(true);
        } else {
          joinRideRoom();
        }
      };

      onDisconnect = (reason: string) => {
        console.log('[RideTracking] Disconnected:', reason);
        setIsConnected(false);
        setIsJoined(false);
      };

      onConnectError = (err: Error) => {
        console.error('[RideTracking] Connection error:', err.message);
        setError(`Connection error: ${err.message}`);
        setIsConnected(false);
      };

      onReconnect = (attemptNumber: number) => {
        console.log(
          `[RideTracking] Reconnected after ${attemptNumber} attempts`
        );
        setError(null);
        joinRideRoom();
      };

      onReconnectFailed = () => {
        console.error('[RideTracking] Reconnection failed');
        setError('Failed to reconnect to tracking server');
      };

      onLocationUpdate = (data: RideLocationUpdate) => {
        console.log('[RideTracking] Driver location update:', data);
        setDriverLocation(data);
      };

      onDispatchLocationUpdate = (data: DispatchLocationUpdate) => {
        if (!driverId) return;
        if (data.driver_id !== driverId) return;

        console.log('[RideTracking] Dispatch location update:', data);
        setDriverLocation({
          ride_id: data.ride_id,
          driver_id: data.driver_id,
          latitude: data.current_latitude,
          longitude: data.current_longitude,
          heading: data.current_heading,
          speed: data.current_speed,
          eta_minutes: data.eta_minutes,
          distance_remaining_miles: data.distance_remaining_miles,
          timestamp: data.timestamp,
        });
      };

      onTrackingStarted = (data: TrackingStartedEvent) => {
        console.log('[RideTracking] Tracking started:', data);
        setTrackingStarted(data);
      };

      onTrackingEnded = (data: TrackingEndedEvent) => {
        console.log('[RideTracking] Tracking ended:', data);
        setDriverLocation(null);
        setTrackingStarted(null);
      };

      // Connection event handlers
      socket.on(SocketEvent.CONNECT, onConnect);
      socket.on(SocketEvent.DISCONNECT, onDisconnect);
      socket.on(SocketEvent.CONNECT_ERROR, onConnectError);
      socket.on(SocketEvent.RECONNECT, onReconnect);
      socket.on(SocketEvent.RECONNECT_FAILED, onReconnectFailed);

      // Real-time driver location updates for this ride
      socket.on(SocketEvent.LOCATION_UPDATE, onLocationUpdate);
      socket.on(SocketEvent.DISPATCH_LOCATION_UPDATE, onDispatchLocationUpdate);

      // Tracking lifecycle events
      socket.on(SocketEvent.TRACKING_STARTED, onTrackingStarted);
      socket.on(SocketEvent.TRACKING_ENDED, onTrackingEnded);

      // Debug: log all socket events for this ride tracking hook.
      onAnyEvent = (eventName: string, ...args: unknown[]) => {
        // eslint-disable-next-line no-console
        console.log('[RideTracking] event:', eventName, ...args);
      };
      socket.onAny(onAnyEvent);

      // If already connected before handlers were registered, join immediately.
      if (socket.connected) {
        setIsConnected(true);
        setError(null);
        if (driverId) {
          setIsJoined(true);
        } else {
          joinRideRoom();
        }
      }
    } catch (err) {
      console.error('[RideTracking] Failed to initialize:', err);
      setError('Failed to initialize socket connection');
    }

    // Cleanup on unmount or when rideId changes
    return () => {
      const socket = socketRef.current;
      if (!socket) return;

      console.log('[RideTracking] Leaving ride');
      if (rideId) socket.emit(SocketEvent.LEAVE_RIDE, { ride_id: rideId });

      // Important: do not hard-disconnect the shared tracking socket here.
      // In development (React Strict Mode) effects mount/unmount twice, and
      // disconnecting causes flaky connects and missed acks/updates.
      if (onConnect) socket.off(SocketEvent.CONNECT, onConnect);
      if (onDisconnect) socket.off(SocketEvent.DISCONNECT, onDisconnect);
      if (onConnectError)
        socket.off(SocketEvent.CONNECT_ERROR, onConnectError);
      if (onReconnect) socket.off(SocketEvent.RECONNECT, onReconnect);
      if (onReconnectFailed)
        socket.off(SocketEvent.RECONNECT_FAILED, onReconnectFailed);
      if (onLocationUpdate)
        socket.off(SocketEvent.LOCATION_UPDATE, onLocationUpdate);
      if (onDispatchLocationUpdate)
        socket.off(
          SocketEvent.DISPATCH_LOCATION_UPDATE,
          onDispatchLocationUpdate
        );
      if (onTrackingStarted)
        socket.off(SocketEvent.TRACKING_STARTED, onTrackingStarted);
      if (onTrackingEnded)
        socket.off(SocketEvent.TRACKING_ENDED, onTrackingEnded);
      if (onAnyEvent) socket.offAny(onAnyEvent);

      setIsJoined(false);
      setDriverLocation(null);
      setTrackingStarted(null);
    };
  }, [rideId]);

  return {
    isConnected,
    isJoined,
    socket: socketRef.current,
    driverLocation,
    trackingStarted,
    error,
  };
};
