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

type UseChatParams = {
  conversationId?: string | null;
};

export function useChat(params?: string | UseChatParams | null) {
  const conversationIdParam =
    typeof params === 'string' ? params : (params?.conversationId ?? null);
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const [typing, setTyping] = useState<string | null>(null);
  const [resolvedConversationId, setResolvedConversationId] = useState<
    string | null
  >(conversationIdParam);
  const currentUserId = useMemo(() => decodeUserIdFromToken(), []);

  useEffect(() => {
    setResolvedConversationId(conversationIdParam ?? null);
  }, [conversationIdParam]);

  useEffect(() => {
    if (!resolvedConversationId) return;

    const socket = getChatSocket();
    socketRef.current = socket;

    const handleConnect = () => {
      setConnected(true);
      console.log('[Chat] connected:', {
        socketId: socket.id,
        conversationId: resolvedConversationId,
        userId: currentUserId,
      });
      socket.emit('join_conversation', {
        conversation_id: resolvedConversationId,
      });
      console.log('[Chat] join_conversation emitted:', {
        conversationId: resolvedConversationId,
      });
    };

    const handleDisconnect = () => {
      setConnected(false);
      console.log('[Chat] disconnected:', {
        conversationId: resolvedConversationId,
      });
    };

    const handleNewMessage = (data: ChatMessage) => {
      if (data.conversation_id !== resolvedConversationId) return;
      setMessages((prev) => [...prev, data]);
    };

    const handleMessagesRead = (data: {
      conversation_id: string;
      reader_id: string;
      count?: number;
    }) => {
      if (data.conversation_id !== resolvedConversationId) return;

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
      if (data.conversation_id !== resolvedConversationId) return;
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
      console.log('[Chat] connecting:', {
        conversationId: resolvedConversationId,
        userId: currentUserId,
      });
      socket.connect();
    }

    return () => {
      console.log('[Chat] leaving conversation:', {
        conversationId: resolvedConversationId,
      });
      socket.emit('leave_conversation', {
        conversation_id: resolvedConversationId,
      });
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('new_message', handleNewMessage);
      socket.off('messages_read', handleMessagesRead);
      socket.off('typing', handleTyping);
      socket.off('connect_error', handleConnectError);
      socket.offAny(handleAnyEvent);
      disconnectChatSocket();
    };
  }, [currentUserId, resolvedConversationId]);

  const sendMessage = useCallback(
    (content: string, messageType = 'text') => {
      if (!resolvedConversationId || !currentUserId) return;

      const optimisticMessage: ChatMessage = {
        id: `optimistic-${Date.now()}`,
        conversation_id: resolvedConversationId,
        sender_id: currentUserId,
        content,
        message_type: messageType,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, optimisticMessage]);

      socketRef.current?.emit(
        'send_message',
        {
          conversation_id: resolvedConversationId,
          content,
          message_type: messageType,
        },
        (response?: unknown) => {
          console.log('[Chat] send_message ack:', response);
        }
      );
    },
    [currentUserId, resolvedConversationId]
  );

  const markRead = useCallback(() => {
    if (!resolvedConversationId) return;
    socketRef.current?.emit('mark_read', {
      conversation_id: resolvedConversationId,
    });
  }, [resolvedConversationId]);

  const sendTyping = useCallback(
    (isTyping: boolean) => {
      if (!resolvedConversationId) return;
      socketRef.current?.emit('typing', {
        conversation_id: resolvedConversationId,
        is_typing: isTyping,
      });
    },
    [resolvedConversationId]
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
