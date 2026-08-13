import type { Metadata } from 'next';
import { Inter, Almarai } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';

// Using Inter as a stand-in for Geist (very similar sans-serif)
const geist = Inter({
  subsets: ['latin'],
  variable: '--font-geist',
  weight: ['400', '500', '600'],
  display: 'swap',
});

const almarai = Almarai({
  subsets: ['arabic'],
  variable: '--font-almarai',
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Signal — Stripe churn, classified and saved',
  description: 'You approve. Signal sends. Replies go to you. $99 includes email. Connect Stripe, not an ESP.',
  openGraph: {
    title: 'Signal — Stripe churn, classified and saved',
    description: 'You approve. Signal sends. Replies go to you. $99 includes email. Connect Stripe, not an ESP.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} ${almarai.variable}`}>
      <body>{children}</body>
    </html>
  );
}
