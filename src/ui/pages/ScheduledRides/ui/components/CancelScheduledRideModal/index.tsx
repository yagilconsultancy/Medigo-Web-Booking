'use client';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';
import { Box, ButtonBase, IconButton, Stack, Typography } from '@mui/material';
import { pxToRem } from '@/common';
import { AppModal } from '@/ui/modules/components';
import type { ScheduledRideItem } from '../ScheduledRideList';

export function CancelScheduledRideModal({
  open,
  setOpen,
  ride,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ride: ScheduledRideItem | null;
}) {
  const message =
    ride
      ? `Your ride on ${ride.dateLabel} at ${ride.timeLabel} will be cancelled. A confirmation will be sent to your email.`
      : '';

  return (
    <AppModal
      open={open}
      setOpen={setOpen}
      label="Cancel scheduled ride"
      padding="0px"
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: pxToRem(24),
          width: pxToRem(400),
          maxWidth: 'calc(100vw - 40px)',
          overflow: 'hidden',
        },
      }}
    >
      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: pxToRem(20), pt: pxToRem(20) }}>
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              width: pxToRem(32),
              height: pxToRem(32),
              bgcolor: '#F3F4F6',
              '&:hover': { bgcolor: '#F3F4F6' },
            }}
            aria-label="Close cancel ride"
          >
            <CloseRoundedIcon sx={{ fontSize: pxToRem(16), color: '#0F172A' }} />
          </IconButton>
        </Box>

        <Stack spacing={pxToRem(12)} alignItems="center" sx={{ px: pxToRem(32), pb: pxToRem(18) }}>
          <Box
            sx={{
              width: pxToRem(64),
              height: pxToRem(64),
              borderRadius: pxToRem(18),
              bgcolor: '#FEF2F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PriorityHighRoundedIcon sx={{ fontSize: pxToRem(28), color: '#FB2C36' }} />
          </Box>

          <Typography
            sx={{
              color: '#0F172A',
              fontSize: pxToRem(19),
              fontWeight: 700,
              letterSpacing: pxToRem(-0.475),
              textAlign: 'center',
              lineHeight: pxToRem(28.5),
            }}
          >
            Cancel this ride?
          </Typography>

          <Typography
            sx={{
              color: '#64748B',
              fontSize: pxToRem(13),
              textAlign: 'center',
              lineHeight: pxToRem(21.125),
            }}
          >
            {message}
          </Typography>
        </Stack>

        <Stack spacing={pxToRem(10)} sx={{ px: pxToRem(24), pb: pxToRem(24) }}>
          <ButtonBase onClick={() => setOpen(false)} sx={{ borderRadius: pxToRem(12) }}>
            <Box
              sx={{
                width: '100%',
                bgcolor: '#FB2C36',
                borderRadius: pxToRem(12),
                py: pxToRem(12),
                boxShadow: '0px 2px 5px rgba(239,68,68,0.3)',
              }}
            >
              <Typography sx={{ color: '#FFFFFF', fontSize: pxToRem(14), fontWeight: 700, textAlign: 'center' }}>
                Yes, Cancel Ride
              </Typography>
            </Box>
          </ButtonBase>

          <ButtonBase onClick={() => setOpen(false)} sx={{ borderRadius: pxToRem(12) }}>
            <Box
              sx={{
                width: '100%',
                border: '1px solid #E5E7EB',
                borderRadius: pxToRem(12),
                py: pxToRem(12),
              }}
            >
              <Typography sx={{ color: '#64748B', fontSize: pxToRem(14), fontWeight: 600, textAlign: 'center' }}>
                Keep Ride
              </Typography>
            </Box>
          </ButtonBase>
        </Stack>
      </Box>
    </AppModal>
  );
}

