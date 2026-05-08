'use client';

import { Box, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import * as yup from 'yup';
import { toast } from 'sonner';
import { AppLayout } from '../../modules/partials';
import { HeaderBackButton } from '../../modules/partials/AppHeader/ui/components';
import { AppButton, AppOtpInput, StyledLink } from '../../modules/components';
import {
  pxToRem,
  REGISTER_ACCOUNT_KEY,
  REGISTER_USER_ID_KEY,
  useAuthFlowsApi,
} from '../../../common';

type OtpValues = {
  code: string;
};

const validationSchema = yup.object({
  code: yup
    .string()
    .required('OTP is required')
    .length(6, 'OTP must be 6 digits'),
});

export function OtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyOtp, resendOtp, isVerifyingOtp, isResendingOtp } =
    useAuthFlowsApi();

  const purpose = useMemo(() => {
    return searchParams.get('purpose') ?? 'registration';
  }, [searchParams]);

  const accountType = useMemo(() => {
    return searchParams.get('account') ?? undefined;
  }, [searchParams]);

  const userId = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem(REGISTER_USER_ID_KEY);
  }, []);

  // useEffect(() => {
  //   if (!userId) {
  //     router.replace('/sign-up');
  //   }
  // }, [router, userId]);

  const initialValues: OtpValues = { code: '' };

  const handleSubmit = async (values: OtpValues, { setFieldError }: any) => {
    const resolvedUserId =
      userId ?? sessionStorage.getItem(REGISTER_USER_ID_KEY);

    if (!resolvedUserId) {
      router.replace('/sign-up');
      return;
    }

    const result = await verifyOtp({
      user_id: resolvedUserId,
      code: values.code,
      purpose,
    });

    if (!result) {
      setFieldError('code', 'Invalid code. Please try again.');
      return;
    }

    sessionStorage.removeItem(REGISTER_USER_ID_KEY);

    const storedAccount =
      accountType ?? sessionStorage.getItem(REGISTER_ACCOUNT_KEY) ?? undefined;

    router.push(storedAccount ? `/login?account=${storedAccount}` : '/auth');
  };

  const handleResend = async () => {
    const resolvedUserId =
      userId ?? sessionStorage.getItem(REGISTER_USER_ID_KEY);

    if (!resolvedUserId) {
      router.replace('/sign-up');
      return;
    }

    const ok = await resendOtp({ user_id: resolvedUserId, purpose });
    if (ok) toast.success('OTP resent');
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
              Verify your account
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
              Enter the 6-digit code sent to your email.
            </Typography>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              validateOnMount
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, isValid, setFieldValue }) => (
                <Form>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: pxToRem(18),
                    }}
                  >
                    <AppOtpInput
                      otp={values.code}
                      length={6}
                      hasError={Boolean(touched.code && errors.code)}
                      errorMessage={errors.code}
                      onchange={(value) => setFieldValue('code', value)}
                      oncomplete={(value) => setFieldValue('code', value)}
                    />

                    <AppButton
                      type="submit"
                      fullWidth
                      variant="contained"
                      isLoading={isVerifyingOtp}
                      disabled={!isValid || isVerifyingOtp}
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
                      Verify
                    </AppButton>

                    <Box
                      sx={{
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
                        Didn&apos;t get a code?
                      </Typography>
                      <AppButton
                        type="button"
                        onClick={handleResend}
                        sx={{
                          fontSize: pxToRem(13),
                          lineHeight: pxToRem(19.5),
                          fontWeight: 600,
                          color: '#007AFF',
                          opacity: isResendingOtp ? 0.6 : 1,
                          background: 'none',
                          padding: 0,
                          '&:hover': {
                            background: 'none',
                            textDecoration: 'underline',
                          },
                        }}
                        disabled={isResendingOtp}
                      >
                        Resend
                      </AppButton>
                    </Box>
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
