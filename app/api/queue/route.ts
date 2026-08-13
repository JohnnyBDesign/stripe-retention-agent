import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { CaseState } from '@/lib/types';
import { verifyQueueAuth, unauthorizedResponse } from '@/lib/queue-auth';

export async function GET(req: NextRequest) {
  // Protect queue data - must be authenticated
  if (!verifyQueueAuth(req)) {
    return unauthorizedResponse();
  }

  const { searchParams } = new URL(req.url);
  const state = searchParams.get('state') || 'pending';
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    const cases = await prisma.retentionCase.findMany({
      where: state !== 'all' ? { state } : undefined,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await prisma.retentionCase.count({
      where: state !== 'all' ? { state } : undefined,
    });

    return NextResponse.json({
      cases: cases.map((c: any) => ({
        ...c,
        evidence: c.evidence as string[],
      })),
      total,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error('Error fetching cases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cases' },
      { status: 500 }
    );
  }
}
