import type { Metadata } from 'next';
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument-sans',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  weight: ['400'],
  display: 'swap',
  style: ['normal', 'italic'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500', '600'],
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
    <html lang="en" className={`${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
