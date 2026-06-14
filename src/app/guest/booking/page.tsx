import { GuestBookingPage } from '@/ui/pages';
import { Suspense } from 'react';

export default function GuestBooking() {
  return (
    <Suspense>
      <GuestBookingPage />
    </Suspense>
  );
}
