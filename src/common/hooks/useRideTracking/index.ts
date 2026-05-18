import { useEffect, useRef, useState } from 'react';
import type { Socket } from 'socket.io-client';
import {
  getTrackingSocket,
  disconnectTrackingSocket,
} from '../../lib/socket-client';
import type {
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
 * @param rideId - The ride ID to track
 */
export const useRideTracking = (
  rideId: string | null
): UseRideTrackingReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [driverLocation, setDriverLocation] =
    useState<RideLocationUpdate | null>(null);
  const [trackingStarted, setTrackingStarted] =
    useState<TrackingStartedEvent | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!rideId) {
      setError('No ride ID provided');
      return;
    }

    try {
      const socket = getTrackingSocket();
      socketRef.current = socket;

      // Connection event handlers
      socket.on(SocketEvent.CONNECT, () => {
        console.log('[RideTracking] Connected to tracking server');
        setIsConnected(true);
        setError(null);

        // Join this specific ride's room
        socket.emit(
          SocketEvent.JOIN_RIDE,
          { ride_id: rideId },
          (response: JoinRideResponse) => {
            if (response.error) {
              console.error(
                '[RideTracking] Failed to join ride:',
                response.error
              );
              setError(response.error);
            } else if (response.status === 'joined') {
              console.log(`[RideTracking] Joined ride room: ${response.room}`);
              setIsJoined(true);
            }
          }
        );
      });

      socket.on(SocketEvent.DISCONNECT, (reason: string) => {
        console.log('[RideTracking] Disconnected:', reason);
        setIsConnected(false);
        setIsJoined(false);
      });

      socket.on(SocketEvent.CONNECT_ERROR, (err: Error) => {
        console.error('[RideTracking] Connection error:', err.message);
        setError(`Connection error: ${err.message}`);
        setIsConnected(false);
      });

      socket.on(SocketEvent.RECONNECT, (attemptNumber: number) => {
        console.log(
          `[RideTracking] Reconnected after ${attemptNumber} attempts`
        );
        setError(null);

        // Re-join ride room after reconnection
        socket.emit(
          SocketEvent.JOIN_RIDE,
          { ride_id: rideId },
          (response: JoinRideResponse) => {
            if (response.status === 'joined') {
              setIsJoined(true);
            }
          }
        );
      });

      socket.on(SocketEvent.RECONNECT_FAILED, () => {
        console.error('[RideTracking] Reconnection failed');
        setError('Failed to reconnect to tracking server');
      });

      // Real-time driver location updates for this ride
      socket.on(SocketEvent.LOCATION_UPDATE, (data: RideLocationUpdate) => {
        console.log('[RideTracking] Driver location update:', data);
        setDriverLocation(data);
      });

      // Tracking lifecycle events
      socket.on(SocketEvent.TRACKING_STARTED, (data: TrackingStartedEvent) => {
        console.log('[RideTracking] Tracking started:', data);
        setTrackingStarted(data);
      });

      socket.on(SocketEvent.TRACKING_ENDED, (data: TrackingEndedEvent) => {
        console.log('[RideTracking] Tracking ended:', data);
        setDriverLocation(null);
        setTrackingStarted(null);
      });

      // If already connected, trigger connect handler
      if (socket.connected) {
        socket.emit('connect');
      }
    } catch (err) {
      console.error('[RideTracking] Failed to initialize:', err);
      setError('Failed to initialize socket connection');
    }

    // Cleanup on unmount or when rideId changes
    return () => {
      if (socketRef.current) {
        console.log('[RideTracking] Leaving ride and disconnecting');
        socketRef.current.emit(SocketEvent.LEAVE_RIDE, { ride_id: rideId });
        disconnectTrackingSocket();
        setIsConnected(false);
        setIsJoined(false);
        setDriverLocation(null);
      }
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
