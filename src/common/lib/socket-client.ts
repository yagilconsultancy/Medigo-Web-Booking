import { io, Socket } from 'socket.io-client';
import { getAuthToken } from '../utils';

// Socket.IO connection configuration
const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8000';
const TRACKING_NAMESPACE = '/tracking';

let socket: Socket | null = null;

/**
 * Get or create Socket.IO connection for tracking namespace
 */
export const getTrackingSocket = (): Socket => {
  if (socket && socket.connected) {
    return socket;
  }

  const token = getAuthToken();

  socket = io(`${SOCKET_URL}${TRACKING_NAMESPACE}`, {
    auth: {
      token: token,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    transports: ['websocket', 'polling'], // Prefer WebSocket, fallback to polling
  });

  return socket;
};

/**
 * Disconnect Socket.IO connection
 */
export const disconnectTrackingSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Check if socket is connected
 */
export const isSocketConnected = (): boolean => {
  return socket?.connected ?? false;
};
