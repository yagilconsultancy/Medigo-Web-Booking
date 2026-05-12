'use client';

import { Box, Paper, Typography } from '@mui/material';
import { formatPrice, pxToRem } from '@/common';
import { useBooking } from '../../../common';

export type BookingSummaryProps = {
  activeStep: number;
  totalSteps: number;
  stepLabel: string;
};

export function BookingSummary({
  activeStep,
  totalSteps,
  stepLabel,
}: BookingSummaryProps) {
  const { booking } = useBooking();

  const serviceLabel =
    booking.service.type === 'transport'
      ? 'Transport Only'
      : booking.service.type === 'transport_assistant'
        ? 'Transport + Care Assistant'
        : null;

  const appointmentLabel =
    booking.appointment.type === 'Other'
      ? booking.appointment.otherDetails || 'Other'
      : booking.appointment.type;

  const vehicleLabel =
    booking.vehicle.type === 'standard'
      ? 'Medigo Standard'
      : booking.vehicle.type === 'wheelchair'
        ? 'Medigo Wheelchair'
        : booking.vehicle.type === 'stretcher'
          ? 'Medigo Stretcher'
          : null;

  const vehiclePrice = booking.vehicle.estimatedTotal;
  const vehicleCurrency = booking.vehicle.currency ?? 'CAD';

  const tripTypeLabel =
    booking.trip.type === 'one_way'
      ? 'One Way'
      : booking.trip.type === 'round_trip'
        ? 'Round Trip'
        : null;

  const recurringLabel = booking.trip.isRecurring
    ? booking.trip.recurringFrequency === 'daily'
      ? 'Daily'
      : booking.trip.recurringFrequency === 'weekly'
        ? 'Weekly'
        : booking.trip.recurringFrequency === 'bi_weekly'
          ? 'Bi-Weekly'
          : booking.trip.recurringFrequency === 'monthly'
            ? 'Monthly'
            : null
    : null;

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        borderRadius: pxToRem(12),
        border: '1px solid #E2E8F0',
        bgcolor: '#FFFFFF',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          px: pxToRem(18),
          py: pxToRem(14),
          bgcolor: '#EFF6FF',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        <Typography
          sx={{
            fontSize: pxToRem(10),
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: '#94A3B8',
          }}
        >
          BOOKING SUMMARY
        </Typography>
        <Typography
          sx={{
            mt: pxToRem(2),
            fontSize: pxToRem(12),
            fontWeight: 700,
            color: '#0F172A',
          }}
        >
          Step {activeStep + 1} of {totalSteps} —{' '}
          <Box component="span" sx={{ color: '#007AFF' }}>
            {stepLabel}
          </Box>
        </Typography>
      </Box>

      <Box
        sx={{
          px: pxToRem(18),
          py: pxToRem(14),
          display: 'flex',
          flexDirection: 'column',
          gap: pxToRem(14),
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: pxToRem(10),
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#94A3B8',
            }}
          >
            PATIENT
          </Typography>
          <Typography
            sx={{ fontSize: pxToRem(12), color: '#0F172A', mt: pxToRem(4) }}
          >
            {booking.patient.firstName || booking.patient.lastName
              ? `${booking.patient.firstName} ${booking.patient.lastName}`.trim()
              : '—'}
          </Typography>
        </Box>
        <Box>
          <Typography
            sx={{
              fontSize: pxToRem(10),
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#94A3B8',
            }}
          >
            PICKUP
          </Typography>
          <Typography
            sx={{
              fontSize: pxToRem(12),
              color: '#0F172A',
              mt: pxToRem(4),
              whiteSpace: 'pre-wrap',
            }}
          >
            {booking.address.pickupAddress || '—'}
          </Typography>
        </Box>
        <Box>
          <Typography
            sx={{
              fontSize: pxToRem(10),
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#94A3B8',
            }}
          >
            DROP-OFF
          </Typography>
          <Typography
            sx={{
              fontSize: pxToRem(12),
              color: '#0F172A',
              mt: pxToRem(4),
              whiteSpace: 'pre-wrap',
            }}
          >
            {booking.address.dropoffAddress || '—'}
          </Typography>
        </Box>

        {serviceLabel ? (
          <Box>
            <Typography
              sx={{
                fontSize: pxToRem(10),
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#94A3B8',
              }}
            >
              SERVICE
            </Typography>
            <Typography
              sx={{ fontSize: pxToRem(12), color: '#0F172A', mt: pxToRem(4) }}
            >
              {serviceLabel}
            </Typography>
          </Box>
        ) : null}

        {appointmentLabel ? (
          <Box>
            <Typography
              sx={{
                fontSize: pxToRem(10),
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#94A3B8',
              }}
            >
              APPOINTMENT
            </Typography>
            <Typography
              sx={{ fontSize: pxToRem(12), color: '#0F172A', mt: pxToRem(4) }}
            >
              {appointmentLabel}
            </Typography>
          </Box>
        ) : null}

        {vehicleLabel ? (
          <Box>
            <Typography
              sx={{
                fontSize: pxToRem(10),
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#94A3B8',
              }}
            >
              VEHICLE
            </Typography>
            <Typography
              sx={{ fontSize: pxToRem(12), color: '#0F172A', mt: pxToRem(4) }}
            >
              {vehicleLabel}
            </Typography>
            {booking.vehicle.promoCode ? (
              <Typography
                sx={{ fontSize: pxToRem(11), color: '#64748B', mt: pxToRem(4) }}
              >
                Promo: {booking.vehicle.promoCode}
              </Typography>
            ) : null}
          </Box>
        ) : null}

        {tripTypeLabel ? (
          <Box>
            <Typography
              sx={{
                fontSize: pxToRem(10),
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#94A3B8',
              }}
            >
              TRIP TYPE
            </Typography>
            <Typography
              sx={{ fontSize: pxToRem(12), color: '#0F172A', mt: pxToRem(4) }}
            >
              {tripTypeLabel}
            </Typography>
          </Box>
        ) : null}

        {recurringLabel ? (
          <Box>
            <Typography
              sx={{
                fontSize: pxToRem(10),
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#94A3B8',
              }}
            >
              RECURRING
            </Typography>
            <Typography
              sx={{ fontSize: pxToRem(12), color: '#0F172A', mt: pxToRem(4) }}
            >
              {recurringLabel}
            </Typography>
          </Box>
        ) : null}
      </Box>

      {activeStep >= 3 && vehiclePrice !== null ? (
        <Box
          sx={{
            px: pxToRem(18),
            py: pxToRem(14),
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: pxToRem(12),
          }}
        >
          <Box>
            <Typography
              sx={{ fontSize: pxToRem(11), fontWeight: 600, color: '#94A3B8' }}
            >
              Estimated total
            </Typography>
            <Typography
              sx={{ mt: pxToRem(4), fontSize: pxToRem(10), color: '#94A3B8' }}
            >
              + distance charge calculated at pickup
            </Typography>
          </Box>
          <Typography
            sx={{ fontSize: pxToRem(18), fontWeight: 800, color: '#2F6FED' }}
          >
            {formatPrice(vehiclePrice, vehicleCurrency)}
          </Typography>
        </Box>
      ) : null}
    </Paper>
  );
}
