import { Resend } from 'resend';
import { ChurnReason } from '@/lib/types';

let resend: Resend | null = null;
const segmentCache = new Map<string, string>();

function getResendClient(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not set');
  }
  
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  
  return resend;
}

const REASON_TO_SEGMENT: Record<ChurnReason, string> = {
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
  const segmentName = REASON_TO_SEGMENT[reason];
  
  const contactId = await getOrCreateContact(email);
  const segmentId = await ensureSegmentExists(segmentName);
  await addContactToSegment(contactId, segmentId);
  
  return contactId;
}

async function getOrCreateContact(email: string): Promise<string> {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    throw new Error('RESEND_API_KEY not set');
  }

  const response = await fetch('https://api.resend.com/contacts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      unsubscribed: false,
    }),
  });

  if (response.ok) {
    const result = await response.json();
    const contactId = result.data?.id || result.id;
    
    if (!contactId) {
      throw new Error('Failed to get contact ID from creation response');
    }
    
    return contactId;
  }

  const errorText = await response.text();
  if (errorText.includes('already exists') || errorText.includes('Contact already exists')) {
    return await getContactByEmail(email);
  }
  
  throw new Error(`Failed to create contact: ${errorText}`);
}

async function getContactByEmail(email: string): Promise<string> {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    throw new Error('RESEND_API_KEY not set');
  }

  const response = await fetch(`https://api.resend.com/contacts?email=${encodeURIComponent(email)}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get contact by email: ${error}`);
  }

  const result = await response.json();
  const contactId = result.data?.[0]?.id;
  
  if (!contactId) {
    throw new Error(`Contact with email ${email} not found`);
  }
  
  return contactId;
}

async function ensureSegmentExists(segmentName: string): Promise<string> {
  if (segmentCache.has(segmentName)) {
    return segmentCache.get(segmentName)!;
  }

  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    throw new Error('RESEND_API_KEY not set');
  }

  const listResponse = await fetch('https://api.resend.com/segments', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!listResponse.ok) {
    const error = await listResponse.text();
    throw new Error(`Failed to list segments: ${error}`);
  }

  const segments = await listResponse.json();
  const existingSegment = segments.data?.find((s: any) => s.name === segmentName);
  
  if (existingSegment) {
    segmentCache.set(segmentName, existingSegment.id);
    return existingSegment.id;
  }

  const createResponse = await fetch('https://api.resend.com/segments', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: segmentName }),
  });

  if (!createResponse.ok) {
    const error = await createResponse.text();
    throw new Error(`Failed to create segment: ${error}`);
  }

  const newSegment = await createResponse.json();
  const segmentId = newSegment.data?.id || newSegment.id;
  
  if (!segmentId) {
    throw new Error('Failed to get segment ID from creation response');
  }
  
  segmentCache.set(segmentName, segmentId);
  return segmentId;
}

async function addContactToSegment(contactId: string, segmentId: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    throw new Error('RESEND_API_KEY not set');
  }

  const response = await fetch(`https://api.resend.com/contacts/${contactId}/segments/${segmentId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    if (!error.includes('already exists') && !error.includes('already in segment')) {
      throw new Error(`Failed to add contact to segment: ${error}`);
    }
  }
}

export function getTagForReason(reason: ChurnReason): string {
  return REASON_TO_SEGMENT[reason];
}
