import {
  Avatar,
  Box,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import MessageRoundedIcon from '@mui/icons-material/MessageRounded';
import VerifiedIcon from '@mui/icons-material/Verified';
import { pxToRem } from '@/common';

export type DriverTrackingCardProps = {
  statusLabel: string;
  driverName: string;
  driverSubtitle: string;
  etaMinutes: number;
  destinationLabel: string;
  metaLabel: string;
  onMessageDriver: () => void;
};

export function DriverTrackingCard({
  statusLabel,
  driverName,
  driverSubtitle,
  etaMinutes,
  destinationLabel,
  metaLabel,
  onMessageDriver,
}: DriverTrackingCardProps) {
  const initials = driverName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();

  return (
    <Box sx={{ width: '100%' }}>
      <Typography
        sx={{
          fontSize: pxToRem(12),
          fontWeight: 700,
          color: '#0F172A',
          opacity: 0.7,
          mb: pxToRem(10),
        }}
      >
        <Box component="span" sx={{ color: '#2563EB', mr: pxToRem(6) }}>
          •
        </Box>
        {statusLabel}
      </Typography>

      <Paper
        elevation={0}
        sx={{
          borderRadius: pxToRem(18),
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          bgcolor: '#FFFFFF',
        }}
      >
        {/* Driver header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: pxToRem(18),
            pb: pxToRem(14),
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: pxToRem(12) }}>
            <Avatar
              sx={{
                width: pxToRem(48),
                height: pxToRem(48),
                bgcolor: '#0F172A',
                fontWeight: 800,
              }}
            >
              {initials || 'D'}
            </Avatar>
            <Box>
              <Typography
                sx={{
                  fontSize: pxToRem(15),
                  fontWeight: 800,
                  color: '#0F172A',
                  lineHeight: pxToRem(22),
                }}
              >
                {driverName}
              </Typography>
              <Stack direction="row" spacing={pxToRem(6)} alignItems="center">
                <VerifiedIcon
                  sx={{ fontSize: pxToRem(14), color: '#2563EB' }}
                />
                <Typography
                  sx={{
                    fontSize: pxToRem(12),
                    fontWeight: 600,
                    color: '#64748B',
                  }}
                >
                  {driverSubtitle}
                </Typography>
              </Stack>
            </Box>
          </Box>

          <IconButton
            onClick={onMessageDriver}
            sx={{
              width: pxToRem(44),
              height: pxToRem(44),
              bgcolor: '#2563EB',
              '&:hover': { bgcolor: '#1D4ED8' },
            }}
          >
            <MessageRoundedIcon sx={{ color: '#FFFFFF' }} />
          </IconButton>
        </Box>

        {/* Arriving section */}
        <Box
          sx={{
            mx: pxToRem(18),
            mb: pxToRem(18),
            borderRadius: pxToRem(16),
            bgcolor: '#F0F7FF',
            border: '1px solid #DBEAFE',
            p: pxToRem(16),
            display: 'flex',
            alignItems: 'center',
            gap: pxToRem(14),
          }}
        >
          <Box
            sx={{
              width: pxToRem(54),
              height: pxToRem(54),
              borderRadius: pxToRem(14),
              bgcolor: '#FFFFFF',
              border: '1px solid #DBEAFE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <Typography
              sx={{
                fontSize: pxToRem(18),
                fontWeight: 900,
                color: '#2563EB',
                lineHeight: pxToRem(20),
              }}
            >
              {etaMinutes}
            </Typography>
            <Typography
              sx={{
                fontSize: pxToRem(10),
                fontWeight: 700,
                color: '#64748B',
              }}
            >
              min
            </Typography>
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: pxToRem(12),
                fontWeight: 700,
                color: '#0F172A',
              }}
            >
              Arriving at
            </Typography>
            <Typography
              sx={{
                fontSize: pxToRem(14),
                fontWeight: 900,
                color: '#2563EB',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {destinationLabel}
            </Typography>
            <Typography
              sx={{
                mt: pxToRem(2),
                fontSize: pxToRem(11),
                color: '#64748B',
              }}
            >
              {metaLabel}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
