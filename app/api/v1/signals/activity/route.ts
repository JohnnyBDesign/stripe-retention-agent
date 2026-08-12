import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const ActivitySignalSchema = z.object({
  customer_id: z.string(),
  stripe_customer_id: z.string().optional(),
  activation_completed_at: z.string().datetime().optional().nullable(),
  last_active_at: z.string().datetime().optional().nullable(),
  events: z.array(z.object({
    name: z.string(),
    at: z.string().datetime(),
  })).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const signal = ActivitySignalSchema.parse(body);

    const updateData: any = {
      customerId: signal.customer_id,
      stripeCustomerId: signal.stripe_customer_id || null,
      updatedAt: new Date(),
    };

    if (signal.activation_completed_at) {
      updateData.activationCompletedAt = new Date(signal.activation_completed_at);
    }

    if (signal.last_active_at) {
      updateData.lastActiveAt = new Date(signal.last_active_at);
    }

    if (signal.events && signal.events.length > 0) {
      updateData.events = signal.events;
    }

    const activity = await prisma.customerActivity.upsert({
      where: { customerId: signal.customer_id },
      update: updateData,
      create: {
        ...updateData,
        customerId: signal.customer_id,
      },
    });

    if (signal.events) {
      await Promise.all(
        signal.events.map(event =>
          prisma.activityEvent.create({
            data: {
              customerId: signal.customer_id,
              name: event.name,
              occurredAt: new Date(event.at),
            },
          })
        )
      );
    }

    return NextResponse.json({
      success: true,
      activity: {
        customer_id: activity.customerId,
        activation_completed_at: activity.activationCompletedAt,
        last_active_at: activity.lastActiveAt,
      },
    });
  } catch (error: any) {
    console.error('Error processing activity signal:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request body', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
