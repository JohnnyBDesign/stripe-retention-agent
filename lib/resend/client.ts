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

const REASON_TO_TAG: Record<ChurnReason, string> = {
  price: 'ret_price',
  bug: 'ret_bug',
  missing_feature: 'ret_missing_feature',
  competitor: 'ret_competitor',
  never_activated: 'ret_never_activated',
  silent_rescue: 'ret_silent_rescue',
  payment_failed: 'ret_payment_failed',
  other: 'ret_other',
};

export async function enrollInResend(email: string, reason: ChurnReason): Promise<string> {
  const client = getResendClient();
  const tag = REASON_TO_TAG[reason];
  
  try {
    const contact = await client.contacts.create({
      email,
      audienceId: process.env.RESEND_AUDIENCE_ID!,
      unsubscribed: false,
    });

    const contactId = contact.data?.id;
    if (!contactId) {
      throw new Error('Failed to create contact');
    }

    return contactId;
  } catch (error: any) {
    if (error.message?.includes('already exists')) {
      const contacts = await client.contacts.list({
        audienceId: process.env.RESEND_AUDIENCE_ID!,
      });
      
      const existingContact = contacts.data?.data?.find((c: any) => c.email === email);
      
      if (existingContact) {
        return existingContact.id;
      }
    }
    
    throw error;
  }
}

export function getTagForReason(reason: ChurnReason): string {
  return REASON_TO_TAG[reason];
}
