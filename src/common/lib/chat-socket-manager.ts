import { io, Socket } from 'socket.io-client';
import { getAuthToken } from '../utils';

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || 'https://staging.getmedigo.com';
const SOCKET_PATH =
  process.env.NEXT_PUBLIC_SOCKET_PATH || '/api/v1/ws/socket.io';
const CHAT_NAMESPACE = '/chat';

let chatSocket: Socket | null = null;

export const getChatSocket = (): Socket => {
  if (chatSocket) {
    return chatSocket;
  }

  chatSocket = io(`${SOCKET_URL}${CHAT_NAMESPACE}`, {
    path: SOCKET_PATH,
    auth: {
      token: getAuthToken(),
    },
    autoConnect: false,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 10,
    timeout: 10000,
    transports: ['websocket', 'polling'],
  });

  return chatSocket;
};

export const disconnectChatSocket = () => {
  if (!chatSocket) return;
  chatSocket.disconnect();
  chatSocket = null;
};
