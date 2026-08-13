import type { Metadata } from 'next';
import { Space_Grotesk, Space_Mono } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['300', '400', '500', '700'],
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-space-mono',
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Signal — Stripe churn, classified and saved',
  description: 'A churn agent that classifies cancel reasons and silent renewers, drafts the save, and enrolls the playbook in your Resend — after you approve.',
  openGraph: {
    title: 'Signal — Stripe churn, classified and saved',
    description: 'A churn agent that classifies cancel reasons and silent renewers, drafts the save, and enrolls the playbook in your Resend — after you approve.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${spaceMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Doto:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
