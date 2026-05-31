'use client';

import { Box, Button, List, ListItem, Paper, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { pxToRem, usePlacesAutocomplete, PlacePrediction } from '@/common';
import { useUsersMeApi } from '@/common/hooks/api/collection';
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

// No validation - all fields optional
const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address'),
});

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
  const [firstName, ...rest] = (snapshot.name || '').trim().split(/\s+/);
  const lastName = rest.join(' ');

  return {
    firstName: firstName || '',
    lastName: lastName || '',
    dateOfBirth: snapshot.dateOfBirth || '',
    email: snapshot.email || '',
    phone: snapshot.phone || '',
    homeAddress: snapshot.homeAddress || '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    avatarFile: snapshot.avatarUrl instanceof File ? snapshot.avatarUrl : null,
    avatarPreviewUrl:
      typeof snapshot.avatarUrl === 'string' ? snapshot.avatarUrl : null,
  };
}

export function PersonalTab({
  snapshot,
  onSnapshotChange,
  registerSubmit,
}: {
  snapshot: ProfileSnapshot;
  onSnapshotChange: (next: ProfileSnapshot) => void;
  registerSubmit?: (submit: () => void, isFormValid: boolean) => void;
}) {
  const { updateMyProfile } = useUsersMeApi();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAvatarChange, setHasAvatarChange] = useState(false);

  const formik = useFormik<PersonalFormValues>({
    initialValues: getInitialValues(snapshot),
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setIsSubmitting(true);
      setSubmitting(true);

      const result = await updateMyProfile({
        first_name: values.firstName,
        last_name: values.lastName,
        date_of_birth: values.dateOfBirth || undefined,
        home_address: values.homeAddress || undefined,
        phone: values.phone || undefined,
        avatar_url: values.avatarFile || undefined,
      });
      if (result) {
        const name = `${values.firstName} ${values.lastName}`.trim();
        onSnapshotChange({
          ...snapshot,
          name,
          email: values.email,
          phone: values.phone,
          avatarUrl: values.avatarPreviewUrl ?? snapshot.avatarUrl,
          homeAddress: values.homeAddress,
        });

        // Reset form with updated values to clear dirty state
        resetForm({ values });
        setHasAvatarChange(false);
      }

      setIsSubmitting(false);
      setSubmitting(false);
    },
  });

  // Track avatar changes
  useEffect(() => {
    if (snapshot.avatarUrl instanceof File) {
      setHasAvatarChange(true);
    }
  }, [snapshot.avatarUrl]);

  useEffect(() => {
    registerSubmit?.(
      () => {
        void formik.submitForm();
      },
      (formik.dirty || hasAvatarChange) && !isSubmitting
    );
  }, [formik, registerSubmit, formik.dirty, hasAvatarChange, isSubmitting]);

  // Address autocomplete
  const [addressInput, setAddressInput] = useState(formik.values.homeAddress);
  const addressAutocomplete = usePlacesAutocomplete(addressInput);

  // Sync addressInput with formik value when it changes (e.g., after form reset)
  useEffect(() => {
    setAddressInput(formik.values.homeAddress);
  }, [formik.values.homeAddress]);

  const handleSelectAddress = (prediction: PlacePrediction) => {
    addressAutocomplete.clearPredictions();
    setAddressInput(prediction.description);
    void formik.setFieldValue('homeAddress', prediction.description);
  };

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
                          sx={{
                            fontSize: pxToRem(12),
                            fontWeight: 700,
                            color: '#0F172A',
                          }}
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
                          buttonSx={{
                            width: '100%',
                            justifyContent: 'flex-start',
                          }}
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
                    {/* <Grid size={{ xs: 12 }}>
                      <FormikAppTextField
                        name="phone"
                        placeholder="Phone Number"
                        size="small"
                      />
                    </Grid> */}
                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ position: 'relative' }}>
                        <FormikAppTextField
                          name="homeAddress"
                          placeholder="Home Address"
                          size="small"
                          value={addressInput}
                          onChange={(e: any) => {
                            const val = e.target.value;
                            setAddressInput(val);
                            void formik.setFieldValue('homeAddress', val);
                          }}
                        />
                        {addressAutocomplete.predictions.length > 0 && (
                          <Paper
                            elevation={4}
                            sx={{
                              position: 'absolute',
                              top: '100%',
                              left: 0,
                              right: 0,
                              zIndex: 10,
                              maxHeight: '200px',
                              overflowY: 'auto',
                              mt: pxToRem(4),
                              borderRadius: pxToRem(8),
                            }}
                          >
                            <List dense disablePadding>
                              {addressAutocomplete.predictions.map((p) => (
                                <ListItem
                                  key={p.placeId}
                                  onClick={() => handleSelectAddress(p)}
                                  sx={{
                                    cursor: 'pointer',
                                    px: pxToRem(12),
                                    py: pxToRem(8),
                                    fontSize: pxToRem(12),
                                    '&:hover': { bgcolor: '#F1F5F9' },
                                  }}
                                >
                                  {p.description}
                                </ListItem>
                              ))}
                            </List>
                          </Paper>
                        )}
                      </Box>
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
              {/* <Centered
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
                <SectionTitle
                  label="Premium Member"
                  iconSrc={whiteGuardIcon}
                  bgSection="#155DFC"
                />
                <Box
                  sx={{
                    mt: pxToRem(8),
                    fontSize: pxToRem(10),
                    color: '#64748B',
                    lineHeight: pxToRem(14),
                  }}
                >
                  Access to priority scheduling, 24/7 support, and exclusive
                  benefits.
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
              </Centered> */}

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
                <SectionTitle
                  label="Your Stats"
                  iconSrc={whiteGuardIcon}
                  bgSection="#155DFC"
                />
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
