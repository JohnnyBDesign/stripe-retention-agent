import { describe, it, expect } from 'vitest';
import { classifyChurn, ClassifierContext } from '@/lib/classifier';

describe('Classifier', () => {
  it('should classify never_activated users', async () => {
    const context: ClassifierContext = {
      subscription: {
        customerId: 'cus_test',
        customerEmail: 'test@example.com',
        subscriptionId: 'sub_test',
        plan: 'Pro Plan',
        mrr: 29.99,
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        canceledAt: null,
        cancelDetails: null,
      },
      tenureDays: 10,
      lastActiveAt: null,
      activationAt: null,
    };

    const result = await classifyChurn(context);

    expect(result.reason).toBe('never_activated');
    expect(result.confidence).toBeGreaterThan(0.7);
    expect(result.evidence).toContain('No activation event recorded');
  });

  it('should classify silent_rescue for inactive monthly users', async () => {
    const context: ClassifierContext = {
      subscription: {
        customerId: 'cus_test',
        customerEmail: 'test@example.com',
        subscriptionId: 'sub_test',
        plan: 'Pro Plan',
        mrr: 29.99,
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        canceledAt: null,
        cancelDetails: null,
      },
      tenureDays: 60,
      lastActiveAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      activationAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    };

    const result = await classifyChurn(context);

    expect(result.reason).toBe('silent_rescue');
    expect(result.confidence).toBeGreaterThan(0.7);
    expect(result.evidence.some(e => e.includes('Last activity'))).toBe(true);
  });

  it('should classify price-related cancellations', async () => {
    const context: ClassifierContext = {
      subscription: {
        customerId: 'cus_test',
        customerEmail: 'test@example.com',
        subscriptionId: 'sub_test',
        plan: 'Pro Plan',
        mrr: 29.99,
        status: 'canceled',
        currentPeriodEnd: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        canceledAt: new Date(),
        cancelDetails: {
          feedback: 'too_expensive',
          comment: 'Too expensive for my budget',
        },
      },
      tenureDays: 60,
      lastActiveAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      activationAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    };

    const result = await classifyChurn(context);

    expect(result.reason).toBe('price');
    expect(result.confidence).toBeGreaterThan(0.8);
    expect(result.evidence).toContain('Price-related cancellation feedback');
  });

  it('should classify bug-related cancellations', async () => {
    const context: ClassifierContext = {
      subscription: {
        customerId: 'cus_test',
        customerEmail: 'test@example.com',
        subscriptionId: 'sub_test',
        plan: 'Pro Plan',
        mrr: 29.99,
        status: 'canceled',
        currentPeriodEnd: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        canceledAt: new Date(),
        cancelDetails: {
          comment: 'The app has too many bugs',
        },
      },
      tenureDays: 60,
      lastActiveAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      activationAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    };

    const result = await classifyChurn(context);

    expect(result.reason).toBe('bug');
    expect(result.confidence).toBeGreaterThan(0.8);
    expect(result.evidence).toContain('Technical issues mentioned');
  });

  it('should classify missing_feature cancellations', async () => {
    const context: ClassifierContext = {
      subscription: {
        customerId: 'cus_test',
        customerEmail: 'test@example.com',
        subscriptionId: 'sub_test',
        plan: 'Pro Plan',
        mrr: 29.99,
        status: 'canceled',
        currentPeriodEnd: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        canceledAt: new Date(),
        cancelDetails: {
          feedback: 'missing_features',
          comment: 'Need feature X',
        },
      },
      tenureDays: 60,
      lastActiveAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      activationAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    };

    const result = await classifyChurn(context);

    expect(result.reason).toBe('missing_feature');
    expect(result.confidence).toBeGreaterThan(0.8);
    expect(result.evidence).toContain('Missing features mentioned');
  });

  it('should default to other for unknown cases', async () => {
    const context: ClassifierContext = {
      subscription: {
        customerId: 'cus_test',
        customerEmail: 'test@example.com',
        subscriptionId: 'sub_test',
        plan: 'Pro Plan',
        mrr: 29.99,
        status: 'canceled',
        currentPeriodEnd: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        canceledAt: new Date(),
        cancelDetails: null,
      },
      tenureDays: 60,
      lastActiveAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      activationAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    };

    const result = await classifyChurn(context);

    expect(result.reason).toBe('other');
    expect(result.confidence).toBeLessThan(0.7);
  });
});
