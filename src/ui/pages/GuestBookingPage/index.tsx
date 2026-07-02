'use client';

import { Box, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AppButton,
  AppGoogleMapsProvider,
  BookingStepper,
} from '../../modules/components';
import { AppLayout } from '../../modules/partials';
import {
  getGuestSessionId,
  pxToRem,
  useAccountStore,
  usePaymentsApi,
  useRidesApi,
} from '../../../common';
import { BookingProvider, useBooking } from './common';
import {
  AddressStep,
  AppointmentStep,
  BookingSummary,
  ProfilePopOverComponent,
  ReviewStep,
  ServiceStep,
  TripStep,
  VehicleStep,
} from './ui/components';

import type { AccountType } from '../../../common/store/useAccountStore';

const steps = [
  { label: 'Address' },
  { label: 'Service' },
  { label: 'Appt.' },
  { label: 'Vehicle' },
  { label: 'Trip' },
  { label: 'Review' },
];

function GuestBookingFlowShell({ accountType }: { accountType: AccountType }) {
  const [activeStep, setActiveStep] = useState(0);
  const [isBookingRide, setIsBookingRide] = useState(false);
  const { booking } = useBooking();
  const router = useRouter();
  const { createGuestPaymentIntent } = usePaymentsApi();
  const { createGuestBooking } = useRidesApi();

  const stepTitle = steps[activeStep]?.label ?? '';

  const canContinue = useMemo(() => {
    if (activeStep === 0) {
      const pickupOk =
        booking.address.pickupCoordinates?.lat != null &&
        booking.address.pickupCoordinates?.lng != null;
      const dropoffOk =
        booking.address.dropoffCoordinates?.lat != null &&
        booking.address.dropoffCoordinates?.lng != null;

      return (
        booking.address.pickupAddress.trim().length > 0 &&
        booking.address.dropoffAddress.trim().length > 0 &&
        pickupOk &&
        dropoffOk &&
        booking.patient.firstName.trim().length > 0 &&
        booking.patient.lastName.trim().length > 0 &&
        booking.patient.phoneNumber.trim().length > 0
      );
    }

    if (activeStep === 1) {
      return booking.service.type !== null;
    }

    if (activeStep === 2) {
      return booking.appointment.type !== null;
    }

    if (activeStep === 3) {
      return booking.vehicle.type !== null && booking.vehicle.passengers >= 1;
    }

    if (activeStep === 4) {
      const baseValid =
        booking.trip.type !== null &&
        booking.trip.pickupDate.trim().length > 0 &&
        booking.trip.pickupTime.trim().length > 0;

      if (!baseValid) return false;

      // Pickup must not be in the past.
      const scheduled = new Date(
        `${booking.trip.pickupDate}T${booking.trip.pickupTime}`
      );
      if (
        Number.isNaN(scheduled.getTime()) ||
        scheduled.getTime() < Date.now()
      ) {
        return false;
      }

      if (!booking.trip.isRecurring) return true;

      if (!booking.trip.recurringFrequency) return false;

      // Days of week required for daily, weekly, bi_weekly
      if (booking.trip.recurringFrequency !== 'monthly') {
        if (booking.trip.recurringDaysOfWeek.length === 0) return false;
      }

      if (booking.trip.recurringEnds === 'by_date') {
        return booking.trip.recurringEndDate.trim().length > 0;
      }

      return (booking.trip.recurringRideCount ?? 0) > 0;
    }

    if (activeStep === 5) return true;

    return false;
  }, [activeStep, booking]);

  const handleBack = () => setActiveStep((s) => Math.max(0, s - 1));
  const handleContinue = async () => {
    if (!canContinue) return;

    if (activeStep === steps.length - 1) {
      setIsBookingRide(true);
      const sessionId = getGuestSessionId();

      if (!sessionId) {
        setIsBookingRide(false);
        router.push('/guest/login');
        return;
      }

      // Build the scheduled_at ISO string from date + time
      const scheduledAt =
        booking.trip.pickupDate && booking.trip.pickupTime
          ? new Date(
              `${booking.trip.pickupDate}T${booking.trip.pickupTime}`
            ).toISOString()
          : new Date().toISOString();

      const ridePayload: Record<string, any> = {
        ride_type: booking.vehicle.type ?? 'ambulatory',
        trip_type:
          booking.service.type === 'transport_assistant'
            ? 'transport_care_assistant'
            : 'transport_only',
        trip_structure: booking.trip.type ?? 'one_way',
        pickup_address: booking.address.pickupAddress,
        pickup_latitude: booking.address.pickupCoordinates?.lat,
        pickup_longitude: booking.address.pickupCoordinates?.lng,
        destination_address: booking.address.dropoffAddress,
        destination_latitude: booking.address.dropoffCoordinates?.lat,
        destination_longitude: booking.address.dropoffCoordinates?.lng,
        scheduled_at: scheduledAt,
        appointment_time: scheduledAt,
        passenger_first_name: booking.patient.firstName,
        passenger_last_name: booking.patient.lastName,
        passenger_phone: `${booking.patient.countryCode}${booking.patient.phoneNumber}`,
        visit_type: booking.appointment.type,
        facility_name: booking.appointment.otherDetails || undefined,
        special_instructions: booking.trip.notes || undefined,
        estimated_fare: booking.vehicle.estimatedTotal ?? undefined,
        use_highway_407: false,
        is_dialysis_trip: false,
        booking_channel: 'web_app',
        session_id: sessionId,
      };

      // Add recurring fields only if recurring
      if (booking.trip.isRecurring && booking.trip.recurringFrequency) {
        ridePayload.recurring_frequency = booking.trip.recurringFrequency;
        ridePayload.recurring_days_of_week = booking.trip.recurringDaysOfWeek;
        if (booking.trip.recurringEndDate) {
          ridePayload.recurring_end_date = booking.trip.recurringEndDate;
        }
      }

      // Remove any keys with null/undefined values
      Object.keys(ridePayload).forEach((key) => {
        if (ridePayload[key] == null) {
          delete ridePayload[key];
        }
      });

      const guestBookingResult = await createGuestBooking(ridePayload as any);
      const rideResult = guestBookingResult?.booking?.ride;

      if (!rideResult) {
        setIsBookingRide(false);
        return;
      }

      // Ride created successfully — now proceed to payment
      const amount = rideResult.estimated_fare ?? 0; // dollars; backend converts to cents for Stripe
      const currency =
        booking.vehicle.currency || booking.service.currency || 'CAD';

      const paymentResult = await createGuestPaymentIntent({
        session_id: sessionId,
        amount,
        currency,
        description: booking.trip.notes || 'MediGo booking payment',
        order_id: rideResult.id,
        metadata: {
          account_type: accountType,
          service_type: booking.service.type ?? '',
          appointment_type: booking.appointment.type ?? '',
          vehicle_type: booking.vehicle.type ?? '',
          trip_type: booking.trip.type ?? '',
        },
      });

      setIsBookingRide(false);

      if (paymentResult) {
        router.push(
          `/guest/checkout?ride_id=${encodeURIComponent(rideResult.id)}&client_secret=${encodeURIComponent(
            paymentResult.payment_intent
          )}&pk=${encodeURIComponent(paymentResult.publishable_key)}`
        );
      }

      return;
    }

    setActiveStep((s) => Math.min(steps.length - 1, s + 1));
  };

  return (
    <AppLayout
      headerProps={{
        showRightContent: true,
        rightContent: <ProfilePopOverComponent />,
      }}
    >
      <Box sx={{ bgcolor: '#F8FAFC', height: '100vh', overflow: 'hidden' }}>
        <Box
          sx={{
            position: 'fixed',
            top: pxToRem(64),
            left: 0,
            right: 0,
            zIndex: 1100,
            bgcolor: '#FFFFFF',
            borderBottom: '0.667px solid rgba(0,0,0,0.05)',
            px: pxToRem(40),
            pt: pxToRem(20),
            pb: pxToRem(16),
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: pxToRem(14),
            }}
          >
            <Typography
              sx={{
                fontSize: pxToRem(11),
                fontWeight: 700,
                color: '#007AFF',
                letterSpacing: '0.07em',
              }}
            >
              STEP {activeStep + 1} OF {steps.length}
            </Typography>
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: pxToRem(12) }}
            >
              <Typography
                sx={{
                  fontSize: pxToRem(12),
                  fontWeight: 400,
                  color: '#94A3B8',
                }}
              >
                {stepTitle}
              </Typography>
              {/* <ProfilePopOverComponent /> */}
            </Box>
          </Box>
          <BookingStepper activeStep={activeStep} steps={steps} />
        </Box>

        <Box
          sx={{
            mt: pxToRem(127),
            height: `calc(100vh - 64px - 127px - 72px)`,
            overflowY: 'auto',
          }}
        >
          <Box
            sx={{
              // maxWidth: pxToRem(1360),
              mx: 'auto',
              px: pxToRem(40),
              pt: pxToRem(28),
              pb: pxToRem(28),
            }}
          >
            <Grid container spacing={3} alignItems="flex-start">
              <Grid size={{ xs: 12, md: 8 }}>
                {activeStep === 0 ? (
                  <AddressStep accountType={accountType} />
                ) : activeStep === 1 ? (
                  <ServiceStep accountType={accountType} />
                ) : activeStep === 2 ? (
                  <AppointmentStep accountType={accountType} />
                ) : activeStep === 3 ? (
                  <VehicleStep accountType={accountType} />
                ) : activeStep === 4 ? (
                  <TripStep accountType={accountType} />
                ) : activeStep === 5 ? (
                  <ReviewStep
                    accountType={accountType}
                    onEditStep={(stepIndex) => setActiveStep(stepIndex)}
                  />
                ) : (
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: pxToRem(12),
                      border: '1px solid #E2E8F0',
                      bgcolor: '#FFFFFF',
                      p: pxToRem(24),
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: pxToRem(16),
                        fontWeight: 700,
                        color: '#0F172A',
                      }}
                    >
                      Step {activeStep + 1}: {stepTitle}
                    </Typography>
                    <Typography
                      sx={{
                        mt: pxToRem(6),
                        fontSize: pxToRem(14),
                        color: '#64748B',
                      }}
                    >
                      This step is a placeholder — we can build it next using
                      the same pattern.
                    </Typography>
                  </Paper>
                )}
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <BookingSummary
                  activeStep={activeStep}
                  totalSteps={steps.length}
                  stepLabel={stepTitle || 'Address'}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Box
          sx={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: '#FFFFFF',
            borderTop: '0.667px solid rgba(0,0,0,0.14)',
            px: pxToRem(40),
            height: pxToRem(72),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 1200,
          }}
        >
          <AppButton
            variant="outlined"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{
              height: pxToRem(40),
              width: pxToRem(92),
              borderRadius: pxToRem(14),
              border: '0.667px solid #E2E8F0',
              color: '#4A5565',
              '&:disabled': { opacity: 0.4 },
            }}
          >
            Back
          </AppButton>

          <AppButton
            variant="contained"
            disabled={!canContinue}
            onClick={handleContinue}
            isLoading={activeStep === steps.length - 1 ? isBookingRide : false}
            sx={{
              height: pxToRem(40),
              minWidth:
                activeStep === steps.length - 1 ? pxToRem(212) : pxToRem(143),
              borderRadius: pxToRem(14),
              bgcolor: canContinue ? '#2F6FED' : '#E2E8F0',
              color: canContinue ? '#FFFFFF' : '#94A3B8',
              '&:hover': { bgcolor: canContinue ? '#2F6FED' : '#E2E8F0' },
              '&:disabled': {
                bgcolor: '#E2E8F0',
                color: '#94A3B8',
                opacity: 1,
              },
            }}
          >
            {activeStep === steps.length - 1 ? 'Book a Ride' : 'Continue'}
          </AppButton>
        </Box>
      </Box>
    </AppLayout>
  );
}

export function GuestBookingPage() {
  const { accountType } = useAccountStore();
  const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

  const content = (
    <BookingProvider>
      <GuestBookingFlowShell accountType={accountType} />
    </BookingProvider>
  );

  if (!googleApiKey) return content;

  return (
    <AppGoogleMapsProvider apiKey={googleApiKey}>
      {content}
    </AppGoogleMapsProvider>
  );
}
