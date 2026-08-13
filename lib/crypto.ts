import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

/**
 * Gets the encryption key from environment variable.
 * In production, this should be a secure 32-byte key.
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is required');
  }
  
  // If the key is shorter than 32 bytes, pad it
  // In production, you should use a proper 32-byte key
  const keyBuffer = Buffer.from(key, 'utf-8');
  if (keyBuffer.length < KEY_LENGTH) {
    return Buffer.concat([keyBuffer, Buffer.alloc(KEY_LENGTH - keyBuffer.length, 0)]);
  }
  
  return keyBuffer.slice(0, KEY_LENGTH);
}

/**
 * Encrypts a Stripe API key for secure storage.
 * Returns a base64-encoded string containing: iv + authTag + encryptedData
 */
export function encryptStripeKey(stripeKey: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(stripeKey, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  const authTag = cipher.getAuthTag();
  
  // Combine iv + authTag + encrypted data
  const combined = Buffer.concat([iv, authTag, encrypted]);
  
  return combined.toString('base64');
}

/**
 * Decrypts a Stripe API key from storage.
 * Takes a base64-encoded string and returns the original Stripe key.
 */
export function decryptStripeKey(encryptedKey: string): string {
  const key = getEncryptionKey();
  const combined = Buffer.from(encryptedKey, 'base64');
  
  // Extract iv, authTag, and encrypted data
  const iv = combined.slice(0, IV_LENGTH);
  const authTag = combined.slice(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const encrypted = combined.slice(IV_LENGTH + AUTH_TAG_LENGTH);
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted.toString('utf8');
}

/**
 * Extracts the last 4 characters of a Stripe key for display.
 */
export function getStripeKeyLast4(stripeKey: string): string {
  return stripeKey.slice(-4);
}
