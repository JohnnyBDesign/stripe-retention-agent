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

/** Product OK: enroll marker = Resend Segment named exact ret_* */
const REASON_TO_SEGMENT: Partial<Record<ChurnReason, string>> = {
  price: 'ret_price',
  bug: 'ret_bug',
  missing_feature: 'ret_missing_feature',
  competitor: 'ret_competitor',
  never_activated: 'ret_never_activated',
  silent_rescue: 'ret_silent_rescue',
};

export function getTagForReason(reason: ChurnReason): string | null {
  return REASON_TO_SEGMENT[reason] ?? null;
}

async function resendFetch(path: string, init: RequestInit = {}): Promise<any> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY is not set');
  const response = await fetch(`https://api.resend.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  const text = await response.text();
  let body: any = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = { raw: text };
  }
  if (!response.ok) {
    throw new Error(`Resend ${init.method || 'GET'} ${path} => ${response.status}: ${text}`);
  }
  return body;
}

async function ensureSegmentId(segmentName: string): Promise<string> {
  const cached = segmentCache.get(segmentName);
  if (cached) return cached;
  const listed = await resendFetch('/segments');
  const found = (listed?.data || []).find((s: any) => s.name === segmentName);
  if (found?.id) {
    segmentCache.set(segmentName, found.id);
    return found.id;
  }
  const created = await resendFetch('/segments', {
    method: 'POST',
    body: JSON.stringify({ name: segmentName }),
  });
  if (!created?.id) throw new Error(`Failed to create segment ${segmentName}`);
  segmentCache.set(segmentName, created.id);
  return created.id;
}

async function ensureContactId(email: string): Promise<string> {
  try {
    const created = await resendFetch('/contacts', {
      method: 'POST',
      body: JSON.stringify({ email, unsubscribed: false }),
    });
    if (created?.id) return created.id;
  } catch (err: any) {
    const msg = String(err?.message || err);
    if (!/already|exists|409|422/i.test(msg)) throw err;
  }
  try {
    const byEmail = await resendFetch(`/contacts/${encodeURIComponent(email)}`);
    if (byEmail?.id) return byEmail.id;
  } catch {}
  const listed = await resendFetch('/contacts');
  const existing = (listed?.data || []).find((c: any) => c.email === email);
  if (existing?.id) return existing.id;
  throw new Error(`Could not create or find Resend contact for ${email}`);
}

async function addContactToSegment(contactId: string, segmentId: string): Promise<void> {
  try {
    await resendFetch(`/contacts/${contactId}/segments/${segmentId}`, { method: 'POST' });
  } catch (err: any) {
    const msg = String(err?.message || err);
    if (/already|exists|409/i.test(msg)) return;
    throw err;
  }
}

export async function enrollInResend(email: string, reason: ChurnReason): Promise<string> {
  const segmentName = REASON_TO_SEGMENT[reason];
  if (!segmentName) {
    throw new Error(`No Resend segment enroll for reason=${reason}`);
  }
  getResendClient();
  const contactId = await ensureContactId(email);
  const segmentId = await ensureSegmentId(segmentName);
  await addContactToSegment(contactId, segmentId);
  return contactId;
}
