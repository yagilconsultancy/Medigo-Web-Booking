'use client';

import { Box, Stack, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { pxToRem } from '@/common';
import { AppButton, AppModal, RowStack } from '@/ui/modules/components';

export type CancelRideModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onKeepRide: () => void;
  onConfirmCancel: () => void;
};

export function CancelRideModal({
  open,
  setOpen,
  onKeepRide,
  onConfirmCancel,
}: CancelRideModalProps) {
  return (
    <AppModal
      open={open}
      setOpen={setOpen}
      label="cancel-ride-modal"
      padding={pxToRem(32)}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: pxToRem(420),
        }}
      >
        <Stack spacing={pxToRem(16)} alignItems="center">
          {/* Icon */}
          <Box
            sx={{
              width: pxToRem(56),
              height: pxToRem(56),
              borderRadius: '50%',
              bgcolor: '#FEF2F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ErrorOutlineIcon
              sx={{ fontSize: pxToRem(28), color: '#EF4444' }}
            />
          </Box>

          {/* Title */}
          <Typography
            sx={{
              fontSize: pxToRem(17),
              fontWeight: 700,
              lineHeight: pxToRem(25.5),
              color: '#0F172A',
              textAlign: 'center',
            }}
          >
            Cancel this ride?
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              fontSize: pxToRem(13),
              lineHeight: pxToRem(20.8),
              color: '#64748B',
              textAlign: 'center',
              maxWidth: pxToRem(338),
            }}
          >
            Your driver is already here. Cancelling now may incur a cancellation
            fee.
          </Typography>

          {/* Buttons */}
          <RowStack
            spacing={pxToRem(12)}
            sx={{ width: '100%', pt: pxToRem(8) }}
          >
            <AppButton
              variant="outlined"
              onClick={onKeepRide}
              sx={{
                flex: 1,
                height: pxToRem(44),
                borderRadius: pxToRem(14),
                border: '0.67px solid #E2E8F0',
                fontSize: pxToRem(14),
                fontWeight: 600,
                lineHeight: pxToRem(21),
                color: '#475569',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#F8FAFC',
                  border: '0.67px solid #E2E8F0',
                },
              }}
            >
              Keep Ride
            </AppButton>
            <AppButton
              variant="contained"
              onClick={onConfirmCancel}
              sx={{
                flex: 1,
                height: pxToRem(44),
                borderRadius: pxToRem(14),
                bgcolor: '#EF4444',
                fontSize: pxToRem(14),
                fontWeight: 600,
                lineHeight: pxToRem(21),
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#DC2626',
                },
              }}
            >
              Yes, Cancel
            </AppButton>
          </RowStack>
        </Stack>
      </Box>
    </AppModal>
  );
}
