import { ChurnReason, ClassificationResult, SubscriptionInfo } from '@/lib/types';

export interface ClassifierContext {
  subscription: SubscriptionInfo;
  tenureDays: number;
  lastActiveAt: Date | null;
  activationAt: Date | null;
}

/**
 * Classify cancellation reason from Stripe's cancellation_details
 * Used by both queue (full context) and scan (Stripe-only)
 * Note: silent_rescue and never_activated require activity data
 */
export function classifyCancelReason(
  cancelDetails: any | null | undefined,
  comment: string | null | undefined
): ChurnReason {
  // If there's a comment, try to classify it first
  if (comment) {
    const lowerComment = comment.toLowerCase();
    if (lowerComment.includes('price') || lowerComment.includes('expensive') || lowerComment.includes('cost')) {
      return 'price';
    }
    if (lowerComment.includes('bug') || lowerComment.includes('issue') || lowerComment.includes('problem') || lowerComment.includes('error')) {
      return 'bug';
    }
    if (lowerComment.includes('competitor') || lowerComment.includes('alternative') || lowerComment.includes('switched')) {
      return 'competitor';
    }
    if (lowerComment.includes('feature') || lowerComment.includes('functionality') || lowerComment.includes('missing')) {
      return 'missing_feature';
    }
  }

  // Fall back to Stripe's reason
  const feedback = cancelDetails?.feedback;
  if (feedback === 'too_expensive') return 'price';
  if (feedback === 'missing_features') return 'missing_feature';
  if (feedback === 'switched_service') return 'competitor';
  if (feedback === 'customer_service') return 'bug';
  if (feedback === 'low_quality') return 'bug';
  // Note: 'unused' requires activity tracking, not available in scan-only mode

  return 'other';
}

