import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createMagicLinkToken, verifyMagicLinkToken } from '@/lib/auth/jwt';
import { createToken } from '@/lib/auth/jwt';
import { createSessionCookie } from '@/lib/auth/session';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * POST - Send a magic link email
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      // For security, don't reveal if email exists or not
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a magic link has been sent',
      });
    }

    // Create magic link token
    const token = createMagicLinkToken(normalizedEmail);

    // Build magic link URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const magicLink = `${baseUrl}/login?token=${token}`;

    // Send email via Resend
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Signal <onboarding@resend.dev>',
      to: normalizedEmail,
      subject: 'Sign in to Signal',
      text: `Click this link to sign in to Signal:\n\n${magicLink}\n\nThis link expires in 15 minutes.\n\nIf you didn't request this, you can safely ignore this email.`,
    });

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, a magic link has been sent',
    });
  } catch (error: any) {
    console.error('Magic link send error:', error);
    return NextResponse.json(
      { error: 'Failed to send magic link' },
      { status: 500 }
    );
  }
}

/**
 * GET - Verify a magic link token
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Verify the magic link token
    const email = verifyMagicLinkToken(token);

    if (!email) {
      return NextResponse.json(
        { error: 'Invalid or expired magic link' },
        { status: 401 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create session token
    const sessionToken = createToken({
      userId: user.id,
      email: user.email,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        company: user.company,
      },
    });

    response.headers.set('Set-Cookie', createSessionCookie(sessionToken));

    return response;
  } catch (error: any) {
    console.error('Magic link verify error:', error);
    return NextResponse.json(
      { error: 'Failed to verify magic link' },
      { status: 500 }
    );
  }
}
