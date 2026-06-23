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
import { useEffect, useMemo, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { pxToRem, useGetRideDetail } from '@/common';
import { AppButton } from '@/ui/modules/components';

type PaymentInfo = {
  amount: number;
  currency: string;
  description: string | null;
};

type RideInfo = {
  passengerName: string;
  pickupAddress: string;
  dropoffAddress: string;
  estimatedDistance: string;
};

function CheckoutForm({
  rideId,
  rideInfo,
  isLoadingRide,
}: {
  rideId: string;
  rideInfo: RideInfo | null;
  isLoadingRide: boolean;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [isFetchingPaymentInfo, setIsFetchingPaymentInfo] = useState(true);

  useEffect(() => {
    if (!stripe) return;

    const clientSecret = new URLSearchParams(window.location.search).get(
      'client_secret'
    );
    if (!clientSecret) {
      setIsFetchingPaymentInfo(false);
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (paymentIntent) {
        setPaymentInfo({
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          description: paymentIntent.description ?? null,
        });
      }
      setIsFetchingPaymentInfo(false);
    });
  }, [stripe]);

  const formattedAmount = paymentInfo
    ? `${paymentInfo.currency.toUpperCase()} ${(paymentInfo.amount / 100).toFixed(2)}`
    : null;

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

  const isDetailLoading = isLoadingRide || isFetchingPaymentInfo;

  return (
    <Stack spacing={pxToRem(20)}>
      {/* Booking & Payment Summary */}
      {isDetailLoading ? (
        <Skeleton
          variant="rectangular"
          height={pxToRem(160)}
          sx={{ borderRadius: pxToRem(8) }}
        />
      ) : rideInfo || paymentInfo ? (
        <Box
          sx={{
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
            {rideInfo?.passengerName && (
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
                  {rideInfo.passengerName}
                </Typography>
              </Box>
            )}

            {rideInfo?.pickupAddress && (
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
                  {rideInfo.pickupAddress}
                </Typography>
              </Box>
            )}

            {rideInfo?.dropoffAddress && (
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
                  {rideInfo.dropoffAddress}
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: pxToRem(4) }} />

            {/* Distance and Amount */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {rideInfo?.estimatedDistance && (
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
                    {rideInfo.estimatedDistance}
                  </Typography>
                </Box>
              )}

              {formattedAmount && (
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
                    {formattedAmount}
                  </Typography>
                </Box>
              )}
            </Box>
          </Stack>
        </Box>
      ) : null}

      {/* Payment Form */}
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
          {formattedAmount ? `Pay ${formattedAmount}` : 'Pay now'}
        </AppButton>
      </Box>
    </Stack>
  );
}

export function CheckoutPage() {
  const searchParams = useSearchParams();
  const clientSecret = searchParams.get('client_secret') ?? '';
  const publishableKeyFromBackend = searchParams.get('pk') ?? '';
  const rideId = searchParams.get('ride_id') ?? '';

  const { data: rideResponse, isLoading: isLoadingRide } = useGetRideDetail(
    rideId || undefined
  );
  const rideDetail = rideResponse?.success ? rideResponse.data : null;

  const rideInfo: RideInfo | null = rideDetail
    ? {
        passengerName:
          `${rideDetail.passenger_first_name ?? ''} ${rideDetail.passenger_last_name ?? ''}`.trim(),
        pickupAddress: rideDetail.pickup_address ?? '',
        dropoffAddress: rideDetail.destination_address ?? '',
        // @ts-ignore
        estimatedDistance: rideDetail?.fare_estimate_details?.distance_km
          ? // @ts-ignore
            `${rideDetail.fare_estimate_details.distance_km.toFixed(2)} km`
          : '',
      }
    : null;

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

        <Box sx={{ mt: pxToRem(20) }}>
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm
              rideId={rideId}
              rideInfo={rideInfo}
              isLoadingRide={isLoadingRide}
            />
          </Elements>
        </Box>
      </Paper>
    </Box>
  );
}
