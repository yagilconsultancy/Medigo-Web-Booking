import { Suspense } from 'react';
import { LiveTrackPage } from '../../ui/pages';

export default function LiveTrack() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LiveTrackPage />
    </Suspense>
  );
}
