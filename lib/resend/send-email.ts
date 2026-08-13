import { Resend } from 'resend';
import { ChurnReason } from '@/lib/types';

let resend: Resend | null = null;

function getResendClient(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not set');
  }
  
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  
  return resend;
}

export interface SendRetentionEmailParams {
  to: string;
  subject: string;
  body: string;
  founderEmail?: string;
}

/**
 * Sends a retention email using Signal's Resend account.
 * Sets Reply-To to the founder's email if provided.
 */
export async function sendRetentionEmail(params: SendRetentionEmailParams): Promise<string> {
  const client = getResendClient();
  
  const { to, subject, body, founderEmail } = params;
  
  // Default from address - Signal's domain
  const from = process.env.RESEND_FROM_EMAIL || 'Signal <onboarding@resend.dev>';
  
  const emailParams: any = {
    from,
    to,
    subject,
    html: body,
  };
  
  // Set Reply-To to founder email if provided
  if (founderEmail) {
    emailParams.reply_to = founderEmail;
  }
  
  const result = await client.emails.send(emailParams);
  
  if (!result.data?.id) {
    throw new Error('Failed to send email: no email ID returned');
  }
  
  return result.data.id;
}

/**
 * Returns whether this reason should trigger an email send.
 * payment_failed and other are display-only.
 */
export function shouldSendForReason(reason: ChurnReason): boolean {
  return reason !== 'payment_failed' && reason !== 'other';
}
