import { describe, it, expect } from 'vitest';
import { ChurnReason, CaseState, RetentionCaseSchema } from '@/lib/types';

describe('Types and Schemas', () => {
  it('should validate ChurnReason enum', () => {
    expect(ChurnReason.safeParse('price').success).toBe(true);
    expect(ChurnReason.safeParse('bug').success).toBe(true);
    expect(ChurnReason.safeParse('missing_feature').success).toBe(true);
    expect(ChurnReason.safeParse('competitor').success).toBe(true);
    expect(ChurnReason.safeParse('never_activated').success).toBe(true);
    expect(ChurnReason.safeParse('silent_rescue').success).toBe(true);
    expect(ChurnReason.safeParse('payment_failed').success).toBe(true);
    expect(ChurnReason.safeParse('other').success).toBe(true);
    expect(ChurnReason.safeParse('invalid').success).toBe(false);
  });

  it('should validate CaseState enum', () => {
    expect(CaseState.safeParse('pending').success).toBe(true);
    expect(CaseState.safeParse('approved').success).toBe(true);
    expect(CaseState.safeParse('edited_approved').success).toBe(true);
    expect(CaseState.safeParse('rejected').success).toBe(true);
    expect(CaseState.safeParse('snoozed').success).toBe(true);
    expect(CaseState.safeParse('invalid').success).toBe(false);
  });

  it('should validate RetentionCase schema', () => {
    const validCase = {
      id: 'case_123',
      customerId: 'cus_123',
      customerEmail: 'test@example.com',
      subscriptionId: 'sub_123',
      plan: 'Pro Plan',
      mrr: 29.99,
      tenureDays: 60,
      reason: 'price',
      confidence: 0.85,
      evidence: ['Price-related feedback'],
      recommendedSequence: 'discount_offer',
      subjectDraft: 'Special offer',
      bodyDraft: 'Email body',
      state: 'pending',
      overrideReason: null,
      reviewedAt: null,
      reviewedBy: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = RetentionCaseSchema.safeParse(validCase);
    expect(result.success).toBe(true);
  });

  it('should reject invalid RetentionCase with bad email', () => {
    const invalidCase = {
      id: 'case_123',
      customerId: 'cus_123',
      customerEmail: 'not-an-email',
      subscriptionId: 'sub_123',
      plan: 'Pro Plan',
      mrr: 29.99,
      tenureDays: 60,
      reason: 'price',
      confidence: 0.85,
      evidence: ['Price-related feedback'],
      recommendedSequence: 'discount_offer',
      subjectDraft: 'Special offer',
      bodyDraft: 'Email body',
      state: 'pending',
      overrideReason: null,
      reviewedAt: null,
      reviewedBy: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = RetentionCaseSchema.safeParse(invalidCase);
    expect(result.success).toBe(false);
  });
});
