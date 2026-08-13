import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production';
const JWT_EXPIRES_IN = '7d'; // 7 days

export interface TokenPayload {
  userId: string;
  email: string;
}

/**
 * Creates a JWT token for a user.
 */
export function createToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Verifies and decodes a JWT token.
 * Returns null if the token is invalid or expired.
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Creates a magic link token (short-lived, single-use).
 */
export function createMagicLinkToken(email: string): string {
  return jwt.sign({ email, type: 'magic-link' }, JWT_SECRET, {
    expiresIn: '15m', // 15 minutes
  });
}

/**
 * Verifies a magic link token.
 */
export function verifyMagicLinkToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string; type: string };
    if (decoded.type === 'magic-link') {
      return decoded.email;
    }
    return null;
  } catch (error) {
    return null;
  }
}
