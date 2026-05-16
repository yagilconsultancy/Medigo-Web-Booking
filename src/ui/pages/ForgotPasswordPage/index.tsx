'use client';

import { Box, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import * as yup from 'yup';
import { toast } from 'sonner';
import {
  AppButton,
  FormikAppTextField,
  StyledLink,
} from '../../modules/components';
import { AppLayout } from '../../modules/partials';
import { HeaderBackButton } from '../../modules/partials/AppHeader/ui/components';
import { pxToRem, useAuthFlowsApi } from '../../../common';

type ForgotPasswordFormValues = {
  email: string;
};

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email address')
    .required('Email is required'),
});

export function ForgotPasswordPage() {
  const router = useRouter();
  const { forgotPassword, isRequestingPasswordReset } = useAuthFlowsApi();

  const initialValues: ForgotPasswordFormValues = { email: '' };

  const handleSubmit = async (values: ForgotPasswordFormValues) => {
    const success = await forgotPassword({ email: values.email });
    if (success) {
      toast.success('Password reset instructions sent to your email');
      router.push('/reset-password');
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
              Forgot password?
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
              Enter your email address and we'll send you instructions to reset
              your password.
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
                      gap: pxToRem(8),
                      mb: pxToRem(28),
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
                      Email address
                    </Typography>
                    <FormikAppTextField
                      name="email"
                      placeholder="you@example.com"
                      fullWidth
                    />
                  </Box>

                  <AppButton
                    type="submit"
                    variant="contained"
                    fullWidth
                    isLoading={isSubmitting || isRequestingPasswordReset}
                    disabled={!isValid || isSubmitting || isRequestingPasswordReset}
                    sx={{
                      height: pxToRem(48),
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
                    Send Reset Instructions
                  </AppButton>

                  <Box
                    sx={{
                      mt: pxToRem(18),
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: pxToRem(6),
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: pxToRem(13),
                        lineHeight: pxToRem(19.5),
                        fontWeight: 400,
                        color: '#64748B',
                      }}
                    >
                      Remember your password?
                    </Typography>
                    <StyledLink
                      href="/login"
                      sx={{
                        fontSize: pxToRem(15),
                        lineHeight: pxToRem(24),
                        fontWeight: 600,
                        color: '#007AFF',
                      }}
                    >
                      Sign in
                    </StyledLink>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>
        </Box>
      </Box>
    </AppLayout>
  );
}
