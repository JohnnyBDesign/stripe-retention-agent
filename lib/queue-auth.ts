import { NextRequest, NextResponse } from 'next/server';

const QUEUE_SESSION_COOKIE = 'queue_session';
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours

/**
 * Verifies queue authentication. Always fails closed if QUEUE_SECRET is not set.
 * Returns true if authenticated, false otherwise.
 */
export function verifyQueueAuth(req: NextRequest): boolean {
  const queueSecret = process.env.QUEUE_SECRET || process.env.HITL_PASS;
  
  // FAIL CLOSED: If no secret is configured, authentication always fails
  if (!queueSecret) {
    return false;
  }

  // Check for session cookie
  const sessionCookie = req.cookies.get(QUEUE_SESSION_COOKIE);
  if (sessionCookie && sessionCookie.value === queueSecret) {
    return true;
  }

  // Check for x-queue-key header (for direct access with key param)
  const keyHeader = req.headers.get('x-queue-key');
  if (keyHeader === queueSecret) {
    return true;
  }

  return false;
}

/**
 * Creates a session cookie for successful authentication.
 */
export function createSessionCookie(secret: string): string {
  return `${QUEUE_SESSION_COOKIE}=${secret}; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_MAX_AGE}; Path=/`;
}

/**
 * Returns whether the queue requires authentication.
 * Always returns true to enforce authentication (fail closed).
 */
export function requiresAuth(): boolean {
  return true;
}

/**
 * Creates an unauthorized response.
 */
export function unauthorizedResponse(): NextResponse {
  return NextResponse.json(
    { error: 'Unauthorized. Queue access requires authentication.' },
    { status: 401 }
  );
}
