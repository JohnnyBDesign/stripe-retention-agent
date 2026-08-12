import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/v1/signals/activity/route';

vi.mock('@/lib/db', () => ({
  prisma: {
    customerActivity: {
      upsert: vi.fn().mockResolvedValue({
        id: 'act_123',
        customerId: 'cust_123',
        stripeCustomerId: 'cus_stripe_123',
        lastActiveAt: new Date('2024-08-01T10:00:00Z'),
        activationCompletedAt: new Date('2024-07-01T10:00:00Z'),
        updatedAt: new Date(),
        createdAt: new Date(),
        events: null,
      }),
    },
    activityEvent: {
      create: vi.fn().mockResolvedValue({
        id: 'evt_123',
        customerId: 'cust_123',
        name: 'feature_used',
        occurredAt: new Date('2024-08-01T10:00:00Z'),
        createdAt: new Date(),
      }),
    },
  },
}));

describe('Activity Signal API', () => {

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should accept and store activity signal with all fields', async () => {
    const body = {
      customer_id: 'cust_123',
      stripe_customer_id: 'cus_stripe_123',
      activation_completed_at: '2024-07-01T10:00:00Z',
      last_active_at: '2024-08-01T10:00:00Z',
      events: [
        { name: 'feature_used', at: '2024-08-01T10:00:00Z' },
        { name: 'document_created', at: '2024-08-01T11:00:00Z' },
      ],
    };

    const request = new NextRequest('http://localhost:3000/api/v1/signals/activity', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.activity.customer_id).toBe('cust_123');
  });

  it('should accept activation_completed_at only', async () => {
    const body = {
      customer_id: 'cust_456',
      activation_completed_at: '2024-07-01T10:00:00Z',
    };

    const request = new NextRequest('http://localhost:3000/api/v1/signals/activity', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('should accept last_active_at only', async () => {
    const body = {
      customer_id: 'cust_789',
      last_active_at: '2024-08-01T10:00:00Z',
    };

    const request = new NextRequest('http://localhost:3000/api/v1/signals/activity', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('should reject invalid datetime format', async () => {
    const body = {
      customer_id: 'cust_123',
      activation_completed_at: 'invalid-date',
    };

    const request = new NextRequest('http://localhost:3000/api/v1/signals/activity', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('should reject missing customer_id', async () => {
    const body = {
      last_active_at: '2024-08-01T10:00:00Z',
    };

    const request = new NextRequest('http://localhost:3000/api/v1/signals/activity', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
