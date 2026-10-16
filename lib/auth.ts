import { cookies } from 'next/headers';
import { getContent } from './content';

const SESSION_COOKIE_NAME = 'sv7_admin_session';

// Simple deterministic hash token for local session verification
export function createSessionToken(password: string): string {
  const secret = 'sv7_secret_key_salt';
  return Buffer.from(`${password}:${secret}:${new Date().toDateString()}`).toString('base64');
}

export async function verifySession(): Promise<boolean> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return false;

    const content = await getContent();
    const expectedPassword = process.env.ADMIN_PASSWORD || content.settings.adminPassword;
    const expectedToken = createSessionToken(expectedPassword);
    return token === expectedToken;
  } catch (error) {
    return false;
  }
}

export { SESSION_COOKIE_NAME };