export async function classifyChurn(context: ClassifierContext): Promise<ClassificationResult> {
  const { subscription, tenureDays, lastActiveAt, activationAt } = context;
  const evidence: string[] = [];
  
  const now = new Date();
  const daysUntilRenewal = Math.ceil(
    (subscription.currentPeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  const isMonthlyPlan = subscription.mrr > 0;
  const isAnnualPlan = subscription.mrr > 0 && subscription.currentPeriodEnd.getTime() - subscription.createdAt.getTime() > 300 * 24 * 60 * 60 * 1000;

  if (subscription.status === 'canceled' && subscription.cancelDetails?.comment) {
    evidence.push(`Customer feedback: "${subscription.cancelDetails.comment}"`);
  }

  if (!activationAt && tenureDays >= 7 && ['active', 'past_due'].includes(subscription.status)) {
    evidence.push('No activation event recorded');
    evidence.push(`Subscription tenure: ${tenureDays} days`);
    evidence.push(`Still renewing (status: ${subscription.status})`);
    
    return {
      reason: 'never_activated',
      confidence: 0.85,
      evidence,
      recommendedSequence: 'ret_never_activated',
      subjectDraft: 'You\'re paid up — 12 minutes to first win in {{product}}',
      bodyDraft: generateNeverActivatedEmail(context),
    };
  }

  if (lastActiveAt && ['active', 'past_due'].includes(subscription.status)) {
    const daysSinceActive = Math.ceil((now.getTime() - lastActiveAt.getTime()) / (1000 * 60 * 60 * 24));
    
    const shouldTriggerMonthly = isMonthlyPlan && daysSinceActive >= 14 && daysUntilRenewal <= 7;
    const shouldTriggerAnnual = isAnnualPlan && daysSinceActive >= 45 && daysUntilRenewal <= 30;
    
    if (shouldTriggerMonthly || shouldTriggerAnnual) {
      evidence.push(`Last activity: ${daysSinceActive} days ago`);
      evidence.push(`Renewal in ${daysUntilRenewal} days`);
      evidence.push(`${isMonthlyPlan ? 'Monthly' : 'Annual'} plan`);
      
      return {
        reason: 'silent_rescue',
        confidence: 0.80,
        evidence,
        recommendedSequence: 'ret_silent_rescue',
        subjectDraft: 'Checking in — still useful, or did we go quiet on you?',
        bodyDraft: generateSilentRescueEmail(context),
      };
    }
  }

  if (subscription.cancelDetails) {
    const feedback = subscription.cancelDetails.feedback;
    const comment = subscription.cancelDetails.comment || '';
    
    // Use shared classifier
    const reason = classifyCancelReason(subscription.cancelDetails, comment);
    
    if (reason === 'price') {
      evidence.push('Price-related cancellation feedback');
      return {
        reason: 'price',
        confidence: 0.90,
        evidence,
        recommendedSequence: 'ret_price',
        subjectDraft: 'Quick idea to make {{plan}} fit this quarter',
        bodyDraft: generatePriceEmail(context),
      };
    }
    
    if (reason === 'missing_feature') {
      evidence.push('Missing features mentioned');
      return {
        reason: 'missing_feature',
        confidence: 0.85,
        evidence,
        recommendedSequence: 'ret_missing_feature',
        subjectDraft: 'You\'re not crazy — {{feature}} is on us (timeline inside)',
        bodyDraft: generateMissingFeatureEmail(context),
      };
    }
    
    if (reason === 'competitor') {
      evidence.push('Switched to competitor');
      return {
        reason: 'competitor',
        confidence: 0.85,
        evidence,
        recommendedSequence: 'ret_competitor',
        subjectDraft: 'Honest comparison: {{product}} vs what you\'re evaluating',
        bodyDraft: generateCompetitorEmail(context),
      };
    }
    
    if (reason === 'bug') {
      evidence.push('Technical issues mentioned');
      return {
        reason: 'bug',
        confidence: 0.85,
        evidence,
        recommendedSequence: 'ret_bug',
        subjectDraft: 'We saw the rough edge — here\'s the fix (+ how to unblock)',
        bodyDraft: generateBugEmail(context),
      };
    }

    if (!feedback && !comment) {
      evidence.push('Subscription canceled without specific feedback');
    }
  }

  return {
    reason: 'other',
    confidence: 0.50,
    evidence,
    recommendedSequence: null,
    subjectDraft: '',
    bodyDraft: '',
  };
}

function generateNeverActivatedEmail(context: ClassifierContext): string {
  return `Hi there,

We noticed you signed up for ${context.subscription.plan} ${context.tenureDays} days ago, but you haven't had a chance to get started yet.

We'd love to help you get the most out of your subscription. Would you like to schedule a quick onboarding call?

Best regards,
The Team`;
}

function generateSilentRescueEmail(context: ClassifierContext): string {
  return `Hi there,

We noticed you haven't been active recently, but your subscription is about to renew.

We'd hate for you to pay for something you're not using. Would you like us to:
- Help you get back on track?
- Pause your subscription?
- Discuss your needs?

Let us know!

Best regards,
The Team`;
}

function generatePriceEmail(context: ClassifierContext): string {
  return `Hi there,

We understand pricing is important. Before you go, we'd like to discuss options that might work better for your budget.

Would you be open to a brief conversation?

Best regards,
The Team`;
}

function generateMissingFeatureEmail(context: ClassifierContext): string {
  return `Hi there,

Thank you for your feedback about features. We're constantly improving our product and your input is invaluable.

We'd love to understand your needs better and share our roadmap with you.

Best regards,
The Team`;
}

function generateCompetitorEmail(context: ClassifierContext): string {
  return `Hi there,

We'd love to understand what attracted you to another solution. Your feedback helps us improve.

Is there anything we could do to earn your business back?

Best regards,
The Team`;
}

function generateBugEmail(context: ClassifierContext): string {
  return `Hi there,

We're sorry you experienced technical issues. That's not the experience we want you to have.

Our engineering team would like to investigate and make this right. Can we schedule a time to discuss?

Best regards,
The Team`;
}

function generateGenericEmail(context: ClassifierContext): string {
  return `Hi there,

We're sorry to see you go. We'd appreciate any feedback you're willing to share about your experience.

If there's anything we can do to change your mind, please let us know.

Best regards,
The Team`;
}

export async function classifyChurnWithLLM(context: ClassifierContext): Promise<ClassificationResult> {
  throw new Error('LLM classification not yet implemented. Use heuristic classifier.');
}
