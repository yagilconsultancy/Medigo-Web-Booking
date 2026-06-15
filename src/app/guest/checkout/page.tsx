import { GuestCheckoutPage } from '@/ui/pages';
import { Suspense } from 'react';

export default function GuestCheckout() {
  return (
    <Suspense>
      <GuestCheckoutPage />
    </Suspense>
  );
}
