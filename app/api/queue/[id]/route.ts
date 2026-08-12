import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
      
      if (effectiveReason !== 'payment_failed' && effectiveReason !== 'other') {
        const { enrollInResend } = await import('@/lib/resend/client');
        const { getTagForReason } = await import('@/lib/resend/client');
        
        try {
          const tag = getTagForReason(effectiveReason as any);
          const triggerEventId = updated.stripeEventIds[0] || updated.id;
          
          const existingEnrollment = await prisma.resendEnrollment.findFirst({
            where: {
              customerId: updated.customerId,
              tag,
              triggerEventId,
            },
          });

          if (!existingEnrollment) {
            const contactId = await enrollInResend(
              updated.customerEmail,
              effectiveReason as any
            );

            await prisma.resendEnrollment.create({
              data: {
                caseId: updated.id,
                contactId,
                customerId: updated.customerId,
                tag,
                tags: [tag],
                triggerEventId,
              },
            });
          } else {
            console.log(`Enrollment already exists for customer ${updated.customerId} with tag ${tag}`);
          }
        } catch (error: any) {
          console.error('Failed to enroll in Resend:', error);
        }
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
