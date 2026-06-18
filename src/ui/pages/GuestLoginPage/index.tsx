'use client';

import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { Box, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import * as yup from 'yup';

import { pxToRem, setGuestSessionId, useRidesApi } from '@/common';
import { AppButton, FormikAppTextField } from '@/ui/modules/components';
import { AppLayout } from '@/ui/modules/partials';
import { HeaderBackButton } from '@/ui/modules/partials/AppHeader/ui/components';

type GuestLoginFormValues = {
  firstName: string;
  lastName: string;
  email: string;
};

const validationSchema = yup.object({
  firstName: yup.string().trim().required('First name is required'),
  lastName: yup.string().trim().required('Last name is required'),
  email: yup
    .string()
    .trim()
    .email('Enter a valid email address')
    .required('Email is required'),
});

const initialValues: GuestLoginFormValues = {
  firstName: '',
  lastName: '',
  email: '',
};

export function GuestLoginPage() {
  const { createGuestSession } = useRidesApi();

  const handleSubmit = async (values: GuestLoginFormValues) => {
    const firstName = values.firstName.trim();
    const lastName = values.lastName.trim();

    const guestSession = await createGuestSession({
      email: values.email.trim(),
      full_name: `${firstName} ${lastName}`,
      first_name: firstName,
      last_name: lastName,
    });
    if (guestSession?.session_id) {
      setGuestSessionId(guestSession.session_id);
    }
  };

  return (
    <AppLayout
      headerProps={{
        showRightContent: true,
        rightContent: <HeaderBackButton href="/login" />,
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
              py: pxToRem(32),
            }}
          >
            <Box
              sx={{
                width: pxToRem(40),
                height: pxToRem(40),
                borderRadius: '50%',
                bgcolor: '#EFF6FF',
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: pxToRem(18),
              }}
            >
              <PersonOutlineOutlinedIcon sx={{ fontSize: pxToRem(21) }} />
            </Box>

            <Typography
              sx={{
                fontSize: pxToRem(24),
                lineHeight: pxToRem(30),
                fontWeight: 700,
                color: '#0F172A',
                letterSpacing: '-0.02em',
              }}
            >
              Continue as a guest
            </Typography>
            <Typography
              sx={{
                mt: pxToRem(6),
                mb: pxToRem(22),
                fontSize: pxToRem(14),
                lineHeight: pxToRem(22.4),
                color: '#64748B',
              }}
            >
              Enter your details to start a guest booking.
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
                    <GuestField
                      label="First name"
                      name="firstName"
                      placeholder="Enter your first name"
                    />
                    <GuestField
                      label="Last name"
                      name="lastName"
                      placeholder="Enter your last name"
                    />
                    <GuestField
                      label="Email address"
                      name="email"
                      placeholder="you@example.com"
                      type="email"
                    />
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
                      bgcolor: '#007AFF',
                      fontSize: pxToRem(14),
                      fontWeight: 600,
                      '&:hover': { bgcolor: '#007AFF' },
                    }}
                  >
                    Continue
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

function GuestField({
  label,
  ...fieldProps
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: pxToRem(8) }}>
      <Typography
        sx={{
          fontSize: pxToRem(13),
          lineHeight: pxToRem(19.5),
          fontWeight: 500,
          color: '#0F172A',
        }}
      >
        {label}
      </Typography>
      <FormikAppTextField {...fieldProps} fullWidth />
    </Box>
  );
}
