import { BookingPage } from '@/ui/pages';
import { Suspense } from 'react';

export default function Booking() {
  return (
    <Suspense>
      <BookingPage />
    </Suspense>
  );
}
