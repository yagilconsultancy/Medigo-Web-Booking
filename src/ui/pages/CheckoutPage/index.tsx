'use client';

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { Box, Paper, Typography } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { pxToRem } from '@/common';
import { AppButton } from '@/ui/modules/components';

function CheckoutForm() {
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
        return_url: `${window.location.origin}/booking?payment=success`,
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

  return (
    <Box
      sx={{
        bgcolor: '#F8FAFC',
        minHeight: '100vh',
        px: pxToRem(40),
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
          p: pxToRem(20),
        }}
      >
        <Typography
          sx={{ fontSize: pxToRem(20), fontWeight: 800, color: '#0F172A' }}
        >
          Checkout
        </Typography>
        <Typography
          sx={{ mt: pxToRem(4), fontSize: pxToRem(12), color: '#64748B' }}
        >
          Complete your payment securely with Stripe.
        </Typography>

        <Box sx={{ mt: pxToRem(16) }}>
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm />
          </Elements>
        </Box>
      </Paper>
    </Box>
  );
}
