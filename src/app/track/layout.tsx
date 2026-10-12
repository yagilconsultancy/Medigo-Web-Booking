import type { Metadata } from 'next';
import { ReactNode } from 'react';

/**
 * Family members open this page from a link a rider shared. It needs no
 * login. The link itself is the secret, so the page must never be indexed,
 * must not leak the link in a Referer header, and must never be cached.
 */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Follow a MediGo trip',
  description: 'Read-only view of a MediGo trip shared with you.',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

export default function TrackLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <>{children}</>;
}
