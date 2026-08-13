import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const queueSecret = process.env.QUEUE_SECRET || process.env.HITL_PASS;
  
  if (!queueSecret) {
    return NextResponse.json({ requiresAuth: false, authenticated: true });
  }

  const keyParam = req.headers.get('x-queue-key');
  
  if (keyParam === queueSecret) {
    return NextResponse.json({ requiresAuth: true, authenticated: true });
  }

  return NextResponse.json({ requiresAuth: true, authenticated: false });
}

export async function POST(req: NextRequest) {
  const queueSecret = process.env.QUEUE_SECRET || process.env.HITL_PASS;
  
  if (!queueSecret) {
    return NextResponse.json({ success: true });
  }

  try {
    const body = await req.json();
    const { password } = body;

    if (password === queueSecret) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch (error) {
    console.error('[queue/auth] Error:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
