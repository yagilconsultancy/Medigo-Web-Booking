'use client';

import { Box, Stack, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { pxToRem } from '@/common';
import { AppButton, AppModal, RowStack } from '@/ui/modules/components';

export type RideCompletedModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onBackToHome: () => void;
};

export function RideCompletedModal({
  open,
  setOpen,
  onBackToHome,
}: RideCompletedModalProps) {
  return (
    <AppModal
      open={open}
      setOpen={setOpen}
      label="ride-completed-modal"
      // padding={`${pxToRem(18)} ${pxToRem(32)} ${pxToRem(32)}`}
    >
      <Box
        sx={{
          width: '540px',
        }}
      >
        <Stack spacing={pxToRem(24)} alignItems="center">
          {/* Success Icon */}
          <Box
            sx={{
              width: '100px',
              height: '100px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircleIcon sx={{ fontSize: '50px', color: '#A5D6A7' }} />
          </Box>

          {/* Title */}
          <Typography
            sx={{
              fontSize: pxToRem(27.33),
              fontWeight: 600,
              lineHeight: pxToRem(34.16),
              letterSpacing: '0.02em',
              color: '#031B1C',
              textAlign: 'center',
            }}
          >
            Ride Completed
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              fontSize: pxToRem(18.22),
              fontWeight: 500,
              lineHeight: pxToRem(25.05),
              letterSpacing: '0.01em',
              color: '#374640',
              textAlign: 'center',
              maxWidth: pxToRem(214),
            }}
          >
            Please let us know how the ride was
          </Typography>

          {/* Complete Survey Button */}
          {/* <AppButton
            variant="contained"
            fullWidth
            onClick={onCompleteSurvey}
            sx={{
              height: pxToRem(52),
              borderRadius: pxToRem(30),
              bgcolor: '#3273F5',
              fontSize: pxToRem(16),
              fontWeight: 700,
              lineHeight: pxToRem(20),
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#2563EB',
              },
            }}
          >
            Complete Survey
          </AppButton> */}

          {/* Back to Home Button */}
          <AppButton
            variant="text"
            onClick={onBackToHome}
            sx={{
              fontSize: pxToRem(16),
              lineHeight: pxToRem(24),
              color: '#111827',
              textTransform: 'none',
              opacity: 0.7,
              '&:hover': {
                opacity: 1,
                bgcolor: 'transparent',
              },
            }}
          >
            <RowStack spacing={pxToRem(13)}>
              <ArrowBackIcon sx={{ fontSize: pxToRem(16) }} />
              <span>Back to Home</span>
            </RowStack>
          </AppButton>
        </Stack>
      </Box>
    </AppModal>
  );
}
