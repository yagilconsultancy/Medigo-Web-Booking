'use client';

import { useMemo } from 'react';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { Box, Divider, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { useSearchParams } from 'next/navigation';
import * as yup from 'yup';
import {
  AppButton,
  FormikAppPasswordField,
  FormikAppTextField,
  StyledImage,
  StyledLink,
} from '../../modules/components';
import { AppLayout } from '../../modules/partials';
import { HeaderBackButton } from '../../modules/partials/AppHeader/ui/components';
import { pxToRem } from '../../../common';
import blueFacilityBookingIcon from '../LoginPage/ui/assets/icons/blue-facility-booking-icon.svg';
import blueIndividualBookingIcon from '../LoginPage/ui/assets/icons/blue-individual-booking-icon.svg';

type AccountType = 'individual' | 'facility';

type IndividualSignUpValues = {
  fullName: string;
  email: string;
  password: string;
};

type FacilitySignUpValues = {
  contactName: string;
  organizationName: string;
  email: string;
  password: string;
};

const individualSchema = yup.object({
  fullName: yup.string().required('Full name is required'),
  email: yup
    .string()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: yup.string().required('Password is required'),
});

const facilitySchema = yup.object({
  contactName: yup.string().required('Contact name is required'),
  organizationName: yup.string().required('Organization name is required'),
  email: yup
    .string()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: yup.string().required('Password is required'),
});

export function SignUpPage() {
  const searchParams = useSearchParams();

  const accountType = useMemo<AccountType>(() => {
    const value = searchParams.get('account');
    return value === 'facility' ? 'facility' : 'individual';
  }, [searchParams]);

  const accountMeta = useMemo(() => {
    if (accountType === 'facility') {
      return {
        label: 'Facility account',
        icon: blueFacilityBookingIcon,
      };
    }
    return {
      label: 'Individual account',
      icon: blueIndividualBookingIcon,
    };
  }, [accountType]);

  const initialValues = useMemo(() => {
    if (accountType === 'facility') {
      const values: FacilitySignUpValues = {
        contactName: '',
        organizationName: '',
        email: '',
        password: '',
      };
      return values;
    }

    const values: IndividualSignUpValues = {
      fullName: '',
      email: '',
      password: '',
    };
    return values;
  }, [accountType]);

  const validationSchema =
    accountType === 'facility' ? facilitySchema : individualSchema;

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
              position: 'relative',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: pxToRem(12),
                left: pxToRem(26),
                height: pxToRem(32),
                display: 'inline-flex',
                alignItems: 'center',
                gap: pxToRem(8),
                bgcolor: '#EFF6FF',
                border: '0.6px solid #DBEAFE',
                borderRadius: '999999px',
                pl: pxToRem(14),
                pr: pxToRem(12),
                py: pxToRem(6),
              }}
            >
              <StyledImage
                src={accountMeta.icon}
                alt=""
                width={14}
                height={14}
                sx={{ width: pxToRem(14), height: pxToRem(14) }}
              />
              <Typography
                sx={{
                  fontSize: pxToRem(11),
                  lineHeight: pxToRem(16),
                  fontWeight: 600,
                  color: '#2563EB',
                  letterSpacing: '0.01em',
                }}
              >
                {accountMeta.label}
              </Typography>
            </Box>

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
              Create your account
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
              Join MediGo to manage bookings and track rides.
            </Typography>

            <Formik
              initialValues={initialValues as any}
              validationSchema={validationSchema}
              validateOnMount
              enableReinitialize
              onSubmit={async () => undefined}
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
                    {accountType === 'facility' ? (
                      <>
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
                            Contact Name
                          </Typography>
                          <FormikAppTextField
                            name="contactName"
                            placeholder="e.g Sarah Johnson"
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
                            Organization Name{' '}
                            <Box component="span" sx={{ color: '#E11D48' }}>
                              *
                            </Box>
                          </Typography>
                          <FormikAppTextField
                            name="organizationName"
                            placeholder="e.g Nulloy Empire"
                            fullWidth
                          />
                        </Box>
                      </>
                    ) : (
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
                          Full Name
                        </Typography>
                        <FormikAppTextField
                          name="fullName"
                          placeholder="e.g Sarah Johnson"
                          fullWidth
                        />
                      </Box>
                    )}

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
                        Email address
                      </Typography>
                      <FormikAppTextField
                        name="email"
                        placeholder="you@example.com"
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
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
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
                          Password
                        </Typography>
                        <StyledLink
                          href="#"
                          sx={{
                            fontSize: pxToRem(12),
                            lineHeight: pxToRem(18),
                            fontWeight: 500,
                            color: '#007AFF',
                          }}
                        >
                          Forgot password?
                        </StyledLink>
                      </Box>
                      <FormikAppPasswordField
                        name="password"
                        placeholder="Enter your password"
                        fullWidth
                      />
                    </Box>
                  </Box>

                  <AppButton
                    type="submit"
                    variant="contained"
                    fullWidth
                    isLoading={isSubmitting}
                    disabled={!isValid || isSubmitting}
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
                    Create Account
                  </AppButton>

                  <Box
                    sx={{
                      mt: pxToRem(10),
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
                      Already have an account?
                    </Typography>
                    <StyledLink
                      href={`/login?account=${accountType}`}
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

          <Box
            sx={{
              mt: pxToRem(28),
              display: 'flex',
              alignItems: 'center',
              gap: pxToRem(16),
            }}
          >
            <Divider sx={{ flex: 1, bgcolor: '#E9EEF4' }} />
            <Typography
              sx={{
                fontSize: pxToRem(11),
                lineHeight: pxToRem(16.5),
                fontWeight: 500,
                letterSpacing: '0.05em',
                color: '#CBD5E1',
              }}
            >
              OR
            </Typography>
            <Divider sx={{ flex: 1, bgcolor: '#E9EEF4' }} />
          </Box>

          <AppButton
            variant="outlined"
            fullWidth
            sx={{
              mt: pxToRem(18),
              height: pxToRem(44),
              borderRadius: pxToRem(41),
              border: '0.667px solid #E2E8F0',
              bgcolor: '#FFFFFF',
              boxShadow: '0px 1px 1.5px rgba(0,0,0,0.04)',
              color: '#4A5565',
              fontSize: pxToRem(13),
              lineHeight: pxToRem(19.5),
              fontWeight: 500,
              '&:hover': {
                bgcolor: '#FFFFFF',
                border: '0.667px solid #E2E8F0',
                boxShadow: '0px 1px 1.5px rgba(0,0,0,0.04)',
              },
            }}
            onClick={() => undefined}
          >
            <PersonOutlineOutlinedIcon
              sx={{ fontSize: pxToRem(15), color: '#4A5565' }}
            />
            Continue as guest
          </AppButton>

          <Typography
            sx={{
              mt: pxToRem(16),
              fontSize: pxToRem(11),
              lineHeight: pxToRem(16.5),
              fontWeight: 400,
              color: '#CBD5E1',
              textAlign: 'center',
            }}
          >
            By continuing, you agree to MediGo&apos;s{' '}
            <Box
              component="span"
              sx={{ color: '#94A3B8', textDecoration: 'underline' }}
            >
              Terms
            </Box>{' '}
            &amp;{' '}
            <Box
              component="span"
              sx={{ color: '#94A3B8', textDecoration: 'underline' }}
            >
              Privacy Policy
            </Box>
          </Typography>
        </Box>
      </Box>
    </AppLayout>
  );
}
