'use client';

import { useState } from 'react';
import {
  Avatar,
  Box,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import MessageRoundedIcon from '@mui/icons-material/MessageRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import VerifiedIcon from '@mui/icons-material/Verified';
import { pxToRem } from '@/common';
import { useRidesApi } from '@/common/hooks/api/collection/useRidesApi';
import { useGetDriverContact } from '@/common/hooks/api/query/rides';
import { AppButton } from '@/ui/modules/components';

export type DriverTrackingCardProps = {
  rideId: string;
  statusLabel: string;
  onMessageDriver: () => void;
};

export function DriverTrackingCard({
  rideId,
  statusLabel,
  onMessageDriver,
}: DriverTrackingCardProps) {
  const { cancelRide } = useRidesApi();
  const {
    data: driverContact,
    isLoading,
    isError,
  } = useGetDriverContact(rideId, { enabled: Boolean(rideId) });
  const [cancelling, setCancelling] = useState(false);
  const driverContactData = driverContact?.success ? driverContact.data : null;
  const driverName = driverContactData
    ? `${driverContactData.first_name} ${driverContactData.last_name}`.trim()
    : 'Driver';
  const driverSubtitle = driverContactData
    ? [
        driverContactData.vehicle_type,
        driverContactData.vehicle_color,
        driverContactData.vehicle_plate,
      ]
        .filter(Boolean)
        .join(' · ')
    : '';
  const initials = driverContactData
    ? `${driverContactData.first_name?.[0] ?? ''}${driverContactData.last_name?.[0] ?? ''}`.trim() ||
      'D'
    : 'D';

  const handleCancelRide = async () => {
    if (!rideId || cancelling) return;

    setCancelling(true);
    await cancelRide(rideId, { ride_id: rideId });
    setCancelling(false);
  };

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
            gap: pxToRem(12),
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
              {isLoading ? '...' : initials}
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
                {isError ? 'Driver unavailable' : driverName}
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
                  {driverSubtitle || 'Vehicle details pending'}
                </Typography>
              </Stack>
            </Box>
          </Box>

          <Stack direction="row" spacing={pxToRem(8)} alignItems="center">
            <AppButton
              variant="outlined"
              onClick={handleCancelRide}
              disabled={cancelling}
              sx={{
                height: pxToRem(40),
                borderRadius: pxToRem(999),
                borderColor: '#FCA5A5',
                color: '#B91C1C',
                textTransform: 'none',
                fontSize: pxToRem(12),
                fontWeight: 700,
                px: pxToRem(14),
                whiteSpace: 'nowrap',
                '&:hover': {
                  borderColor: '#EF4444',
                  bgcolor: '#FEF2F2',
                },
              }}
            >
              {cancelling ? 'Cancelling...' : 'Cancel Ride'}
            </AppButton>

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
          </Stack>
        </Box>

        {/* Vehicle section */}
        <Box
          sx={{
            mx: pxToRem(18),
            mb: pxToRem(18),
            borderRadius: pxToRem(16),
            bgcolor: '#F0F7FF',
            border: '1px solid #DBEAFE',
            p: pxToRem(16),
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: pxToRem(12),
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: pxToRem(11), color: '#64748B' }}>
              Vehicle type
            </Typography>
            <Typography
              sx={{
                fontSize: pxToRem(14),
                fontWeight: 800,
                color: '#0F172A',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {driverContactData?.vehicle_type ?? 'Vehicle pending'}
            </Typography>
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: pxToRem(11), color: '#64748B' }}>
              Color
            </Typography>
            <Typography
              sx={{
                fontSize: pxToRem(14),
                fontWeight: 800,
                color: '#0F172A',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {driverContactData?.vehicle_color ?? '—'}
            </Typography>
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: pxToRem(11), color: '#64748B' }}>
              Make / model
            </Typography>
            <Typography
              sx={{
                fontSize: pxToRem(14),
                fontWeight: 800,
                color: '#0F172A',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {[
                driverContactData?.vehicle_make,
                driverContactData?.vehicle_model,
              ]
                .filter(Boolean)
                .join(' ') || '—'}
            </Typography>
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: pxToRem(11), color: '#64748B' }}>
              Plate
            </Typography>
            <Typography
              sx={{
                fontSize: pxToRem(14),
                fontWeight: 800,
                color: '#0F172A',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {driverContactData?.vehicle_plate ?? '—'}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
