'use client';

import { Box, Paper, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useMemo } from 'react';
import { pxToRem } from '@/common';
import { StyledImage } from '@/ui/modules/components';
import { useBooking } from '../../../common';

import dialysisIcon from '../../assets/icons/dialysis-icon.svg';
import xrayIcon from '../../assets/icons/xray-icon.svg';
import checkupIcon from '../../assets/icons/checkup-icon.svg';
import chemotherapyIcon from '../../assets/icons/chemotherapy-icon.svg';
import physiotherapyIcon from '../../assets/icons/physiotherapy-icon.svg';
import surgeryIcon from '../../assets/icons/sugery-icon.svg';
import consultationIcon from '../../assets/icons/consultation-icon.svg';
import mentalHealthIcon from '../../assets/icons/mental-health-icon.svg';
import rehabilitationIcon from '../../assets/icons/rehabilitation-icon.svg';
import hospitalDischargeIcon from '../../assets/icons/hospital-discharge-icon.svg';
import bloodTestIcon from '../../assets/icons/blood-test-icon.svg';
import otherIcon from '../../assets/icons/other-icon.svg';

export type AppointmentStepProps = {
  accountType: 'individual' | 'facility';
};

type AppointmentOption = {
  key: string;
  label: string;
  icon: any;
};

export function AppointmentStep({ accountType }: AppointmentStepProps) {
  const { booking, setAppointment } = useBooking();

  const options = useMemo<AppointmentOption[]>(
    () => [
      { key: 'Dialysis', label: 'Dialysis', icon: dialysisIcon },
      { key: 'X-Ray / Scan', label: 'X-Ray / Scan', icon: xrayIcon },
      { key: 'Medical Checkup', label: 'Medical Checkup', icon: checkupIcon },
      { key: 'Chemotherapy', label: 'Chemotherapy', icon: chemotherapyIcon },
      { key: 'Physiotherapy', label: 'Physiotherapy', icon: physiotherapyIcon },
      { key: 'Surgery', label: 'Surgery', icon: surgeryIcon },
      { key: 'Consultation', label: 'Consultation', icon: consultationIcon },
      { key: 'Mental Health', label: 'Mental Health', icon: mentalHealthIcon },
      {
        key: 'Rehabilitation',
        label: 'Rehabilitation',
        icon: rehabilitationIcon,
      },
      {
        key: 'Hospital Discharge',
        label: 'Hospital Discharge',
        icon: hospitalDischargeIcon,
      },
      {
        key: 'Blood Test / Lab',
        label: 'Blood Test / Lab',
        icon: bloodTestIcon,
      },
      { key: 'Other', label: 'Other', icon: otherIcon },
    ],
    []
  );

  const selected = booking.appointment.type;
  const isOtherSelected = selected === 'Other';

  return (
    <Box
      sx={{
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: pxToRem(16),
      }}
    >
      <Box>
        <Typography
          sx={{
            fontSize: pxToRem(28),
            lineHeight: pxToRem(35),
            fontWeight: 700,
            color: '#0F172A',
          }}
        >
          What&apos;s the appointment for?
        </Typography>
        <Typography
          sx={{
            mt: pxToRem(4),
            fontSize: pxToRem(14),
            lineHeight: pxToRem(20),
            fontWeight: 400,
            color: '#64748B',
          }}
        >
          Select the type of medical appointment to help us match the right
          service.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {options.map((option) => {
          const isSelected = selected === option.key;

          return (
            <Grid key={option.key} size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper
                component="button"
                type="button"
                onClick={() =>
                  setAppointment({
                    type: option.key,
                    otherDetails:
                      option.key === 'Other'
                        ? booking.appointment.otherDetails
                        : '',
                  })
                }
                elevation={0}
                sx={{
                  width: '100%',
                  borderRadius: pxToRem(12),
                  border: isSelected
                    ? '2px solid #2F6FED'
                    : '1px solid #E2E8F0',
                  bgcolor: '#FFFFFF',
                  p: pxToRem(14),
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition:
                    'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    borderColor: '#2F6FED',
                    boxShadow:
                      '0px 10px 15px rgba(47,111,237,0.10), 0px 4px 6px rgba(47,111,237,0.08)',
                    '& .appointment-step__iconWrap': { bgcolor: '#2F6FED' },
                    '& img': { filter: 'brightness(0) invert(1)' },
                  },
                }}
              >
                <Box
                  className="appointment-step__iconWrap"
                  sx={{
                    width: pxToRem(52),
                    height: pxToRem(52),
                    borderRadius: '999999px',
                    bgcolor: isSelected ? '#2F6FED' : '#F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: pxToRem(10),
                  }}
                >
                  <StyledImage
                    src={option.icon}
                    alt=""
                    width={22}
                    height={22}
                    sx={{
                      width: pxToRem(22),
                      height: pxToRem(22),
                      filter: isSelected ? 'brightness(0) invert(1)' : 'none',
                    }}
                  />
                </Box>
                <Typography
                  className="appointment-step__label"
                  sx={{
                    fontSize: pxToRem(12),
                    fontWeight: 600,
                    color: '#0F172A',
                  }}
                >
                  {option.label}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {isOtherSelected ? (
        <TextField
          value={booking.appointment.otherDetails}
          onChange={(e) => setAppointment({ otherDetails: e.target.value })}
          label="Please specify"
          placeholder="e.g., ENT appointment, MRI follow-up, etc."
          fullWidth
          size="small"
        />
      ) : null}
    </Box>
  );
}
