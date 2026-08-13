import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  
  if (auth instanceof NextResponse) {
    return auth;
  }

  const { searchParams } = new URL(req.url);
  const state = searchParams.get('state') || 'pending';

  try {
    const cases = await prisma.retentionCase.findMany({
      where: {
        userId: auth.userId,
        ...(state !== 'all' ? { state } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({
      cases: cases.map((c: any) => ({
        ...c,
        evidence: c.evidence as string[],
      })),
    });
  } catch (error: any) {
    console.error('Error fetching user cases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cases' },
      { status: 500 }
    );
  }
}
