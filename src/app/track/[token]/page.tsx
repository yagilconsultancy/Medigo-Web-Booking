import { TrackSharedRidePage } from '@/ui/pages';

export default async function TrackSharedRide({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <TrackSharedRidePage token={token} />;
}
