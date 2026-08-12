import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockFetch = vi.fn();
global.fetch = mockFetch;

vi.mock('resend', () => {
  return {
    Resend: vi.fn().mockImplementation(() => ({
      contacts: {
        create: vi.fn().mockResolvedValue({ data: { id: 'contact_123' } }),
        list: vi.fn().mockResolvedValue({ data: { data: [] } }),
      },
    })),
  };
});

beforeEach(() => {
  process.env.RESEND_API_KEY = 'test_key';
  process.env.RESEND_AUDIENCE_ID = 'aud_123';
  mockFetch.mockClear();
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => ({}),
    text: async () => '',
  });
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

  it('should enroll a contact and apply ret_price tag', async () => {
    const contactId = await enrollInResend('test@example.com', 'price');
    expect(contactId).toBe('contact_123');
    
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.resend.com/tags',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': 'Bearer test_key',
          'Content-Type': 'application/json',
        }),
        body: expect.stringContaining('ret_price'),
      })
    );
    
    const tagCallBody = JSON.parse(mockFetch.mock.calls.find((call: any) => 
      call[0] === 'https://api.resend.com/tags'
    )?.[1]?.body || '{}');
    
    expect(tagCallBody).toEqual({
      audience_id: 'aud_123',
      contact_id: 'contact_123',
      tag_name: 'ret_price',
    });
  });

  it('should apply ret_bug tag when enrolling for bug reason', async () => {
    await enrollInResend('bug@example.com', 'bug');
    
    const tagCallBody = JSON.parse(mockFetch.mock.calls.find((call: any) => 
      call[0] === 'https://api.resend.com/tags'
    )?.[1]?.body || '{}');
    
    expect(tagCallBody.tag_name).toBe('ret_bug');
  });
});
