import { NextRequest, NextResponse } from 'next/server';
import { getContent } from '@/lib/content';
import { createSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';
import { redis } from '@/lib/redis';

const REDIS_BIOMETRICS_KEY = 'sv7_biometric_credentials';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const credentialId = (body.credentialId || '').toString().trim();

    if (!credentialId) {
      return NextResponse.json(
        { error: 'Biometric credential ID is required' },
        { status: 400 }
      );
    }

    const content = await getContent();
    let validIds: string[] = content.settings.biometricCredentialIds || [];

    if (redis) {
      try {
        const redisCreds = await redis.smembers(REDIS_BIOMETRICS_KEY);
        if (redisCreds && Array.isArray(redisCreds)) {
          validIds = Array.from(new Set([...validIds, ...redisCreds]));
        }
      } catch (redisErr) {
        console.warn('Failed querying redis for biometrics:', redisErr);
      }
    }

    // Check if the credential ID is registered
    const isValid = validIds.includes(credentialId);
    if (!isValid) {
      return NextResponse.json(
        {
          error:
            'Unrecognized fingerprint passkey. Please sign in with your Master Passkey first, then register this device in Settings.',
        },
        { status: 401 }
      );
    }

    // Verification successful: issue 30-day session token!
    const token = createSessionToken();
    const response = NextResponse.json({
      success: true,
      message: 'Fingerprint verified! Welcome back.',
      token,
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Error in biometrics verify:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
