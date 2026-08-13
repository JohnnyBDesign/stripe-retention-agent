import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

/**
 * Hashes a password using bcrypt.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verifies a password against a hash.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Validates password strength.
 * Minimum 8 characters for now - can be enhanced later.
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}
