'use client';

import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { Form, Formik, useFormikContext } from 'formik';
import Grid from '@mui/material/Grid';
import { ReactNode, useState } from 'react';
import * as Yup from 'yup';

import { pxToRem } from '@/common';
import { useAccountDeletionApi } from '@/common/hooks/api/collection';
import type { DeleteAccountFormValues } from '@/common/types';
import {
  AppButton,
  AppLabel,
  FormikAppTextField,
} from '@/ui/modules/components';
import { AppLayout } from '@/ui/modules/partials';

const SUPPORT_EMAIL = 'info@getmedigo.com';

/** Which of the three panels is on screen. */
type Step = 'form' | 'verify' | 'done';

const initialValues: DeleteAccountFormValues = {
  fullName: '',
  emailAddress: '',
  phoneNumber: '',
  reason: '',
  confirmUnderstanding: false,
};

const validationSchema = Yup.object({
  fullName: Yup.string().trim().required('Full name is required.'),
  emailAddress: Yup.string()
    .trim()
    .email('Please enter a valid email address.')
    .required('Email is required.'),
  phoneNumber: Yup.string().trim().required('Email is required.'),
  reason: Yup.string().trim().max(2000, 'Please keep this under 2000 characters.'),
  confirmUnderstanding: Yup.boolean().oneOf(
    [true],
    'You must confirm that you understand this is permanent.'
  ),
});

const verifySchema = Yup.object({
  code: Yup.string()
    .trim()
    .matches(/^\d{6}$/, 'Enter the 6-digit code from your email.')
    .required('Enter the 6-digit code from your email.'),
});

const DELETED_DATA = [
  'User profile information',
  'Contact information',
  'Login credentials',
  'Saved preferences',
  'Non-essential account records',
];

const RETAINED_DATA = [
  'Trip history records',
  'Payment transaction records',
  'Audit logs',
  'Regulatory compliance records',
  'Customer support records',
];

/**
 * =========================================================
 * SHARED PIECES
 * =========================================================
 */

function SectionHeader({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <Stack direction="row" spacing={1.25} alignItems="center">
      {icon}
      <Typography
        sx={{ fontSize: pxToRem(17), fontWeight: 700, color: '#0F172A' }}
      >
        {title}
      </Typography>
    </Stack>
  );
}

