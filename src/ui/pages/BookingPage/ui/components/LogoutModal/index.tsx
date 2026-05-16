'use client';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { getRefreshToken, pxToRem } from '@/common';
import { useAuthFlowsApi } from '@/common/hooks/api/collection';
import { AppButton, AppModal } from '@/ui/modules/components';

export type LogoutModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm?: () => void;
};

export function LogoutModal({ open, setOpen, onConfirm }: LogoutModalProps) {
  const router = useRouter();
  const { logout } = useAuthFlowsApi();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      // No refresh token, just redirect to login
      setOpen(false);
      onConfirm?.();
      router.push('/login');
      return;
    }

    const success = await logout({ refresh_token: refreshToken });
    if (success) {
      setOpen(false);
      onConfirm?.();
      router.push('/login');
    }
    setIsLoggingOut(false);
  };

  return (
    <AppModal
      open={open}
      setOpen={setOpen}
      label="logout-confirmation"
      padding="0"
      sx={{
        '& .MuiDialog-paper': {
          width: 420,
          boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      <Box>
        {/* Close Button */}
        <Box
          sx={{ display: 'flex', justifyContent: 'flex-end', p: pxToRem(16) }}
        >
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              width: 32,
              height: 32,
              bgcolor: '#F3F4F6',
              '&:hover': { bgcolor: '#E5E7EB' },
            }}
          >
            <CloseRoundedIcon sx={{ fontSize: 15, color: '#64748B' }} />
          </IconButton>
        </Box>

        {/* Content */}
        <Stack
          alignItems="center"
          spacing={2}
          sx={{ px: pxToRem(32), pb: pxToRem(8) }}
        >
          {/* Warning Icon */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: '#FEF2F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LogoutRoundedIcon sx={{ fontSize: 36, color: '#EF4444' }} />
          </Box>

          <Typography
            sx={{
              fontSize: pxToRem(22),
              fontWeight: 700,
              color: '#101828',
              textAlign: 'center',
            }}
          >
            Log Out?
          </Typography>

          <Typography
            sx={{
              fontSize: pxToRem(14),
              fontWeight: 400,
              color: '#4A5565',
              textAlign: 'center',
              lineHeight: pxToRem(22.75),
              maxWidth: 320,
            }}
          >
            You&apos;re about to log out of your MediGO account. Any unsaved
            changes will be lost. You can always log back in anytime.
          </Typography>
        </Stack>

        {/* Action Buttons */}
        <Stack spacing={pxToRem(12)} sx={{ px: pxToRem(32), py: pxToRem(24) }}>
          <AppButton
            fullWidth
            disabled={isLoggingOut}
            onClick={handleLogout}
            sx={{
              bgcolor: '#FB2C36',
              color: '#FFFFFF',
              height: 51,
              borderRadius: pxToRem(14),
              fontSize: pxToRem(15),
              fontWeight: 700,
              boxShadow: '0px 4px 12px 0px rgba(255, 201, 201, 0.5)',
              '&:hover': {
                bgcolor: '#E11D48 !important',
                background: '#E11D48 !important',
              },
              '&:disabled': {
                opacity: 0.6,
              },
            }}
          >
            {isLoggingOut ? 'Logging Out...' : 'Yes, Log Out'}
          </AppButton>

          <AppButton
            fullWidth
            variant="outlined"
            disabled={isLoggingOut}
            onClick={() => setOpen(false)}
            sx={{
              height: 52,
              borderRadius: pxToRem(14),
              border: '0.67px solid #E5E7EB',
              color: '#4A5565',
              fontSize: pxToRem(15),
              fontWeight: 600,
              background: '#FFFFFF',
              '&:hover': {
                background: '#F9FAFB !important',
              },
              '&:disabled': {
                opacity: 0.6,
              },
            }}
          >
            Stay Logged In
          </AppButton>
        </Stack>
      </Box>
    </AppModal>
  );
}
