'use client';

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import {
  Box,
  Divider,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { pxToRem, useGetRideDetail } from '@/common';
import { AppButton } from '@/ui/modules/components';

function CheckoutForm({ rideId }: { rideId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!stripe || !elements) return;

    setIsLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/booking-success?ride_id=${encodeURIComponent(rideId)}`,
      },
    });

    if (error) {
      setErrorMessage(error.message ?? 'Payment failed');
    }
    setIsLoading(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: pxToRem(16) }}
    >
      <PaymentElement />
      {errorMessage ? (
        <Typography sx={{ fontSize: pxToRem(12), color: '#EF4444' }}>
          {errorMessage}
        </Typography>
      ) : null}
      <AppButton
        type="submit"
        variant="contained"
        isLoading={isLoading}
        disabled={!stripe || !elements}
      >
        Pay now
      </AppButton>
    </Box>
  );
}

export function CheckoutPage() {
  const searchParams = useSearchParams();
  const clientSecret = searchParams.get('client_secret') ?? '';
  const publishableKeyFromBackend = searchParams.get('pk') ?? '';
  const rideId = searchParams.get('ride_id') ?? '';

  const { data: rideResponse, isLoading } = useGetRideDetail(
    rideId || undefined
  );
  const rideDetail = rideResponse?.success ? rideResponse.data : null;

  const stripePromise = useMemo(() => {
    const key =
      publishableKeyFromBackend ||
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
      '';
    return key ? loadStripe(key) : Promise.resolve(null);
  }, [publishableKeyFromBackend]);

  if (
    !publishableKeyFromBackend &&
    !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ) {
    return (
      <Box sx={{ p: pxToRem(24) }}>
        <Typography sx={{ fontSize: pxToRem(14), color: '#EF4444' }}>
          Missing public key.
        </Typography>
      </Box>
    );
  }

  if (!clientSecret) {
    return (
      <Box sx={{ p: pxToRem(24) }}>
        <Typography sx={{ fontSize: pxToRem(14), color: '#EF4444' }}>
          Please start checkout from the booking flow.
        </Typography>
      </Box>
    );
  }

  if (!rideId) {
    return (
      <Box sx={{ p: pxToRem(24) }}>
        <Typography sx={{ fontSize: pxToRem(14), color: '#EF4444' }}>
          Missing ride information.
        </Typography>
      </Box>
    );
  }

  const passengerName = rideDetail
    ? `${rideDetail.passenger_first_name ?? ''} ${rideDetail.passenger_last_name ?? ''}`.trim()
    : '';
  const pickupAddress = rideDetail?.pickup_address ?? '';
  const dropoffAddress = rideDetail?.destination_address ?? '';
  const estimatedFare = rideDetail?.estimated_fare
    ? `CAD ${rideDetail.estimated_fare.toFixed(2)}`
    : 'CAD 0.00';
  const estimatedDistance = rideDetail?.estimated_distance_miles
    ? `${rideDetail.estimated_distance_miles.toFixed(1)} mi`
    : '-';

  return (
    <Box
      sx={{
        bgcolor: '#F8FAFC',
        minHeight: '100vh',
        px: { xs: pxToRem(16), md: pxToRem(40) },
        py: pxToRem(28),
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: pxToRem(560),
          mx: 'auto',
          borderRadius: pxToRem(12),
          border: '1px solid #E2E8F0',
          bgcolor: '#FFFFFF',
          p: { xs: pxToRem(16), md: pxToRem(24) },
        }}
      >
        <Typography
          sx={{ fontSize: pxToRem(20), fontWeight: 700, color: '#0F172A' }}
        >
          Complete Payment
        </Typography>
        <Typography
          sx={{ mt: pxToRem(4), fontSize: pxToRem(13), color: '#64748B' }}
        >
          Review your booking details and complete payment securely.
        </Typography>

        {/* Booking Details Summary */}
        {isLoading ? (
          <Box sx={{ mt: pxToRem(20) }}>
            <Skeleton
              variant="rectangular"
              height={pxToRem(120)}
              sx={{ borderRadius: pxToRem(8) }}
            />
          </Box>
        ) : rideDetail ? (
          <Box
            sx={{
              mt: pxToRem(20),
              p: pxToRem(16),
              bgcolor: '#F8FAFC',
              borderRadius: pxToRem(8),
              border: '1px solid #E2E8F0',
            }}
          >
            <Typography
              sx={{
                fontSize: pxToRem(13),
                fontWeight: 600,
                color: '#0F172A',
                mb: pxToRem(12),
              }}
            >
              Booking Details
            </Typography>

            <Stack spacing={pxToRem(10)}>
              {/* Passenger Name */}
              {passengerName && (
                <Box>
                  <Typography
                    sx={{
                      fontSize: pxToRem(11),
                      fontWeight: 500,
                      color: '#64748B',
                      mb: pxToRem(2),
                    }}
                  >
                    Passenger
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: pxToRem(13),
                      fontWeight: 500,
                      color: '#0F172A',
                    }}
                  >
                    {passengerName}
                  </Typography>
                </Box>
              )}

              {/* Pickup Address */}
              {pickupAddress && (
                <Box>
                  <Typography
                    sx={{
                      fontSize: pxToRem(11),
                      fontWeight: 500,
                      color: '#64748B',
                      mb: pxToRem(2),
                    }}
                  >
                    Pickup Location
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: pxToRem(13),
                      fontWeight: 400,
                      color: '#0F172A',
                    }}
                  >
                    {pickupAddress}
                  </Typography>
                </Box>
              )}

              {/* Dropoff Address */}
              {dropoffAddress && (
                <Box>
                  <Typography
                    sx={{
                      fontSize: pxToRem(11),
                      fontWeight: 500,
                      color: '#64748B',
                      mb: pxToRem(2),
                    }}
                  >
                    Dropoff Location
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: pxToRem(13),
                      fontWeight: 400,
                      color: '#0F172A',
                    }}
                  >
                    {dropoffAddress}
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: pxToRem(4) }} />

              {/* Distance and Fare */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: pxToRem(11),
                      fontWeight: 500,
                      color: '#64748B',
                      mb: pxToRem(2),
                    }}
                  >
                    Estimated Distance
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: pxToRem(13),
                      fontWeight: 500,
                      color: '#0F172A',
                    }}
                  >
                    {estimatedDistance}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'right' }}>
                  <Typography
                    sx={{
                      fontSize: pxToRem(11),
                      fontWeight: 500,
                      color: '#64748B',
                      mb: pxToRem(2),
                    }}
                  >
                    Total Amount
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: pxToRem(18),
                      fontWeight: 700,
                      color: '#007AFF',
                    }}
                  >
                    {estimatedFare}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Box>
        ) : null}

        <Box sx={{ mt: pxToRem(20) }}>
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm rideId={rideId} />
          </Elements>
        </Box>
      </Paper>
    </Box>
  );
}
