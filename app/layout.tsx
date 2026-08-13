import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const geist = Inter({
  subsets: ['latin'],
  variable: '--font-geist',
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
    <html lang="en" className={geist.variable}>
      <body className="font-sans antialiased bg-canvas text-ink">{children}</body>
    </html>
  );
}
