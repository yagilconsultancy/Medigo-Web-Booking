'use client';

import { Box, Button, Paper, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect } from 'react';
import { FormikProvider, useFormik } from 'formik';
import { pxToRem } from '@/common';
import {
  AppDatePickerPopover,
  Centered,
  FormikAppTextField,
} from '@/ui/modules/components';
import userIcon from '../../assets/icons/user.svg';
import redPhoneIcon from '../../assets/icons/red-phone.svg';
import whiteGuardIcon from '../../assets/icons/white-guard.svg';
import type { ProfileSnapshot } from '../../../index';
import { SectionTitle } from '../SectionTitle';
import { StatRow } from '../StatRow';

type PersonalFormValues = {
  firstName: string;
  lastName: string;
  dateOfBirth: string; // YYYY-MM-DD
  email: string;
  phone: string;
  homeAddress: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  avatarFile: File | null;
  avatarPreviewUrl: string | null;
};

function toDayjsFromStoredDate(value: string): Dayjs | null {
  if (!value) return null;
  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed : null;
  }
  return null;
}

function getInitialValues(snapshot: ProfileSnapshot): PersonalFormValues {
  const [firstName, ...rest] = (snapshot.name || 'Sarah Johnson').trim().split(/\s+/);
  const lastName = rest.join(' ');

  return {
    firstName: firstName || 'Sarah',
    lastName: lastName || 'Johnson',
    dateOfBirth: '1990-10-10',
    email: snapshot.email || 'user@medigo.com',
    phone: snapshot.phone || '(555) 248-1397',
    homeAddress:
      'Toronto General Hospital, 200 Elizabeth St, Toronto, ON M5G 2C4, Canada',
    emergencyContactName: 'Michael Johnson',
    emergencyContactPhone: '(555) 987-6543',
    avatarFile: null,
    avatarPreviewUrl: snapshot.avatarUrl ?? null,
  };
}

export function PersonalTab({
  snapshot,
  onSnapshotChange,
  registerSubmit,
}: {
  snapshot: ProfileSnapshot;
  onSnapshotChange: (next: ProfileSnapshot) => void;
  registerSubmit?: (submit: () => void) => void;
}) {
  const formik = useFormik<PersonalFormValues>({
    initialValues: getInitialValues(snapshot),
    enableReinitialize: true,
    onSubmit: (values) => {
      const name = `${values.firstName} ${values.lastName}`.trim();
      onSnapshotChange({
        ...snapshot,
        name,
        email: values.email,
        phone: values.phone,
        avatarUrl: values.avatarPreviewUrl ?? undefined,
      });
    },
  });

  useEffect(() => {
    registerSubmit?.(() => {
      void formik.submitForm();
    });
  }, [formik, registerSubmit]);

  const dobValue = toDayjsFromStoredDate(formik.values.dateOfBirth);

  return (
    <FormikProvider value={formik}>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Box>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 9 }}>
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
                  label="Personal Information"
                  iconSrc={userIcon}
                  bgSection="#EFF6FF"
                />

                <Box sx={{ mt: pxToRem(14) }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormikAppTextField
                        name="firstName"
                        placeholder="First Name"
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormikAppTextField
                        name="lastName"
                        placeholder="Last Name"
                        size="small"
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'grid', gap: pxToRem(8) }}>
                        <Box
                          sx={{ fontSize: pxToRem(12), fontWeight: 700, color: '#0F172A' }}
                        >
                          Date of Birth
                        </Box>
                        <AppDatePickerPopover
                          value={dobValue}
                          onChange={(d) =>
                            formik.setFieldValue(
                              'dateOfBirth',
                              d ? d.format('YYYY-MM-DD') : ''
                            )
                          }
                          format="MM/DD/YYYY"
                          buttonSx={{ width: '100%', justifyContent: 'flex-start' }}
                        />
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <FormikAppTextField
                        name="email"
                        placeholder="Email Address"
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <FormikAppTextField
                        name="phone"
                        placeholder="Phone Number"
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <FormikAppTextField
                        name="homeAddress"
                        placeholder="Home Address"
                        size="small"
                        multiline
                        minRows={2}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  mt: pxToRem(16),
                  borderRadius: pxToRem(12),
                  border: '1px solid #E2E8F0',
                  bgcolor: '#FFFFFF',
                  p: pxToRem(16),
                }}
              >
                <SectionTitle
                  label="Emergency Contact"
                  iconSrc={redPhoneIcon}
                  bgSection="#FEF2F2"
                />

                <Box sx={{ mt: pxToRem(14) }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormikAppTextField
                        name="emergencyContactName"
                        placeholder="Contact Name"
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormikAppTextField
                        name="emergencyContactPhone"
                        placeholder="Contact Phone"
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Centered
              sx={{
                borderRadius: pxToRem(12),
                border: '1px solid #E2E8F0',
                background:
                  'linear-gradient(135deg, #EFF6FF 0%, #ECF4FF 7.14%, #E9F3FF 14.29%, #E6F1FF 21.43%, #E4EFFE 28.57%, #E1EDFE 35.71%, #DEECFE 42.86%, #DBEAFE 50%, #D7E8FE 57.14%, #D3E6FE 64.29%, #CFE4FE 71.43%, #CBE1FE 78.57%, #C7DFFE 85.71%, #C3DDFE 92.86%, #BFDBFE 100%)',
                p: '32px',
                height: '210.167px',
              }}
              direction={'column'}
            >
              <SectionTitle label="Premium Member" iconSrc={whiteGuardIcon} bgSection="#155DFC" />
              <Box sx={{ mt: pxToRem(8), fontSize: pxToRem(10), color: '#64748B', lineHeight: pxToRem(14) }}>
                Access to priority scheduling, 24/7 support, and exclusive benefits.
              </Box>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  mt: pxToRem(12),
                  borderRadius: pxToRem(10),
                  borderColor: '#BFDBFE',
                  bgcolor: '#FFFFFF',
                  color: '#2563EB',
                  fontSize: pxToRem(10),
                  fontWeight: 800,
                  textTransform: 'none',
                }}
              >
                Member since January 2024
              </Button>
            </Centered>

            <Stack
              sx={{
                mt: pxToRem(16),
                borderRadius: pxToRem(12),
                border: '1px solid #E2E8F0',
                bgcolor: '#FFFFFF',
                p: '32px',
              }}
              spacing={3}
            >
              <SectionTitle label="Your Stats" iconSrc={whiteGuardIcon} bgSection="#155DFC" />
              <Stack spacing={2}>
                <StatRow label="Total Rides" value="47" />
                <StatRow label="Miles Traveled" value="1,284" />
                <StatRow label="Avg. Rating Given" value="4.9" />
                <StatRow label="Member Since" value="Jan 2024" />
              </Stack>
            </Stack>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </FormikProvider>
  );
}
