import type { Metadata } from 'next';
import { ReactNode } from 'react';

/**
 * This is the account-deletion URL published on the MediGo Google Play
 * listing, so it has to be reachable and current for anyone, at any time,
 * without the app or a login.
 *
 * force-dynamic matters here: a client-only App Router page gets statically
 * prerendered with `Cache-Control: s-maxage=31536000`, which leaves browsers
 * holding a year-old copy of the HTML pointing at JS chunks that no longer
 * exist. That is exactly how the BackOffice reactivation page broke. Serving
 * this one non-cacheable means a redeploy reaches users immediately.
 */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Delete Your MediGo Account | MediGo',
  description:
    'Request permanent deletion of your MediGo account and associated personal data. Verify your request by email — no app or login required.',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://web.getmedigo.com/medigo-delete-account',
  },
};

export default function MedigoDeleteAccountLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <>{children}</>;
}
