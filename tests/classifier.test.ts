import { describe, it, expect } from 'vitest';
import { classifyChurn, ClassifierContext } from '@/lib/classifier';

describe('Classifier', () => {
  it('should use ret_never_activated sequence for never_activated users', async () => {
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
    expect(result.recommendedSequence).toBe('ret_never_activated');
    expect(result.subjectDraft).toBe('You\'re paid up — 12 minutes to first win in {{product}}');
    expect(result.evidence).toContain('No activation event recorded');
  });

  it('should use ret_silent_rescue sequence for inactive monthly users', async () => {
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
    expect(result.recommendedSequence).toBe('ret_silent_rescue');
    expect(result.subjectDraft).toBe('Checking in — still useful, or did we go quiet on you?');
    expect(result.evidence.some(e => e.includes('Last activity'))).toBe(true);
  });

  it('should use ret_price sequence for price-related cancellations', async () => {
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
    expect(result.recommendedSequence).toBe('ret_price');
    expect(result.subjectDraft).toBe('Quick idea to make {{plan}} fit this quarter');
    expect(result.evidence).toContain('Price-related cancellation feedback');
  });

  it('should use ret_bug sequence for bug-related cancellations', async () => {
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
    expect(result.recommendedSequence).toBe('ret_bug');
    expect(result.subjectDraft).toBe('We saw the rough edge — here\'s the fix (+ how to unblock)');
    expect(result.evidence).toContain('Technical issues mentioned');
  });

  it('should use ret_missing_feature sequence for missing_feature cancellations', async () => {
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
    expect(result.recommendedSequence).toBe('ret_missing_feature');
    expect(result.subjectDraft).toBe('You\'re not crazy — {{feature}} is on us (timeline inside)');
    expect(result.evidence).toContain('Missing features mentioned');
  });

  it('should use ret_competitor sequence for competitor switches', async () => {
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
          feedback: 'switched_service',
        },
      },
      tenureDays: 60,
      lastActiveAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      activationAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    };

    const result = await classifyChurn(context);

    expect(result.reason).toBe('competitor');
    expect(result.confidence).toBeGreaterThan(0.8);
    expect(result.recommendedSequence).toBe('ret_competitor');
    expect(result.subjectDraft).toBe('Honest comparison: {{product}} vs what you\'re evaluating');
  });

  it('should not suggest recommendedSequence for other cases', async () => {
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
    expect(result.recommendedSequence).toBeNull();
    expect(result.subjectDraft).toBe('');
    expect(result.bodyDraft).toBe('');
  });
});
