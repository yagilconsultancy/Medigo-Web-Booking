'use client';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import {
  Box,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { FormikProvider, useFormik } from 'formik';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import { pxToRem, removeAuthToken, removeRefreshToken } from '@/common';
import { useUsersMeApi } from '@/common/hooks/api/collection';
import {
  AppButton,
  AppModal,
  FormikAppTextField,
} from '@/ui/modules/components';

type DeleteAccountFormValues = {
  confirmationName: string;
};

function SectionHeader({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {icon}
      <Typography
        sx={{
          fontSize: pxToRem(18),
          fontWeight: 800,
          color: '#111827',
        }}
      >
        {title}
      </Typography>
    </Stack>
  );
}

export function DeleteAccountSection({ name }: { name: string }) {
  const router = useRouter();
  const { deleteMyProfile } = useUsersMeApi();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const confirmationName = name.trim();

  const validationSchema = useMemo(
    () =>
      Yup.object({
        confirmationName: Yup.string()
          .trim()
          .required('Type your full name to continue')
          .oneOf([confirmationName], 'Name does not match'),
      }),
    [confirmationName]
  );

  const formik = useFormik<DeleteAccountFormValues>({
    initialValues: { confirmationName: '' },
    enableReinitialize: true,
    validateOnMount: true,
    validationSchema,
    onSubmit: async (_, { resetForm }) => {
      if (!confirmationName) return;

      setIsDeleting(true);
      const success = await deleteMyProfile();

      if (success) {
        resetForm();
        setOpen(false);
        removeAuthToken();
        removeRefreshToken();
        router.replace('/login');
      }

      setIsDeleting(false);
    },
  });

  const canConfirm =
    Boolean(confirmationName) && formik.dirty && formik.isValid && !isDeleting;

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          mt: pxToRem(16),
          borderRadius: pxToRem(12),
          border: '1px solid #FECACA',
          bgcolor: '#FFF5F5',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: pxToRem(16),
            p: pxToRem(20),
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ display: 'grid', gap: pxToRem(8), maxWidth: 760 }}>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: '#FEE2E2',
                  color: '#DC2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <WarningAmberRoundedIcon sx={{ fontSize: 20 }} />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontSize: pxToRem(18),
                    fontWeight: 800,
                    color: '#991B1B',
                  }}
                >
                  Delete Account
                </Typography>
                <Typography
                  sx={{
                    fontSize: pxToRem(12),
                    fontWeight: 600,
                    color: '#B91C1C',
                  }}
                >
                  Permanent and irreversible
                </Typography>
              </Box>
            </Stack>

            <Typography
              sx={{
                fontSize: pxToRem(13),
                lineHeight: pxToRem(22),
                color: '#7F1D1D',
                maxWidth: 760,
              }}
            >
              Deleting your MediGO account will permanently remove your profile
              and related account data from this site. This action cannot be
              undone.
            </Typography>
          </Box>

          <AppButton
            type="button"
            onClick={() => setOpen(true)}
            disabled={!confirmationName}
            sx={{
              bgcolor: '#DC2626',
              color: '#FFFFFF',
              minWidth: 160,
              '&:hover': {
                bgcolor: '#B91C1C',
                background: '#B91C1C',
              },
              '&:disabled': {
                opacity: 0.6,
              },
            }}
          >
            Delete Account
          </AppButton>
        </Box>
      </Paper>

      <AppModal
        open={open}
        setOpen={setOpen}
        label="delete-account-confirmation"
        padding="0"
        sx={{
          '& .MuiDialog-paper': {
            width: 720,
            maxHeight: 500,
            boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.28)',
          },
        }}
      >
        <FormikProvider value={formik}>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              maxHeight: 500,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: pxToRem(16),
                px: pxToRem(18),
                py: pxToRem(14),
                borderBottom: '1px solid #EEF2F7',
                flexShrink: 0,
              }}
            >
              <Stack spacing={0.4}>
                <Typography
                  sx={{
                    fontSize: pxToRem(12),
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#6B7280',
                  }}
                >
                  MediGo Account Deletion
                </Typography>
              </Stack>

              <IconButton
                onClick={() => setOpen(false)}
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: '#F3F4F6',
                  '&:hover': { bgcolor: '#E5E7EB' },
                }}
              >
                <CloseRoundedIcon sx={{ fontSize: 16, color: '#64748B' }} />
              </IconButton>
            </Box>

            <Box
              sx={{
                px: pxToRem(18),
                py: pxToRem(18),
                overflowY: 'auto',
                flex: 1,
              }}
            >
              <Box sx={{ display: 'grid', gap: pxToRem(18) }}>
                <Box>
                  <Typography
                    sx={{
                      fontSize: pxToRem(28),
                      lineHeight: 1.15,
                      fontWeight: 800,
                      letterSpacing: '-0.03em',
                      color: '#111827',
                      mb: pxToRem(10),
                    }}
                  >
                    Request Deletion of Your MediGo Account
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: pxToRem(14),
                      lineHeight: pxToRem(24),
                      color: '#4B5563',
                      maxWidth: 640,
                    }}
                  >
                    At MediGo, we respect your privacy and your right to control
                    your personal information. If you would like to delete your
                    MediGo account and associated personal data, please submit a
                    request by contacting our support team.
                  </Typography>
                </Box>

                <Box sx={{ display: 'grid', gap: pxToRem(12) }}>
                  <SectionHeader
                    icon={
                      <DraftsOutlinedIcon
                        sx={{ fontSize: 18, color: '#2563EB' }}
                      />
                    }
                    title="How to Request Account Deletion"
                  />

                  <Typography
                    sx={{
                      fontSize: pxToRem(14),
                      lineHeight: pxToRem(24),
                      color: '#4B5563',
                    }}
                  >
                    Please send an email to:
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: pxToRem(14),
                      lineHeight: pxToRem(24),
                      fontWeight: 700,
                      color: '#2563EB',
                    }}
                  >
                    info@getmedigo.com
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: pxToRem(14),
                      lineHeight: pxToRem(24),
                      color: '#4B5563',
                    }}
                  >
                    with the subject line:
                  </Typography>

                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignSelf: 'flex-start',
                      borderRadius: pxToRem(8),
                      border: '1px solid #E5E7EB',
                      bgcolor: '#F9FAFB',
                      px: pxToRem(12),
                      py: pxToRem(8),
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: pxToRem(13),
                        fontWeight: 700,
                        color: '#374151',
                      }}
                    >
                      Account Deletion Request
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      fontSize: pxToRem(14),
                      lineHeight: pxToRem(24),
                      color: '#4B5563',
                    }}
                  >
                    In your email, please include the following information:
                  </Typography>

                  <Stack spacing={1}>
                    {[
                      'Full Name',
                      'Registered Email Address',
                      'Registered Phone Number',
                      'Reason for Request (Optional)',
                    ].map((item) => (
                      <Stack key={item} direction="row" spacing={1.25}>
                        <Box
                          sx={{
                            mt: '9px',
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor: '#2563EB',
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
                </Box>

                <Divider />

                <Box sx={{ display: 'grid', gap: pxToRem(10) }}>
                  <SectionHeader
                    icon={
                      <WarningAmberRoundedIcon
                        sx={{ fontSize: 18, color: '#2563EB' }}
                      />
                    }
                    title="What Happens Next?"
                  />

                  <Typography
                    sx={{
                      fontSize: pxToRem(14),
                      lineHeight: pxToRem(24),
                      color: '#4B5563',
                    }}
                  >
                    Once your request is received and your identity has been
                    verified, MediGo will process your account deletion request
                    within{' '}
                    <Box component="span" sx={{ fontWeight: 800 }}>
                      30 days
                    </Box>
                    .
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: pxToRem(14),
                      lineHeight: pxToRem(24),
                      color: '#4B5563',
                    }}
                  >
                    You will receive a confirmation email once the deletion
                    process has been completed.
                  </Typography>
                </Box>

                <Divider />

                <Box sx={{ display: 'grid', gap: pxToRem(10) }}>
                  <SectionHeader
                    icon={
                      <DeleteForeverOutlinedIcon
                        sx={{ fontSize: 18, color: '#2563EB' }}
                      />
                    }
                    title="Data That Will Be Deleted"
                  />

                  <Typography
                    sx={{
                      fontSize: pxToRem(14),
                      lineHeight: pxToRem(24),
                      color: '#4B5563',
                    }}
                  >
                    Upon approval of your request, MediGo will delete:
                  </Typography>

                  <Stack spacing={1}>
                    {[
                      'User profile information',
                      'Contact information',
                      'Login credentials',
                      'Saved preferences',
                      'Non-essential account records',
                    ].map((item) => (
                      <Stack key={item} direction="row" spacing={1.25}>
                        <Box
                          sx={{
                            mt: '9px',
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor: '#2563EB',
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
                </Box>

                <Divider />

                <Box sx={{ display: 'grid', gap: pxToRem(10) }}>
                  <SectionHeader
                    icon={
                      <ShieldOutlinedIcon
                        sx={{ fontSize: 18, color: '#2563EB' }}
                      />
                    }
                    title="Data That May Be Retained"
                  />

                  <Typography
                    sx={{
                      fontSize: pxToRem(14),
                      lineHeight: pxToRem(24),
                      color: '#4B5563',
                    }}
                  >
                    Certain information may be retained for legal, regulatory,
                    operational, security, fraud prevention, accounting,
                    billing, insurance, transportation compliance, and
                    record-keeping purposes where required by applicable laws or
                    legitimate business needs.
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: pxToRem(14),
                      lineHeight: pxToRem(24),
                      color: '#4B5563',
                    }}
                  >
                    Examples may include:
                  </Typography>

                  <Stack spacing={1}>
                    {[
                      'Trip history records',
                      'Payment transaction records',
                      'Audit logs',
                      'Regulatory compliance records',
                      'Customer support records',
                    ].map((item) => (
                      <Stack key={item} direction="row" spacing={1.25}>
                        <Box
                          sx={{
                            mt: '9px',
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor: '#D1D5DB',
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

                  <Typography
                    sx={{
                      fontSize: pxToRem(14),
                      lineHeight: pxToRem(24),
                      color: '#4B5563',
                    }}
                  >
                    Retained information will only be stored for the period
                    required by law or legitimate business obligations.
                  </Typography>
                </Box>

                <Divider />

                <Box
                  sx={{
                    borderRadius: pxToRem(14),
                    border: '1px solid #FECACA',
                    bgcolor: '#FFF5F5',
                    p: pxToRem(16),
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: pxToRem(12),
                      fontWeight: 400,
                      color: '#991B1B',
                      mb: pxToRem(8),
                    }}
                  >
                    Type your full name to confirm:
                    <Box component="span" sx={{ fontWeight: 800 }}>
                      {' '}
                      {confirmationName}
                    </Box>
                  </Typography>

                  <FormikAppTextField
                    name="confirmationName"
                    placeholder={confirmationName || 'Your full name'}
                    size="small"
                    disabled={!confirmationName}
                    validateBeforeTouch
                  />
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                px: pxToRem(18),
                py: pxToRem(14),
                borderTop: '1px solid #EEF2F7',
                flexShrink: 0,
              }}
            >
              <Stack
                direction={{ xs: 'column-reverse', sm: 'row' }}
                spacing={pxToRem(12)}
              >
                <AppButton
                  type="button"
                  variant="outlined"
                  onClick={() => setOpen(false)}
                  sx={{
                    flex: 1,
                    height: 50,
                    borderRadius: pxToRem(14),
                    border: '1px solid #E5E7EB',
                    color: '#374151',
                    background: '#FFFFFF',
                    '&:hover': {
                      background: '#F9FAFB !important',
                    },
                  }}
                >
                  Cancel
                </AppButton>

                <AppButton
                  type="submit"
                  disabled={!canConfirm}
                  sx={{
                    flex: 1,
                    height: 50,
                    borderRadius: pxToRem(14),
                    bgcolor: '#DC2626',
                    color: '#FFFFFF',
                    '&:hover': {
                      bgcolor: '#B91C1C',
                      background: '#B91C1C',
                    },
                    '&:disabled': {
                      opacity: 0.55,
                    },
                  }}
                >
                  {isDeleting ? 'Deleting Account...' : 'Delete My Account'}
                </AppButton>
              </Stack>
            </Box>
          </Box>
        </FormikProvider>
      </AppModal>
    </>
  );
}