function BulletList({ items, muted }: { items: string[]; muted?: boolean }) {
  return (
    <Stack spacing={1}>
      {items.map((item) => (
        <Stack key={item} direction="row" spacing={1.25}>
          <Box
            sx={{
              mt: '9px',
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: muted ? '#D1D5DB' : '#2563EB',
              flexShrink: 0,
            }}
          />
          <Typography
            sx={{
              fontSize: pxToRem(14),
              lineHeight: pxToRem(22),
              color: '#4B5563',
            }}
          >
            {item}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: pxToRem(14),
        border: '1px solid #E5E7EB',
        bgcolor: '#FFFFFF',
        p: { xs: pxToRem(20), md: pxToRem(28) },
      }}
    >
      {children}
    </Paper>
  );
}

/**
 * The consent checkbox has to read Formik state, and Formik's render prop is
 * already deep in the tree by then, so it takes its values from context.
 */
function ConfirmUnderstandingField() {
  const { values, errors, touched, setFieldValue, setFieldTouched } =
    useFormikContext<DeleteAccountFormValues>();
  const showError = Boolean(touched.confirmUnderstanding && errors.confirmUnderstanding);

  return (
    <Box>
      <FormControlLabel
        control={
          <Checkbox
            name="confirmUnderstanding"
            checked={values.confirmUnderstanding}
            onChange={(event) => {
              setFieldTouched('confirmUnderstanding', true, false);
              void setFieldValue('confirmUnderstanding', event.target.checked);
            }}
            sx={{
              color: showError ? '#DC2626' : '#9CA3AF',
              '&.Mui-checked': { color: '#DC2626' },
            }}
          />
        }
        label={
          <Typography
            sx={{
              fontSize: pxToRem(13),
              lineHeight: pxToRem(20),
              color: '#4B5563',
            }}
          >
            I understand that deleting my MediGo account is permanent, that I
            will no longer be able to sign in, and that this cannot be undone.
          </Typography>
        }
        sx={{ alignItems: 'flex-start', m: 0, gap: pxToRem(4) }}
      />
      {showError ? (
        <Typography
          sx={{ fontSize: pxToRem(12), color: '#DC2626', mt: pxToRem(4) }}
        >
          {errors.confirmUnderstanding}
        </Typography>
      ) : null}
    </Box>
  );
}

/**
 * =========================================================
 * PAGE
 * =========================================================
 */

export function DeleteAccountPage() {
  const [step, setStep] = useState<Step>('form');
  const [email, setEmail] = useState('');
  const [reference, setReference] = useState('');

  const {
    submitRequest,
    verifyCode,
    resendCode,
    isSubmitting,
    isVerifying,
    isResending,
  } = useAccountDeletionApi();

  return (
    <AppLayout>
      <Box
        sx={{
          bgcolor: '#F8FAFC',
          minHeight: `calc(100vh - ${pxToRem(64)})`,
          px: { xs: pxToRem(16), md: pxToRem(40) },
          py: { xs: pxToRem(28), md: pxToRem(48) },
        }}
      >
        <Box sx={{ maxWidth: '860px', mx: 'auto' }}>
          <Stack spacing={pxToRem(10)} sx={{ mb: pxToRem(28) }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  bgcolor: '#FEE2E2',
                  color: '#DC2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <DeleteForeverOutlinedIcon sx={{ fontSize: 22 }} />
              </Box>
              <Typography
                sx={{
                  color: '#0F172A',
                  fontWeight: 700,
                  fontSize: { xs: pxToRem(22), md: pxToRem(30) },
                  lineHeight: 1.2,
                }}
              >
                Delete Your MediGo Account
              </Typography>
            </Stack>

            <Typography
              sx={{
                color: '#64748B',
                fontSize: pxToRem(14),
                lineHeight: pxToRem(23),
              }}
            >
              At MediGo we respect your privacy and your right to control your
              personal information. You can request deletion of your account and
              associated personal data here — you do not need the app or an
              active session to do so.
            </Typography>
          </Stack>

          <Stack spacing={pxToRem(20)}>
            {step === 'form' ? (
              <Card>
                <Stack spacing={pxToRem(20)}>
                  <SectionHeader
                    icon={
                      <MarkEmailReadOutlinedIcon
                        sx={{ fontSize: 20, color: '#2563EB' }}
                      />
                    }
                    title="Request Account Deletion"
                  />

                  <Typography
                    sx={{
                      fontSize: pxToRem(14),
                      lineHeight: pxToRem(23),
                      color: '#4B5563',
                    }}
                  >
                    Enter the details on your MediGo account. We will email a
                    6-digit code to that address to confirm the request came
                    from you — nothing is deleted until you enter it.
                  </Typography>

                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={async (values) => {
                      const ok = await submitRequest(values);
                      if (ok) {
                        setEmail(values.emailAddress.trim());
                        setStep('verify');
                      }
                    }}
                  >
                    {() => (
                      <Box component={Form}>
                        <Grid container spacing={2.5}>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <Stack spacing={1}>
                              <AppLabel required>Full Name</AppLabel>
                              <FormikAppTextField
                                name="fullName"
                                placeholder="Type your full name here."
                                fullWidth
                              />
                            </Stack>
                          </Grid>

                          <Grid size={{ xs: 12, md: 6 }}>
                            <Stack spacing={1}>
                              <AppLabel required>
                                Registered Email Address
                              </AppLabel>
                              <FormikAppTextField
                                name="emailAddress"
                                placeholder="Enter your email here."
                                fullWidth
                              />
                            </Stack>
                          </Grid>

                          <Grid size={{ xs: 12, md: 6 }}>
                            <Stack spacing={1}>
                              <AppLabel required>Registered Phone Number</AppLabel>
                              <FormikAppTextField
                                name="phoneNumber"
                                placeholder="Enter your phone number"
                                fullWidth
                              />
                            </Stack>
                          </Grid>

                          <Grid size={{ xs: 12 }}>
                            <Stack spacing={1}>
                              <AppLabel>Reason for Request (Optional)</AppLabel>
                              <FormikAppTextField
                                name="reason"
                                placeholder="Tell us why you are leaving, if you would like to."
                                fullWidth
                                multiline
                                minRows={3}
                              />
                            </Stack>
                          </Grid>

                          <Grid size={{ xs: 12 }}>
                            <Box
                              sx={{
                                borderRadius: pxToRem(12),
                                border: '1px solid #FECACA',
                                bgcolor: '#FFF5F5',
                                p: pxToRem(16),
                              }}
                            >
                              <ConfirmUnderstandingField />
                            </Box>
                          </Grid>

                          <Grid size={{ xs: 12 }}>
                            <AppButton
                              type="submit"
                              isLoading={isSubmitting}
                              sx={{
                                bgcolor: '#DC2626',
                                color: '#FFFFFF',
                                minWidth: 220,
                                height: 50,
                                '&:hover': {
                                  bgcolor: '#B91C1C',
                                  background: '#B91C1C',
                                },
                              }}
                            >
                              Send Verification Code
                            </AppButton>
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </Formik>
                </Stack>
              </Card>
            ) : null}

            {step === 'verify' ? (
              <Card>
                <Stack spacing={pxToRem(20)}>
                  <SectionHeader
                    icon={
                      <MarkEmailReadOutlinedIcon
                        sx={{ fontSize: 20, color: '#2563EB' }}
                      />
                    }
                    title="Confirm It's You"
                  />

                  <Typography
                    sx={{
                      fontSize: pxToRem(14),
                      lineHeight: pxToRem(23),
                      color: '#4B5563',
                    }}
                  >
                    If <strong>{email}</strong> belongs to a MediGo account, we
                    have just emailed it a 6-digit code. Enter it below to
                    confirm your request. The code expires in 15 minutes.
                  </Typography>

                  <Formik
                    initialValues={{ code: '' }}
                    validationSchema={verifySchema}
                    onSubmit={async (values) => {
                      const result = await verifyCode(email, values.code);
                      if (result) {
                        setReference(result.reference);
                        setStep('done');
                      }
                    }}
                  >
                    {() => (
                      <Box component={Form}>
                        <Stack spacing={pxToRem(18)}>
                          <Stack spacing={1} sx={{ maxWidth: 280 }}>
                            <AppLabel required>Verification Code</AppLabel>
                            <FormikAppTextField
                              name="code"
                              placeholder="000000"
                              fullWidth
                              inputProps={{
                                inputMode: 'numeric',
                                maxLength: 6,
                                style: { letterSpacing: '0.4em' },
                              }}
                            />
                          </Stack>

                          <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={pxToRem(12)}
                          >
                            <AppButton
                              type="submit"
                              isLoading={isVerifying}
                              sx={{
                                bgcolor: '#DC2626',
                                color: '#FFFFFF',
                                minWidth: 200,
                                height: 50,
                                '&:hover': {
                                  bgcolor: '#B91C1C',
                                  background: '#B91C1C',
                                },
                              }}
                            >
                              Confirm Deletion Request
                            </AppButton>

                            <AppButton
                              type="button"
                              variant="outlined"
                              isLoading={isResending}
                              onClick={() => {
                                void resendCode(email);
                              }}
                              sx={{
                                minWidth: 160,
                                height: 50,
                                border: '1px solid #E5E7EB',
                                color: '#374151',
                                background: '#FFFFFF',
                                '&:hover': {
                                  background: '#F9FAFB !important',
                                },
                              }}
                            >
                              Resend Code
                            </AppButton>
                          </Stack>

                          <Typography
                            component="button"
                            type="button"
                            onClick={() => setStep('form')}
                            sx={{
                              alignSelf: 'flex-start',
                              background: 'none',
                              border: 'none',
                              p: 0,
                              cursor: 'pointer',
                              fontSize: pxToRem(13),
                              fontWeight: 600,
                              color: '#2563EB',
                              textDecoration: 'underline',
                            }}
                          >
                            Used the wrong email? Start over
                          </Typography>
                        </Stack>
                      </Box>
                    )}
                  </Formik>
                </Stack>
              </Card>
            ) : null}

            {step === 'done' ? (
              <Card>
                <Stack spacing={pxToRem(16)}>
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <CheckCircleRoundedIcon
                      sx={{ fontSize: 24, color: '#2E865E' }}
                    />
                    <Typography
                      sx={{
                        fontSize: pxToRem(19),
                        fontWeight: 700,
                        color: '#0F172A',
                      }}
                    >
                      Request Received
                    </Typography>
                  </Stack>

                  <Typography
                    sx={{
                      fontSize: pxToRem(14),
                      lineHeight: pxToRem(23),
                      color: '#4B5563',
                    }}
                  >
                    Thank you. Your deletion request has been verified and sent
                    to our team for review. We will process it within{' '}
                    <strong>30 days</strong> and email you once it is complete.
                  </Typography>

                  <Box
                    sx={{
                      borderRadius: pxToRem(12),
                      border: '1px solid #E5E7EB',
                      bgcolor: '#F9FAFB',
                      p: pxToRem(16),
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: pxToRem(12),
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: '#6B7280',
                        mb: pxToRem(6),
                      }}
                    >
                      Your reference number
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: pxToRem(15),
                        fontWeight: 700,
                        color: '#111827',
                        wordBreak: 'break-all',
                      }}
                    >
                      {reference}
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      fontSize: pxToRem(14),
                      lineHeight: pxToRem(23),
                      color: '#4B5563',
                    }}
                  >
                    Changed your mind, or have a question? Contact{' '}
                    <Box
                      component="a"
                      href={`mailto:${SUPPORT_EMAIL}`}
                      sx={{ color: '#2563EB', fontWeight: 600 }}
                    >
                      {SUPPORT_EMAIL}
                    </Box>{' '}
                    quoting your reference number before the request is
                    processed.
                  </Typography>
                </Stack>
              </Card>
            ) : null}

            {/* Disclosure below stays visible at every step — Play reviewers
                and users both need it without having to submit anything. */}
            <Card>
              <Stack spacing={pxToRem(22)}>
                <Box sx={{ display: 'grid', gap: pxToRem(12) }}>
                  <SectionHeader
                    icon={
                      <ScheduleOutlinedIcon
                        sx={{ fontSize: 20, color: '#2563EB' }}
                      />
                    }
                    title="What Happens Next?"
                  />
                  <Typography
                    sx={{
                      fontSize: pxToRem(14),
                      lineHeight: pxToRem(23),
                      color: '#4B5563',
                    }}
                  >
                    Once your request is received and your identity has been
                    verified, MediGo will process your account deletion request
                    within <strong>30 days</strong>. You will receive a
                    confirmation email once the deletion has been completed.
                  </Typography>
                </Box>

                <Divider />

                <Box sx={{ display: 'grid', gap: pxToRem(12) }}>
                  <SectionHeader
                    icon={
                      <DeleteForeverOutlinedIcon
                        sx={{ fontSize: 20, color: '#2563EB' }}
                      />
                    }
                    title="Data That Will Be Deleted"
                  />
                  <BulletList items={DELETED_DATA} />
                </Box>

                <Divider />

                <Box sx={{ display: 'grid', gap: pxToRem(12) }}>
                  <SectionHeader
                    icon={
                      <ShieldOutlinedIcon
                        sx={{ fontSize: 20, color: '#2563EB' }}
                      />
                    }
                    title="Data That May Be Retained"
                  />
                  <Typography
                    sx={{
                      fontSize: pxToRem(14),
                      lineHeight: pxToRem(23),
                      color: '#4B5563',
                    }}
                  >
                    Certain information may be retained for legal, regulatory,
                    operational, security, fraud prevention, accounting,
                    billing, insurance, transportation compliance, and
                    record-keeping purposes where required by applicable laws or
                    legitimate business needs. Examples include:
                  </Typography>
                  <BulletList items={RETAINED_DATA} muted />
                  <Typography
                    sx={{
                      fontSize: pxToRem(14),
                      lineHeight: pxToRem(23),
                      color: '#4B5563',
                    }}
                  >
                    Retained information is only stored for the period required
                    by law or legitimate business obligations.
                  </Typography>
                </Box>

                <Divider />

                <Box sx={{ display: 'grid', gap: pxToRem(12) }}>
                  <SectionHeader
                    icon={
                      <WarningAmberRoundedIcon
                        sx={{ fontSize: 20, color: '#2563EB' }}
                      />
                    }
                    title="Need Help?"
                  />
                  <Typography
                    sx={{
                      fontSize: pxToRem(14),
                      lineHeight: pxToRem(23),
                      color: '#4B5563',
                    }}
                  >
                    If you cannot access the email address on your account, or
                    the code does not arrive, email{' '}
                    <Box
                      component="a"
                      href={`mailto:${SUPPORT_EMAIL}`}
                      sx={{ color: '#2563EB', fontWeight: 600 }}
                    >
                      {SUPPORT_EMAIL}
                    </Box>{' '}
                    with the subject line{' '}
                    <strong>&ldquo;Account Deletion Request&rdquo;</strong> and
                    include your full name, registered email address and
                    registered phone number.
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Stack>
        </Box>
      </Box>
    </AppLayout>
  );
}
