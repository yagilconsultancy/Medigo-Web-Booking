import { BookingSuccessPage } from '@/ui/pages';
import { Suspense } from 'react';

export default function BookingSuccess() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingSuccessPage />
    </Suspense>
  );
}
