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
  mockFetch.mockClear();
  mockFetch.mockImplementation((url: string) => {
    if (url === 'https://api.resend.com/segments') {
      return Promise.resolve({
        ok: true,
        json: async () => ({ data: [{ id: 'seg_123', name: 'ret_price' }] }),
        text: async () => '',
      });
    }
    if (url.startsWith('https://api.resend.com/contacts/') && url.includes('/segments/')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({}),
        text: async () => '',
      });
    }
    return Promise.resolve({
      ok: true,
      json: async () => ({}),
      text: async () => '',
    });
  });
});

import { enrollInResend, getTagForReason } from '@/lib/resend/client';

describe('Resend Client', () => {
  it('should map churn reasons to segment names correctly', () => {
    expect(getTagForReason('price')).toBe('ret_price');
    expect(getTagForReason('bug')).toBe('ret_bug');
    expect(getTagForReason('missing_feature')).toBe('ret_missing_feature');
    expect(getTagForReason('competitor')).toBe('ret_competitor');
    expect(getTagForReason('never_activated')).toBe('ret_never_activated');
    expect(getTagForReason('silent_rescue')).toBe('ret_silent_rescue');
    expect(getTagForReason('payment_failed')).toBe('ret_payment_failed');
    expect(getTagForReason('other')).toBe('ret_other');
  });

  it('should enroll a contact and add to ret_price segment', async () => {
    const contactId = await enrollInResend('test@example.com', 'price');
    expect(contactId).toBe('contact_123');
    
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.resend.com/segments',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Authorization': 'Bearer test_key',
          'Content-Type': 'application/json',
        }),
      })
    );
    
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.resend.com/contacts/contact_123/segments/seg_123',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': 'Bearer test_key',
          'Content-Type': 'application/json',
        }),
      })
    );
  });

  it('should create segment if it does not exist and add contact', async () => {
    mockFetch.mockImplementation((url: string, options?: any) => {
      if (url === 'https://api.resend.com/segments' && options?.method === 'GET') {
        return Promise.resolve({
          ok: true,
          json: async () => ({ data: [] }),
          text: async () => '',
        });
      }
      if (url === 'https://api.resend.com/segments' && options?.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: async () => ({ data: { id: 'seg_new', name: 'ret_bug' } }),
          text: async () => '',
        });
      }
      if (url.startsWith('https://api.resend.com/contacts/') && url.includes('/segments/')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({}),
          text: async () => '',
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({}),
        text: async () => '',
      });
    });

    await enrollInResend('bug@example.com', 'bug');
    
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.resend.com/segments',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'ret_bug' }),
      })
    );

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.resend.com/contacts/contact_123/segments/seg_new',
      expect.objectContaining({
        method: 'POST',
      })
    );
  });
});
