'use client';

import { Box, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import * as yup from 'yup';
import { toast } from 'sonner';
import {
  AppButton,
  FormikAppPasswordField,
  FormikAppTextField,
} from '../../modules/components';
import { AppLayout } from '../../modules/partials';
import { HeaderBackButton } from '../../modules/partials/AppHeader/ui/components';
import { pxToRem, useAuthFlowsApi } from '../../../common';

type ResetPasswordFormValues = {
  token: string;
  newPassword: string;
  confirmPassword: string;
};

const validationSchema = yup.object({
  token: yup
    .string()
    .required('Reset token is required. Please check your email for the token.'),
  newPassword: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your new password'),
});

export function ResetPasswordPage() {
  const router = useRouter();
  const { resetPassword, isResettingPassword } = useAuthFlowsApi();

  const initialValues: ResetPasswordFormValues = {
    token: '',
    newPassword: '',
    confirmPassword: '',
  };

  const handleSubmit = async (values: ResetPasswordFormValues) => {
    const success = await resetPassword({
      token: values.token,
      new_password: values.newPassword,
    });

    if (success) {
      toast.success('Password reset successfully. Please sign in with your new password.');
      router.push('/login');
    }
  };

  return (
    <AppLayout
      headerProps={{
        showRightContent: true,
        rightContent: <HeaderBackButton />,
      }}
    >
      <Box
        sx={{
          width: '100%',
          minHeight: `calc(100vh - ${pxToRem(64)})`,
          bgcolor: '#F8FAFC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 6, md: 10 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: pxToRem(420) }}>
          <Box
            sx={{
              bgcolor: '#FFFFFF',
              borderRadius: pxToRem(16),
              border: '0.667px solid #E8EDF2',
              boxShadow:
                '0px 2px 4px rgba(0,0,0,0.04), 0px 12px 20px rgba(0,0,0,0.07)',
              px: pxToRem(32),
              pt: pxToRem(52),
              pb: pxToRem(28),
            }}
          >
            <Typography
              sx={{
                fontSize: pxToRem(24),
                lineHeight: pxToRem(30),
                fontWeight: 700,
                color: '#0F172A',
                letterSpacing: '-0.02em',
                mb: pxToRem(6),
              }}
            >
              Reset your password
            </Typography>
            <Typography
              sx={{
                fontSize: pxToRem(14),
                lineHeight: pxToRem(22.4),
                fontWeight: 400,
                color: '#64748B',
                mb: pxToRem(22),
              }}
            >
              Enter the reset token from your email and create a new password
              for your account.
            </Typography>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              validateOnMount
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, isValid }) => (
                <Form>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: pxToRem(20),
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: pxToRem(8),
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: pxToRem(13),
                          lineHeight: pxToRem(19.5),
                          fontWeight: 500,
                          color: '#0F172A',
                        }}
                      >
                        Reset Token
                      </Typography>
                      <FormikAppTextField
                        name="token"
                        placeholder="Enter the token from your email"
                        fullWidth
                      />
                      <Typography
                        sx={{
                          fontSize: pxToRem(11),
                          lineHeight: pxToRem(16.5),
                          fontWeight: 400,
                          color: '#64748B',
                          mt: pxToRem(-4),
                        }}
                      >
                        Check your email for the reset token we sent you
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: pxToRem(8),
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: pxToRem(13),
                          lineHeight: pxToRem(19.5),
                          fontWeight: 500,
                          color: '#0F172A',
                        }}
                      >
                        New Password
                      </Typography>
                      <FormikAppPasswordField
                        name="newPassword"
                        placeholder="Enter your new password"
                        fullWidth
                      />
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: pxToRem(8),
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: pxToRem(13),
                          lineHeight: pxToRem(19.5),
                          fontWeight: 500,
                          color: '#0F172A',
                        }}
                      >
                        Confirm New Password
                      </Typography>
                      <FormikAppPasswordField
                        name="confirmPassword"
                        placeholder="Re-enter your new password"
                        fullWidth
                      />
                    </Box>
                  </Box>

                  <AppButton
                    type="submit"
                    variant="contained"
                    fullWidth
                    isLoading={isSubmitting || isResettingPassword}
                    disabled={!isValid || isSubmitting || isResettingPassword}
                    sx={{
                      height: pxToRem(48),
                      mt: pxToRem(28),
                      borderRadius: pxToRem(14),
                      fontSize: pxToRem(14),
                      lineHeight: pxToRem(21),
                      fontWeight: 600,
                      bgcolor: '#007AFF',
                      boxShadow:
                        '0px 1px 1.5px rgba(0,122,255,0.25), 0px 4px 8px rgba(0,122,255,0.18)',
                      '&:hover': {
                        bgcolor: '#007AFF',
                      },
                      '&:disabled': {
                        bgcolor: '#007AFF',
                        opacity: 0.5,
                        color: '#FFFFFF',
                      },
                    }}
                  >
                    Reset Password
                  </AppButton>
                </Form>
              )}
            </Formik>
          </Box>
        </Box>
      </Box>
    </AppLayout>
  );
}
