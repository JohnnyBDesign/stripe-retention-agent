import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockFetch = vi.fn();
global.fetch = mockFetch;

vi.mock('resend', () => {
  return {
    Resend: vi.fn().mockImplementation(() => ({})),
  };
});

beforeEach(() => {
  process.env.RESEND_API_KEY = 'test_key';
  mockFetch.mockClear();
});

import { enrollInResend, getTagForReason } from '@/lib/resend/client';

describe('Resend Client', () => {
  it('should map churn reasons to segments correctly', () => {
    expect(getTagForReason('price')).toBe('ret_price');
    expect(getTagForReason('bug')).toBe('ret_bug');
    expect(getTagForReason('missing_feature')).toBe('ret_missing_feature');
    expect(getTagForReason('competitor')).toBe('ret_competitor');
    expect(getTagForReason('never_activated')).toBe('ret_never_activated');
    expect(getTagForReason('silent_rescue')).toBe('ret_silent_rescue');
    expect(getTagForReason('payment_failed')).toBe(null);
    expect(getTagForReason('other')).toBe(null);
  });

  it('should enroll a contact in ret_price segment', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify({ data: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify({ id: 'seg_price' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify({ id: 'contact_123' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify({}),
      });

    const contactId = await enrollInResend('test@example.com', 'price');
    expect(contactId).toBe('contact_123');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.resend.com/segments',
      expect.objectContaining({
        method: 'GET',
      })
    );

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.resend.com/segments',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'ret_price' }),
      })
    );

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.resend.com/contacts',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com', unsubscribed: false }),
      })
    );

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.resend.com/contacts/contact_123/segments/seg_price',
      expect.objectContaining({
        method: 'POST',
      })
    );

    const tagsCalls = mockFetch.mock.calls.filter((call: any) => call[0] === 'https://api.resend.com/tags');
    expect(tagsCalls.length).toBe(0);
  });

  it('should throw for payment_failed reason', async () => {
    await expect(enrollInResend('test@example.com', 'payment_failed')).rejects.toThrow(
      'No Resend segment enroll for reason=payment_failed'
    );
  });

  it('should throw for other reason', async () => {
    await expect(enrollInResend('test@example.com', 'other')).rejects.toThrow(
      'No Resend segment enroll for reason=other'
    );
  });
});
