import { useMemo, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import MicNoneIcon from '@mui/icons-material/MicNone';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import VerifiedIcon from '@mui/icons-material/Verified';
import { pxToRem } from '@/common';

export type ChatMessage = {
  id: string;
  from: 'driver' | 'rider';
  text: string;
  timeLabel: string;
};

export type DriverChatDrawerProps = {
  open: boolean;
  onClose: () => void;
  driverName: string;
  driverOnlineLabel?: string;
  initialMessages?: ChatMessage[];
};

export function DriverChatDrawer({
  open,
  onClose,
  driverName,
  driverOnlineLabel = 'Your driver · Online',
  initialMessages,
}: DriverChatDrawerProps) {
  const [message, setMessage] = useState('');
  const endRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(
    initialMessages ?? [
      {
        id: 'm1',
        from: 'driver',
        text: "Hello! I'm on my way to your pickup location.",
        timeLabel: '05:48 AM',
      },
      {
        id: 'm2',
        from: 'driver',
        text: "I'll be there in about 8 minutes. Please be ready.",
        timeLabel: '05:49 AM',
      },
    ]
  );

  const driverInitials = useMemo(() => {
    const parts = driverName.trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? 'D';
    const second = parts[1]?.[0] ?? '';
    return `${first}${second}`.toUpperCase();
  }, [driverName]);

  const scrollToEnd = () => {
    requestAnimationFrame(() => endRef.current?.scrollIntoView());
  };

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `rider-${Date.now()}`,
        from: 'rider',
        text: trimmed,
        timeLabel: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ]);
    setMessage('');
    scrollToEnd();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: pxToRem(420) },
          maxWidth: '100vw',
          bgcolor: '#F8FAFC',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ bgcolor: '#FFFFFF' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: pxToRem(12),
            p: `${pxToRem(14)} ${pxToRem(16)}`,
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              width: pxToRem(36),
              height: pxToRem(36),
              bgcolor: '#F1F5F9',
              '&:hover': { bgcolor: '#E2E8F0' },
            }}
          >
            <ArrowBackIosNewIcon sx={{ fontSize: pxToRem(16) }} />
          </IconButton>

          <Avatar
            sx={{
              width: pxToRem(40),
              height: pxToRem(40),
              bgcolor: '#2563EB',
              fontWeight: 800,
            }}
          >
            {driverInitials}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: pxToRem(14),
                fontWeight: 800,
                color: '#0F172A',
                lineHeight: pxToRem(20),
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {driverName}
            </Typography>
            <Stack direction="row" spacing={pxToRem(6)} alignItems="center">
              <VerifiedIcon sx={{ fontSize: pxToRem(14), color: '#2563EB' }} />
              <Typography
                sx={{
                  fontSize: pxToRem(12),
                  fontWeight: 600,
                  color: '#16A34A',
                }}
              >
                {driverOnlineLabel}
              </Typography>
            </Stack>
          </Box>
        </Box>
        <Divider />
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: pxToRem(16),
          pb: pxToRem(120),
        }}
      >
        <Typography
          sx={{
            textAlign: 'center',
            fontSize: pxToRem(12),
            color: '#94A3B8',
            mb: pxToRem(16),
          }}
        >
          Today
        </Typography>

        <Stack spacing={pxToRem(12)}>
          {messages.map((m) => {
            const isDriver = m.from === 'driver';
            return (
              <Box
                key={m.id}
                sx={{
                  display: 'flex',
                  gap: pxToRem(10),
                  flexDirection: isDriver ? 'row' : 'row-reverse',
                }}
              >
                {isDriver ? (
                  <Avatar
                    sx={{
                      width: pxToRem(34),
                      height: pxToRem(34),
                      bgcolor: '#2563EB',
                      fontWeight: 800,
                    }}
                  >
                    {driverInitials}
                  </Avatar>
                ) : (
                  <Avatar
                    sx={{
                      width: pxToRem(34),
                      height: pxToRem(34),
                      bgcolor: '#0F172A',
                      fontWeight: 800,
                    }}
                  >
                    You
                  </Avatar>
                )}

                <Box sx={{ maxWidth: '78%' }}>
                  <Box
                    sx={{
                      bgcolor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: pxToRem(14),
                      px: pxToRem(14),
                      py: pxToRem(10),
                      boxShadow: '0px 8px 24px rgba(2,6,23,0.06)',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: pxToRem(14),
                        color: '#0F172A',
                        lineHeight: pxToRem(20),
                      }}
                    >
                      {m.text}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      mt: pxToRem(4),
                      fontSize: pxToRem(11),
                      color: '#94A3B8',
                      textAlign: isDriver ? 'left' : 'right',
                    }}
                  >
                    {m.timeLabel}
                  </Typography>
                </Box>
              </Box>
            );
          })}
          <div ref={endRef} />
        </Stack>
      </Box>

      {/* Composer */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: '#F8FAFC',
          p: pxToRem(16),
          borderTop: '1px solid #E2E8F0',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: pxToRem(10),
          }}
        >
          <IconButton
            sx={{
              width: pxToRem(44),
              height: pxToRem(44),
              bgcolor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              '&:hover': { bgcolor: '#F1F5F9' },
            }}
          >
            <MicNoneIcon sx={{ fontSize: pxToRem(20), color: '#64748B' }} />
          </IconButton>

          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            fullWidth
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: '#FFFFFF',
                borderRadius: pxToRem(14),
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#E2E8F0',
              },
            }}
          />

          <IconButton
            onClick={handleSend}
            sx={{
              width: pxToRem(44),
              height: pxToRem(44),
              bgcolor: '#A5BDF7',
              '&:hover': { bgcolor: '#7FA2F4' },
            }}
          >
            <SendRoundedIcon sx={{ fontSize: pxToRem(20), color: '#FFFFFF' }} />
          </IconButton>
        </Box>
      </Box>
    </Drawer>
  );
}
