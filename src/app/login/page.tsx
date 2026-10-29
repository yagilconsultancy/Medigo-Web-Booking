import { LoginPage } from '@/ui/pages';
import { Suspense } from 'react';

export default function Login() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  );
}
