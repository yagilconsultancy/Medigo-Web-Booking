import { io, Socket } from 'socket.io-client';
import { getAuthToken } from '../utils';

// Socket.IO connection configuration
const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || 'https://staging.getmedigo.com';
const TRACKING_NAMESPACE = '/tracking';
const SOCKET_PATH =
  process.env.NEXT_PUBLIC_SOCKET_PATH || '/api/v1/ws/socket.io';

let socket: Socket | null = null;

/**
 * Get or create Socket.IO connection for tracking namespace
 */
export const getTrackingSocket = (): Socket => {
  if (socket && socket.connected) {
    console.log('[SocketClient] Reusing existing connected socket:', socket.id);
    return socket;
  }

  const token = getAuthToken();
  const fullUrl = `${SOCKET_URL}${TRACKING_NAMESPACE}`;

  console.log('[SocketClient] Creating new socket connection:', {
    url: fullUrl,
    path: SOCKET_PATH,
    hasToken: Boolean(token),
  });

  socket = io(fullUrl, {
    path: SOCKET_PATH,
    auth: {
      token: token,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 10,
    timeout: 10000,
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
