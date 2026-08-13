import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyQueueAuth, unauthorizedResponse } from '@/lib/queue-auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Protect queue data - must be authenticated
  if (!verifyQueueAuth(req)) {
    return unauthorizedResponse();
  }

  try {
    const retentionCase = await prisma.retentionCase.findUnique({
      where: { id: params.id },
    });

    if (!retentionCase) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...retentionCase,
      evidence: retentionCase.evidence as string[],
    });
  } catch (error: any) {
    console.error('Error fetching case:', error);
    return NextResponse.json(
      { error: 'Failed to fetch case' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Protect queue mutations - must be authenticated
  if (!verifyQueueAuth(req)) {
    return unauthorizedResponse();
  }

  try {
    const body = await req.json();
    const { state, overrideReason, subjectDraft, bodyDraft, snoozeUntil } = body;

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (state) {
      updateData.state = state;
      if (state === 'approved' || state === 'edited_approved' || state === 'rejected') {
        updateData.reviewedAt = new Date();
      }
    }

    if (overrideReason !== undefined) {
      updateData.overrideReason = overrideReason;
    }

    if (subjectDraft !== undefined) {
      updateData.subjectDraft = subjectDraft;
    }

    if (bodyDraft !== undefined) {
      updateData.bodyDraft = bodyDraft;
    }

    if (snoozeUntil) {
      updateData.snoozeUntil = new Date(snoozeUntil);
    }

    const updated = await prisma.retentionCase.update({
      where: { id: params.id },
      data: updateData,
    });

    if (state === 'approved' || state === 'edited_approved') {
      const effectiveReason = updated.overrideReason || updated.reason;
      const { sendRetentionEmail, shouldSendForReason, getReplyToAddress } = await import('@/lib/resend/send-email');
      
      try {
        // Check if this reason should trigger an email send
        if (!shouldSendForReason(effectiveReason as any)) {
          console.log(`No email send for reason=${effectiveReason} (display-only)`);
          return NextResponse.json({
            ...updated,
            evidence: updated.evidence as string[],
          });
        }
        
        if (!updated.customerEmail) {
          console.log(`No customerEmail for case ${updated.id}`);
          return NextResponse.json({
            ...updated,
            evidence: updated.evidence as string[],
          });
        }
        
        const triggerEventId = updated.stripeEventIds[0] || updated.id;
        
        // Check for idempotency - have we already sent an email for this case/event?
        const existingSend = await prisma.resendEnrollment.findFirst({
          where: {
            customerId: updated.customerId,
            tag: effectiveReason,
            triggerEventId,
          },
        });

        if (!existingSend) {
          // Get Reply-To address (founder/workspace, NEVER the customer)
          const replyTo = getReplyToAddress();
          
          // Send the retention email from Signal's Resend account
          const emailId = await sendRetentionEmail({
            to: updated.customerEmail,
            subject: updated.subjectDraft,
            body: updated.bodyDraft,
            replyTo,
          });

          // Track that we sent this email (for idempotency)
          await prisma.resendEnrollment.create({
            data: {
              caseId: updated.id,
              contactId: emailId,
              customerId: updated.customerId,
              tag: effectiveReason,
              tags: [effectiveReason],
              triggerEventId,
            },
          });
          
          console.log(`Sent retention email to ${updated.customerEmail} (emailId: ${emailId}, reason: ${effectiveReason}, replyTo: ${replyTo})`);
        } else {
          console.log(`Email already sent for customer ${updated.customerId} with reason ${effectiveReason} and event ${triggerEventId}`);
        }
      } catch (error: any) {
        console.error('Failed to send retention email:', error);
      }
    }

    return NextResponse.json({
      ...updated,
      evidence: updated.evidence as string[],
    });
  } catch (error: any) {
    console.error('Error updating case:', error);
    return NextResponse.json(
      { error: 'Failed to update case' },
      { status: 500 }
    );
  }
}
