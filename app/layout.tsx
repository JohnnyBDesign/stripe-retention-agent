import type { Metadata } from 'next';
import { Fraunces, DM_Sans } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AfterWhy — Stripe churn, classified and saved',
  description: 'A churn agent that classifies price, bugs, competitors, never-activated, and silent renewers—then enrolls the playbook in your Resend. Human approves every draft.',
  openGraph: {
    title: 'AfterWhy — Stripe churn, classified and saved',
    description: 'A churn agent that classifies price, bugs, competitors, never-activated, and silent renewers—then enrolls the playbook in your Resend. Human approves every draft.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
