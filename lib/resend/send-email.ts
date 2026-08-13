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
  replyTo: string;
}

/**
 * Sends a retention email using Signal's Resend account.
 * Sets Reply-To to the provided address (founder/workspace, never the customer).
 */
export async function sendRetentionEmail(params: SendRetentionEmailParams): Promise<string> {
  const client = getResendClient();
  
  const { to, subject, body, replyTo } = params;
  
  // Default from address - Signal's domain
  const from = process.env.RESEND_FROM_EMAIL || 'Signal <onboarding@resend.dev>';
  
  const emailParams: any = {
    from,
    to,
    subject,
    html: body,
    reply_to: replyTo,
  };
  
  const result = await client.emails.send(emailParams);
  
  if (!result.data?.id) {
    throw new Error('Failed to send email: no email ID returned');
  }
  
  return result.data.id;
}

/**
 * Gets the Reply-To address for retention emails.
 * Priority: 1) FOUNDER_REPLY_TO (required for v0)
 *          2) Future: workspace/onboard replyTo
 *          3) Future: Stripe connected-account email
 * NEVER returns the customer email.
 */
export function getReplyToAddress(): string {
  const founderReplyTo = process.env.FOUNDER_REPLY_TO;
  
  if (!founderReplyTo) {
    throw new Error('FOUNDER_REPLY_TO is required to send retention emails');
  }
  
  return founderReplyTo;
}

/**
 * Returns whether this reason should trigger an email send.
 * ONLY payment_failed is display-only. If HITL approves other, send.
 */
export function shouldSendForReason(reason: ChurnReason): boolean {
  return reason !== 'payment_failed';
}
