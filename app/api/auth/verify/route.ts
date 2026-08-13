import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);

    if (!user) {
      return NextResponse.json({ authenticated: false });
    }

    // Fetch full user details
    const fullUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        company: true,
        replyToEmail: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    if (!fullUser) {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({
      authenticated: true,
      user: fullUser,
    });
  } catch (error: any) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { error: 'Failed to verify authentication' },
      { status: 500 }
    );
  }
}
