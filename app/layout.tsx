import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Retention — Stripe churn, classified and saved',
  description: 'A churn agent that classifies price, bugs, competitors, never-activated, and silent renewers—then enrolls the playbook in YOUR Resend. Human approves every draft.',
  openGraph: {
    title: 'Retention — Stripe churn, classified and saved',
    description: 'A churn agent that classifies price, bugs, competitors, never-activated, and silent renewers—then enrolls the playbook in YOUR Resend. Human approves every draft.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
