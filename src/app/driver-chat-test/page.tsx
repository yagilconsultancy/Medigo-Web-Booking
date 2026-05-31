import { Suspense } from 'react';
import { DriverChatTestPage } from '@/ui/pages/DriverChatTestPage';

export default function DriverChatTest() {
  return (
    <Suspense fallback={null}>
      <DriverChatTestPage />
    </Suspense>
  );
}
