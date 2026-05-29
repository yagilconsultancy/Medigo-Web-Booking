import { useEffect, useRef, useState } from 'react';
import type { Socket } from 'socket.io-client';
import {
  getTrackingSocket,
  disconnectTrackingSocket,
} from '../../lib/socket-client';
import type {
  DispatchLocationUpdate,
  TrackingStartedEvent,
  TrackingEndedEvent,
  JoinDispatchCenterResponse,
} from '../../types';
import { SocketEvent } from '../../types';

export interface UseDispatchSocketReturn {
  isConnected: boolean;
  isJoined: boolean;
  socket: Socket | null;
  locationUpdates: Map<string, DispatchLocationUpdate>;
  error: string | null;
}

/**
 * Hook to manage Socket.IO connection for dispatch center live tracking
 */
export const useDispatchSocket = (): UseDispatchSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const locationUpdatesRef = useRef<Map<string, DispatchLocationUpdate>>(
    new Map()
  );
  const [, forceUpdate] = useState({});

  // Initialize socket connection
  useEffect(() => {
    try {
      const socket = getTrackingSocket();
      socketRef.current = socket;

      // Connection event handlers
      socket.on(SocketEvent.CONNECT, () => {
        console.log('[Socket] Connected to tracking server');
        setIsConnected(true);
        setError(null);

        // Join dispatch center room
        socket.emit(
          SocketEvent.JOIN_DISPATCH_CENTER,
          (response?: JoinDispatchCenterResponse) => {
            if (!response) {
              console.warn('[Socket] Join dispatch ack missing');
              return;
            }

            if (response.status === 'joined') {
              console.log(
                `[Socket] Joined dispatch center room: ${response.room}`
              );
              setIsJoined(true);
            } else {
              console.error(
                '[Socket] Failed to join dispatch center:',
                response.message
              );
              setError(response.message || 'Failed to join dispatch center');
            }
          }
        );
      });

      socket.on(SocketEvent.DISCONNECT, (reason: string) => {
        console.log('[Socket] Disconnected:', reason);
        setIsConnected(false);
        setIsJoined(false);
      });

      socket.on(SocketEvent.CONNECT_ERROR, (err: Error) => {
        console.error('[Socket] Connection error:', err.message);
        setError(`Connection error: ${err.message}`);
        setIsConnected(false);
      });

      socket.on(SocketEvent.RECONNECT, (attemptNumber: number) => {
        console.log(`[Socket] Reconnected after ${attemptNumber} attempts`);
        setError(null);
      });

      socket.on(SocketEvent.RECONNECT_FAILED, () => {
        console.error('[Socket] Reconnection failed');
        setError('Failed to reconnect to tracking server');
      });

      // Real-time location updates
      socket.on(
        SocketEvent.DISPATCH_LOCATION_UPDATE,
        (data: DispatchLocationUpdate) => {
          console.log('[Socket] Location update:', data);
          locationUpdatesRef.current.set(data.ride_id, data);
          forceUpdate({}); // Force re-render with new location data
        }
      );

      // Tracking lifecycle events
      socket.on(SocketEvent.TRACKING_STARTED, (data: TrackingStartedEvent) => {
        console.log('[Socket] New trip started:', data);
        // You can emit a custom event or callback here if needed
      });

      socket.on(SocketEvent.TRACKING_ENDED, (data: TrackingEndedEvent) => {
        console.log('[Socket] Trip ended:', data);
        // Remove trip from location updates
        locationUpdatesRef.current.delete(data.ride_id);
        forceUpdate({});
      });

      // If already connected, trigger connect handler
      if (socket.connected) {
        socket.emit('connect');
      }
    } catch (err) {
      console.error('[Socket] Failed to initialize:', err);
      setError('Failed to initialize socket connection');
    }

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        console.log('[Socket] Leaving dispatch center and disconnecting');
        socketRef.current.emit(SocketEvent.LEAVE_DISPATCH_CENTER);
        disconnectTrackingSocket();
        setIsConnected(false);
        setIsJoined(false);
      }
    };
  }, []);

  return {
    isConnected,
    isJoined,
    socket: socketRef.current,
    locationUpdates: locationUpdatesRef.current,
    error,
  };
};
