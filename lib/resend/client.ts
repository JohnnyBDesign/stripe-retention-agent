import { Resend } from 'resend';
import { ChurnReason } from '@/lib/types';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set');
}

const resend = new Resend(process.env.RESEND_API_KEY);

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
  const tag = REASON_TO_TAG[reason];
  
  try {
    let contact = await resend.contacts.create({
      email,
      audienceId: process.env.RESEND_AUDIENCE_ID!,
    });

    const contactId = contact.data?.id;
    if (!contactId) {
      throw new Error('Failed to create contact');
    }

    await resend.contacts.update({
      id: contactId,
      audienceId: process.env.RESEND_AUDIENCE_ID!,
      tags: [tag],
    });

    return contactId;
  } catch (error: any) {
    if (error.message?.includes('already exists')) {
      const contacts = await resend.contacts.list({
        audienceId: process.env.RESEND_AUDIENCE_ID!,
      });
      
      const existingContact = contacts.data?.data?.find((c: any) => c.email === email);
      
      if (existingContact) {
        const existingTags = existingContact.tags || [];
        await resend.contacts.update({
          id: existingContact.id,
          audienceId: process.env.RESEND_AUDIENCE_ID!,
          tags: [...existingTags, tag],
        });
        
        return existingContact.id;
      }
    }
    
    throw error;
  }
}

export function getTagForReason(reason: ChurnReason): string {
  return REASON_TO_TAG[reason];
}
