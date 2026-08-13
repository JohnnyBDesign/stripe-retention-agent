import { NextRequest, NextResponse } from 'next/server';
import { verifyQueueAuth, createSessionCookie, requiresAuth } from '@/lib/queue-auth';

export async function GET(req: NextRequest) {
  const authenticated = verifyQueueAuth(req);
  
  return NextResponse.json({
    requiresAuth: requiresAuth(),
    authenticated,
  });
}

export async function POST(req: NextRequest) {
  const queueSecret = process.env.QUEUE_SECRET || process.env.HITL_PASS;
  
  // FAIL CLOSED: If no secret is configured, authentication always fails
  if (!queueSecret) {
    return NextResponse.json(
      { error: 'Queue authentication is not configured. Contact system administrator.' },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const { password } = body;

    if (password === queueSecret) {
      const response = NextResponse.json({ success: true });
      response.headers.set('Set-Cookie', createSessionCookie(queueSecret));
      return response;
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch (error) {
    console.error('[queue/auth] Error:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
