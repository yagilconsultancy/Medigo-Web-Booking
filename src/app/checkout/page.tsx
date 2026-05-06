import { Suspense } from 'react';
import { CheckoutPage } from '@/ui/pages';

export default function Checkout() {
  return (
    <Suspense>
      <CheckoutPage />
    </Suspense>
  );
}
