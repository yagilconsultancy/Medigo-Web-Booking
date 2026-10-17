import { Suspense } from 'react';
import { LoginGate } from '@/ui/pages/SigninPreviewPage/LoginGate';

export default function Login() {
  return (
    <Suspense>
      <LoginGate />
    </Suspense>
  );
}
