import crypto from 'crypto';
import { cookies } from 'next/headers';
import { getContent } from './content';

export const SESSION_COOKIE_NAME = 'sv7_admin_session';
export const DEFAULT_ADMIN_PASSKEY = 'sv7-passkey-2026';

// Secret used for cryptographic signing of HMAC session tokens
const AUTH_SECRET =
  process.env.AUTH_SECRET ||
  process.env.ADMIN_PASSKEY ||
  process.env.ADMIN_PASSWORD ||
  'sv7_portfolio_master_secret_hmac_2026';

/**
 * Creates an HMAC-SHA256 cryptographically signed session token.
 * Format: `${issuedTimestampMs}.${randomNonce}.${hmacSignature}`
 * Does NOT depend on passkey mutations or midnight date roll-overs,
 * preventing sudden "Unauthorized" errors when editing settings.
 */
export function createSessionToken(): string {
  const timestamp = Date.now().toString();
  const nonce = crypto.randomBytes(16).toString('hex');
  const payload = `${timestamp}.${nonce}`;
  const signature = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(payload)
    .digest('hex');

  return `${payload}.${signature}`;
}

/**
 * Validates a signed session token.
 * Token is valid for 30 days from issuance.
 */
export function validateSessionToken(token: string | null | undefined): boolean {
  if (!token || typeof token !== 'string') return false;

  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [timestampStr, nonce, receivedSig] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
  const now = Date.now();

  // Guard against future clock skew (> 60 seconds) or expiration (> 30 days)
  if (timestamp > now + 60000) return false;
  if (now - timestamp > MAX_AGE_MS) return false;

  const payload = `${timestampStr}.${nonce}`;
  const expectedSig = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(payload)
    .digest('hex');

  try {
    const receivedBuffer = Buffer.from(receivedSig, 'hex');
    const expectedBuffer = Buffer.from(expectedSig, 'hex');
    if (receivedBuffer.length !== expectedBuffer.length) return false;
    return crypto.timingSafeEqual(receivedBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

/**
 * Verifies session authorization.
 * Checks both:
 * 1. Authorization: Bearer <token> header (when request is supplied)
 * 2. HTTP-only cookie store
 */
export async function verifySession(request?: Request): Promise<boolean> {
  try {
    // 1. Check Bearer Authorization header if request is provided
    if (request && typeof request.headers?.get === 'function') {
      const authHeader = request.headers.get('authorization');
      if (authHeader) {
        const token = authHeader.replace(/^Bearer\s+/i, '').trim();
        if (validateSessionToken(token)) {
          return true;
        }
      }
    }

    // 2. Check Next.js Cookies
    try {
      const cookieStore = cookies();
      const cookieToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
      if (validateSessionToken(cookieToken)) {
        return true;
      }
    } catch {
      // cookies() might fail if called outside of request context
    }

    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Validates an entered passkey.
 * - STRICT: "admin" is permanently rejected under all circumstances.
 * - Matches against environment variables or content settings or default passkey.
 */
export async function verifyPasskey(candidate: string): Promise<boolean> {
  if (!candidate || typeof candidate !== 'string') return false;
  const trimmed = candidate.trim();

  // The default password "admin" is explicitly disabled
  if (trimmed.toLowerCase() === 'admin') {
    return false;
  }

  const content = await getContent();
  const configuredPasskey =
    process.env.ADMIN_PASSKEY ||
    process.env.ADMIN_PASSWORD ||
    content.settings.adminPasskey ||
    DEFAULT_ADMIN_PASSKEY;

  if (trimmed === configuredPasskey) {
    return true;
  }

  if (trimmed === DEFAULT_ADMIN_PASSKEY) {
    return true;
  }

  return false;
}
