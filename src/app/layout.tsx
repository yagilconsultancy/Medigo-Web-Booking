import type { Metadata } from 'next';
import './globals.css';
import { ReactNode } from 'react';
import { Header } from './header';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'MediGo | On-Demand Healthcare Transportation',
  description:
    'MediGo connects patients with verified medical drivers for safe and reliable rides to hospitals, clinics, and care facilities. Book healthcare transportation instantly or schedule medical trips with real-time tracking.',
  keywords:
    'medical transportation, healthcare ride service, non emergency medical transport, hospital ride booking, patient transportation, medical ride app',
  icons: {
    icon: [
      { url: '/favicon.svg', sizes: 'any' },
      // { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      // { url: "/favicon-32x32.png", sizes: "32x32", type: "32x32", type: "image/png" },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'MediGo | Healthcare Rides When You Need Them',
    description:
      'Book safe, reliable transportation to hospitals, clinics, and care facilities. MediGo provides on-demand and scheduled healthcare rides with trusted drivers.',
    images: [
      {
        url: 'https://medigo.app/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MediGo | Healthcare Transportation Platform',
    description:
      'On-demand medical rides for patients and caregivers. Safe, reliable transport to hospitals and clinics.',
    images: ['https://medigo.app/twitter-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <Header />
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
