import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('resend', () => {
  return {
    Resend: vi.fn().mockImplementation(() => ({
      contacts: {
        create: vi.fn().mockResolvedValue({ data: { id: 'contact_123' } }),
        update: vi.fn().mockResolvedValue({ data: { id: 'contact_123' } }),
        list: vi.fn().mockResolvedValue({ data: { data: [] } }),
      },
    })),
  };
});

beforeEach(() => {
  process.env.RESEND_API_KEY = 'test_key';
  process.env.RESEND_AUDIENCE_ID = 'aud_123';
});

import { enrollInResend, getTagForReason } from '@/lib/resend/client';

describe('Resend Client', () => {
  it('should map churn reasons to tags correctly', () => {
    expect(getTagForReason('price')).toBe('ret_price');
    expect(getTagForReason('bug')).toBe('ret_bug');
    expect(getTagForReason('missing_feature')).toBe('ret_missing_feature');
    expect(getTagForReason('competitor')).toBe('ret_competitor');
    expect(getTagForReason('never_activated')).toBe('ret_never_activated');
    expect(getTagForReason('silent_rescue')).toBe('ret_silent_rescue');
    expect(getTagForReason('payment_failed')).toBe('ret_payment_failed');
    expect(getTagForReason('other')).toBe('ret_other');
  });

  it('should enroll a contact in Resend with appropriate tag', async () => {
    const contactId = await enrollInResend('test@example.com', 'price');
    expect(contactId).toBe('contact_123');
  });
});
