import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { encryptStripeKey, getStripeKeyLast4 } from '@/lib/crypto';
import Stripe from 'stripe';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  
  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    const connection = await prisma.stripeConnection.findFirst({
      where: {
        userId: auth.userId,
        isActive: true,
      },
      select: {
        id: true,
        keyLast4: true,
        stripeAccountId: true,
        webhookEndpointId: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ connection });
  } catch (error: any) {
    console.error('Error fetching Stripe connection:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Stripe connection' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  
  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    const body = await req.json();
    const { stripeKey } = body;

    if (!stripeKey || !stripeKey.startsWith('sk_')) {
      return NextResponse.json(
        { error: 'Invalid Stripe key format' },
        { status: 400 }
      );
    }

    // Test the key by making a simple API call
    let stripeAccountId: string | null = null;
    try {
      const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' });
      const account = await stripe.accounts.retrieve();
      stripeAccountId = account.id;
    } catch (err: any) {
      console.error('Invalid Stripe key:', err);
      return NextResponse.json(
        { error: 'Invalid Stripe API key or insufficient permissions' },
        { status: 400 }
      );
    }

    // Deactivate existing connections
    await prisma.stripeConnection.updateMany({
      where: {
        userId: auth.userId,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    // Encrypt and store the new key
    const encryptedKey = encryptStripeKey(stripeKey);
    const keyLast4 = getStripeKeyLast4(stripeKey);

    const connection = await prisma.stripeConnection.create({
      data: {
        userId: auth.userId,
        encryptedKey,
        keyLast4,
        stripeAccountId,
        isActive: true,
      },
      select: {
        id: true,
        keyLast4: true,
        stripeAccountId: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ connection });
  } catch (error: any) {
    console.error('Error creating Stripe connection:', error);
    return NextResponse.json(
      { error: 'Failed to connect Stripe account' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAuth(req);
  
  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    await prisma.stripeConnection.updateMany({
      where: {
        userId: auth.userId,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error disconnecting Stripe:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect Stripe' },
      { status: 500 }
    );
  }
}
