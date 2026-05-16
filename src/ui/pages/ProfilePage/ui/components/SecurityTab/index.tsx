'use client';

import { Box, Divider, Paper, Typography } from '@mui/material';
import { FormikProvider, useFormik } from 'formik';
import { pxToRem } from '@/common';
import { AppButton, FormikAppPasswordField } from '@/ui/modules/components';
import blueLockIcon from '../../assets/icons/blue-lock.svg';
import purplePrintsIcon from '../../assets/icons/purple-prints.svg';
import { SectionTitle } from '../SectionTitle';

type SecurityFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

function getInitialValues(): SecurityFormValues {
  return {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
}

export function SecurityTab({ phone }: { phone?: string }) {
  const formik = useFormik<SecurityFormValues>({
    initialValues: getInitialValues(),
    onSubmit: () => {
      // no-op: wire to API later
    },
  });

  return (
    <FormikProvider value={formik}>
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{ display: 'grid', gap: pxToRem(16) }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: pxToRem(12),
            border: '1px solid #E2E8F0',
            bgcolor: '#FFFFFF',
            p: pxToRem(16),
          }}
        >
          <SectionTitle
            label="Password & Access"
            iconSrc={blueLockIcon as any}
            bgSection="#EFF6FF"
          />

          <Box sx={{ mt: pxToRem(14), display: 'grid', gap: pxToRem(12) }}>
            <FormikAppPasswordField
              name="currentPassword"
              placeholder="Current Password"
              size="small"
            />
            <FormikAppPasswordField
              name="newPassword"
              placeholder="New Password"
              size="small"
            />
            <FormikAppPasswordField
              name="confirmPassword"
              placeholder="Confirm New Password"
              size="small"
            />
            <AppButton
              type="submit"
              sx={{
                mt: pxToRem(4),
                '&:hover': { bgcolor: '#2563EB' },
              }}
            >
              Update Password
            </AppButton>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            borderRadius: pxToRem(12),
            border: '1px solid #E2E8F0',
            bgcolor: '#FFFFFF',
            p: pxToRem(16),
          }}
        >
          <SectionTitle
            label="Two-Factor Authentication"
            iconSrc={purplePrintsIcon as any}
            bgSection="#FAF5FF"
          />

          <Box sx={{ mt: pxToRem(12), display: 'grid', gap: pxToRem(12) }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: pxToRem(12),
              }}
            >
              <Box>
                <Typography sx={{ fontSize: pxToRem(15), fontWeight: 900 }}>
                  Authenticator App
                </Typography>
                <Typography sx={{ fontSize: pxToRem(12), color: '#94A3B8' }}>
                  Use Google Authenticator or Authy
                </Typography>
              </Box>
              <Typography
                sx={{ fontSize: pxToRem(10), fontWeight: 800, color: '#16A34A' }}
              >
                Active
              </Typography>
            </Box>

            <Divider />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: pxToRem(12),
              }}
            >
              <Box>
                <Typography sx={{ fontSize: pxToRem(15), fontWeight: 900 }}>
                  SMS Verification
                </Typography>
                <Typography sx={{ fontSize: pxToRem(12), color: '#94A3B8' }}>
                  Text code to {phone || 'your phone'}
                </Typography>
              </Box>
              <Typography
                sx={{ fontSize: pxToRem(11), fontWeight: 800, color: '#2563EB' }}
              >
                Configure
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </FormikProvider>
  );
}
