import { GuestBookingSuccessPage } from '@/ui/pages';
import { Suspense } from 'react';

export default function GuestBookingSuccess() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GuestBookingSuccessPage />
    </Suspense>
  );
}
