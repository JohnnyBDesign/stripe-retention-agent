import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  
  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
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

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Error fetching user settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(req);
  
  if (auth instanceof NextResponse) {
    return auth;
  }

  try {
    const body = await req.json();
    const { name, company, replyToEmail } = body;

    const updateData: any = {};

    if (name !== undefined) {
      updateData.name = name;
    }

    if (company !== undefined) {
      updateData.company = company;
    }

    if (replyToEmail !== undefined) {
      // Basic email validation
      if (replyToEmail && !replyToEmail.includes('@')) {
        return NextResponse.json(
          { error: 'Invalid email address' },
          { status: 400 }
        );
      }
      updateData.replyToEmail = replyToEmail;
    }

    const user = await prisma.user.update({
      where: { id: auth.userId },
      data: updateData,
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

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Error updating user settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
