'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { pxToRem } from '@/common';

const DRIVER_ID = 'a465672e-d6dc-4b9d-a1ac-b1f5b36c8bd7';
const DRIVER_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhNDY1NjcyZS1kNmRjLTRiOWQtYTFhYy1iMWY1YjM2YzhiZDciLCJyb2xlIjoiZHJpdmVyIiwiYnVzaW5lc3NfaWQiOiIyMGNmNzJmZC1kYjU4LTQ4NTUtYjM1ZC01YWMzYjFiODU1NmQiLCJlbWFpbCI6ImdhZmFyYWRldHVuamk0NzErZHJpdmVyQGdtYWlsLmNvbSIsImp0aSI6IjgyODA2ZGI4LWNkM2MtNGYzZi05ZDBiLTYwYjA1MDI0MGRiYSIsImlhdCI6MTc4MDE3NTc4OCwiZXhwIjoxNzgwMTkzNzg4LCJ0eXBlIjoiYWNjZXNzIn0.BkxJnUBcAriAwCbDOMRPBmgmuHTLYEx1f-bm82n5tjc';
const DEFAULT_RIDE_ID = '17626a2b-56f9-4b12-bc7e-02dff370712b';

type ChatMessage = {
  id?: string;
  message_id?: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type?: string;
  created_at: string;
  is_read?: boolean;
};

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || 'https://staging.getmedigo.com';
const SOCKET_PATH =
  process.env.NEXT_PUBLIC_SOCKET_PATH || '/api/v1/ws/socket.io';

