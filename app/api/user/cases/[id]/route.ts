import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { prisma } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAuth(req);
  
  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    const retentionCase = await prisma.retentionCase.findFirst({
      where: {
        id: params.id,
        userId: auth.userId,
      },
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
  const auth = await requireAuth(req);
  
  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    const body = await req.json();
    const { state, overrideReason, subjectDraft, bodyDraft, snoozeUntil } = body;

    // Verify the case belongs to this user
    const existingCase = await prisma.retentionCase.findFirst({
      where: {
        id: params.id,
        userId: auth.userId,
      },
    });

    if (!existingCase) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (state) {
      updateData.state = state;
      if (state === 'approved' || state === 'edited_approved' || state === 'rejected') {
        updateData.reviewedAt = new Date();
        updateData.reviewedBy = auth.email;
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

    // Handle email sending on approval
    if (state === 'approved' || state === 'edited_approved') {
      const effectiveReason = updated.overrideReason || updated.reason;
      const { sendRetentionEmail, shouldSendForReason } = await import('@/lib/resend/send-email');
      
      try {
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

        // Get user's reply-to email
        const user = await prisma.user.findUnique({
          where: { id: auth.userId },
          select: { replyToEmail: true, email: true },
        });

        const replyTo = user?.replyToEmail || user?.email || auth.email;
        
        const triggerEventId = updated.stripeEventIds[0] || updated.id;
        
        // Check for idempotency
        const existingSend = await prisma.resendEnrollment.findFirst({
          where: {
            customerId: updated.customerId,
            tag: effectiveReason,
            triggerEventId,
          },
        });

        if (!existingSend) {
          // Send plain text email
          const emailId = await sendRetentionEmail({
            to: updated.customerEmail,
            subject: updated.subjectDraft,
            body: updated.bodyDraft,
            replyTo,
          });

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
