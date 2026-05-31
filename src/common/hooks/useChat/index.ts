import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Socket } from 'socket.io-client';
import {
  disconnectChatSocket,
  getChatSocket,
} from '../../lib/chat-socket-manager';
import { getAuthToken } from '../../utils';

export type ChatMessage = {
  id?: string;
  message_id?: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type?: string;
  created_at: string;
  is_read?: boolean;
};

const decodeUserIdFromToken = () => {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(normalized));
    return typeof decoded.sub === 'string' ? decoded.sub : null;
  } catch {
    return null;
  }
};

export function useChat(conversationId?: string | null) {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const [typing, setTyping] = useState<string | null>(null);
  const currentUserId = useMemo(() => decodeUserIdFromToken(), []);

  useEffect(() => {
    if (!conversationId) return;

    const socket = getChatSocket();
    socketRef.current = socket;

    const handleConnect = () => {
      setConnected(true);
      socket.emit('join_conversation', { conversation_id: conversationId });
    };

    const handleDisconnect = () => {
      setConnected(false);
    };

    const handleNewMessage = (data: ChatMessage) => {
      if (data.conversation_id !== conversationId) return;
      setMessages((prev) => [...prev, data]);
    };

    const handleMessagesRead = (data: {
      conversation_id: string;
      reader_id: string;
      count?: number;
    }) => {
      if (data.conversation_id !== conversationId) return;

      setMessages((prev) =>
        prev.map((message) =>
          message.sender_id !== data.reader_id
            ? { ...message, is_read: true }
            : message
        )
      );
    };

    const handleTyping = (data: {
      conversation_id: string;
      user_id: string;
      is_typing: boolean;
    }) => {
      if (data.conversation_id !== conversationId) return;
      if (data.user_id === currentUserId) return;
      setTyping(data.is_typing ? data.user_id : null);
    };

    const handleConnectError = (error: Error) => {
      console.error('[Chat] Connection error:', error.message);
    };

    const handleAnyEvent = (eventName: string, ...args: unknown[]) => {
      if (
        eventName === 'typing' ||
        eventName === 'new_message' ||
        eventName === 'messages_read'
      ) {
        console.log(`[Chat] event: ${eventName}`, ...args);
      }
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('new_message', handleNewMessage);
    socket.on('messages_read', handleMessagesRead);
    socket.on('typing', handleTyping);
    socket.on('connect_error', handleConnectError);
    socket.onAny(handleAnyEvent);

    if (socket.connected) {
      handleConnect();
    } else {
      socket.connect();
    }

    return () => {
      socket.emit('leave_conversation', { conversation_id: conversationId });
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('new_message', handleNewMessage);
      socket.off('messages_read', handleMessagesRead);
      socket.off('typing', handleTyping);
      socket.off('connect_error', handleConnectError);
      socket.offAny(handleAnyEvent);
      disconnectChatSocket();
    };
  }, [conversationId, currentUserId]);

  const sendMessage = useCallback(
    (content: string, messageType = 'text') => {
      if (!conversationId || !currentUserId) return;

      const optimisticMessage: ChatMessage = {
        id: `optimistic-${Date.now()}`,
        conversation_id: conversationId,
        sender_id: currentUserId,
        content,
        message_type: messageType,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, optimisticMessage]);

      socketRef.current?.emit(
        'send_message',
        {
          conversation_id: conversationId,
          content,
          message_type: messageType,
        },
        (response?: unknown) => {
          console.log('[Chat] send_message ack:', response);
        }
      );
    },
    [conversationId, currentUserId]
  );

  const markRead = useCallback(() => {
    if (!conversationId) return;
    socketRef.current?.emit('mark_read', {
      conversation_id: conversationId,
    });
  }, [conversationId]);

  const sendTyping = useCallback(
    (isTyping: boolean) => {
      if (!conversationId) return;
      socketRef.current?.emit('typing', {
        conversation_id: conversationId,
        is_typing: isTyping,
      });
    },
    [conversationId]
  );

  return {
    messages,
    connected,
    typing,
    currentUserId,
    sendMessage,
    markRead,
    sendTyping,
  };
}