export function DriverChatTestPage() {
  const searchParams = useSearchParams();
  const conversationId =
    searchParams.get('conversation_id') ||
    searchParams.get('ride_id') ||
    DEFAULT_RIDE_ID;

  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUserId, setTypingUserId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [eventLog, setEventLog] = useState<string[]>([]);

  const appendLog = (line: string) => {
    setEventLog((prev) => [...prev.slice(-19), line]);
  };

  useEffect(() => {
    const socket = io(`${SOCKET_URL}/chat`, {
      path: SOCKET_PATH,
      auth: { token: DRIVER_TOKEN },
      autoConnect: false,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 10,
      timeout: 10000,
    });

    socketRef.current = socket;

    const handleConnect = () => {
      setConnected(true);
      appendLog(`connected ${socket.id}`);
      socket.emit('join_conversation', { conversation_id: conversationId });
      appendLog(`join_conversation ${conversationId}`);
    };

    const handleDisconnect = (reason: string) => {
      setConnected(false);
      appendLog(`disconnect ${reason}`);
    };

    const handleNewMessage = (data: ChatMessage) => {
      if (data.conversation_id !== conversationId) return;
      setMessages((prev) => [...prev, data]);
      appendLog(`new_message from ${data.sender_id}`);
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
      appendLog(`messages_read by ${data.reader_id}`);
    };

    const handleTyping = (data: {
      conversation_id: string;
      user_id: string;
      is_typing: boolean;
    }) => {
      if (data.conversation_id !== conversationId) return;
      if (data.user_id === DRIVER_ID) return;
      setTypingUserId(data.is_typing ? data.user_id : null);
      appendLog(`typing ${data.user_id}=${data.is_typing}`);
    };

    const handleConnectError = (error: Error) => {
      appendLog(`connect_error ${error.message}`);
    };

    const handleAnyEvent = (eventName: string, ...args: unknown[]) => {
      if (
        eventName === 'typing' ||
        eventName === 'new_message' ||
        eventName === 'messages_read'
      ) {
        appendLog(`event ${eventName}`);
        console.log(`[DriverChatTest] event: ${eventName}`, ...args);
      }
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('new_message', handleNewMessage);
    socket.on('messages_read', handleMessagesRead);
    socket.on('typing', handleTyping);
    socket.on('connect_error', handleConnectError);
    socket.onAny(handleAnyEvent);

    socket.connect();

    return () => {
      socket.emit('leave_conversation', { conversation_id: conversationId });
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('new_message', handleNewMessage);
      socket.off('messages_read', handleMessagesRead);
      socket.off('typing', handleTyping);
      socket.off('connect_error', handleConnectError);
      socket.offAny(handleAnyEvent);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [conversationId]);

  const sendMessage = () => {
    const trimmed = messageInput.trim();
    if (!trimmed) return;

    socketRef.current?.emit(
      'send_message',
      {
        conversation_id: conversationId,
        content: trimmed,
        message_type: 'text',
      },
      (response?: unknown) => {
        appendLog(`send_message ack ${JSON.stringify(response ?? null)}`);
        console.log('[DriverChatTest] send_message ack:', response);
      }
    );

    setMessages((prev) => [
      ...prev,
      {
        id: `optimistic-${Date.now()}`,
        conversation_id: conversationId,
        sender_id: DRIVER_ID,
        content: trimmed,
        message_type: 'text',
        created_at: new Date().toISOString(),
      },
    ]);
    appendLog(`send_message "${trimmed}"`);
    setMessageInput('');
    socketRef.current?.emit('typing', {
      conversation_id: conversationId,
      is_typing: false,
    });
  };

  const headerText = useMemo(
    () => `Driver chat test • conversation ${conversationId}`,
    [conversationId]
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#F8FAFC',
        p: pxToRem(24),
      }}
    >
      <Stack spacing={2}>
        <Typography sx={{ fontSize: pxToRem(24), fontWeight: 800 }}>
          Driver Chat Test
        </Typography>
        <Typography sx={{ color: '#475569' }}>{headerText}</Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            label={connected ? 'Connected' : 'Disconnected'}
            color={connected ? 'success' : 'default'}
          />
          <Chip label={`driver ${DRIVER_ID.slice(0, 8)}...`} />
        </Stack>

        <Paper sx={{ p: 2, borderRadius: 3 }}>
          <Typography sx={{ fontWeight: 700, mb: 1 }}>Messages</Typography>
          <Stack spacing={1.5} sx={{ minHeight: pxToRem(320) }}>
            {messages.map((message) => {
              const isDriver = message.sender_id === DRIVER_ID;
              return (
                <Box
                  key={
                    message.message_id ??
                    message.id ??
                    `${message.sender_id}-${message.created_at}`
                  }
                  sx={{
                    display: 'flex',
                    justifyContent: isDriver ? 'flex-end' : 'flex-start',
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '70%',
                      px: 1.5,
                      py: 1,
                      borderRadius: 2,
                      bgcolor: isDriver ? '#2563EB' : '#FFFFFF',
                      color: isDriver ? '#FFFFFF' : '#0F172A',
                      border: isDriver ? 'none' : '1px solid #E2E8F0',
                    }}
                  >
                    <Typography sx={{ fontSize: pxToRem(14) }}>
                      {message.content}
                    </Typography>
                    <Typography
                      sx={{
                        mt: 0.5,
                        fontSize: pxToRem(10),
                        opacity: 0.75,
                      }}
                    >
                      {message.sender_id === DRIVER_ID ? 'Driver' : 'Rider'} •{' '}
                      {new Date(message.created_at).toLocaleTimeString(
                        'en-US',
                        {
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </Typography>
                  </Box>
                </Box>
              );
            })}

            {typingUserId && (
              <Typography sx={{ fontSize: pxToRem(12), color: '#64748B' }}>
                Rider is typing...
              </Typography>
            )}
          </Stack>
        </Paper>

        <Paper sx={{ p: 2, borderRadius: 3 }}>
          <Stack direction="row" spacing={1}>
            <TextField
              fullWidth
              value={messageInput}
              onChange={(event) => {
                const value = event.target.value;
                setMessageInput(value);
                socketRef.current?.emit('typing', {
                  conversation_id: conversationId,
                  is_typing: Boolean(value.trim()),
                });
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') sendMessage();
              }}
              placeholder="Type as driver..."
            />
            <Button variant="contained" onClick={sendMessage}>
              Send
            </Button>
            <Button
              variant="outlined"
              onClick={() =>
                socketRef.current?.emit('mark_read', {
                  conversation_id: conversationId,
                })
              }
            >
              Mark Read
            </Button>
          </Stack>
        </Paper>

        <Paper sx={{ p: 2, borderRadius: 3 }}>
          <Typography sx={{ fontWeight: 700, mb: 1 }}>Event Log</Typography>
          <Stack spacing={0.5}>
            {eventLog.map((line, index) => (
              <Typography
                key={`${line}-${index}`}
                sx={{ fontFamily: 'monospace', fontSize: pxToRem(12) }}
              >
                {line}
              </Typography>
            ))}
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}
