import { AuthPage } from '@/ui/pages';
import { Suspense } from 'react';

export default function Auth() {
  return (
    <Suspense>
      <AuthPage />
    </Suspense>
  );
}
