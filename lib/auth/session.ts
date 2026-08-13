import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, TokenPayload } from './jwt';
import { prisma } from '@/lib/db';

const SESSION_COOKIE = 'signal_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Gets the current user from the request.
 * Returns null if not authenticated.
 */
export async function getCurrentUser(req: NextRequest): Promise<TokenPayload | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  
  if (!token) {
    return null;
  }
  
  const payload = verifyToken(token);
  
  if (!payload) {
    return null;
  }
  
  // Verify user still exists
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true },
  });
  
  if (!user) {
    return null;
  }
  
  return payload;
}

/**
 * Creates a session cookie for a user.
 */
export function createSessionCookie(token: string): string {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return `${SESSION_COOKIE}=${token}; HttpOnly; ${isProduction ? 'Secure;' : ''} SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}; Path=/`;
}

/**
 * Clears the session cookie.
 */
export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Max-Age=0; Path=/`;
}

/**
 * Creates an unauthorized response.
 */
export function unauthorizedResponse(message: string = 'Unauthorized'): NextResponse {
  return NextResponse.json(
    { error: message },
    { status: 401 }
  );
}

/**
 * Requires authentication middleware.
 * Returns user payload if authenticated, otherwise returns an error response.
 */
export async function requireAuth(req: NextRequest): Promise<TokenPayload | NextResponse> {
  const user = await getCurrentUser(req);
  
  if (!user) {
    return unauthorizedResponse();
  }
  
  return user;
}
