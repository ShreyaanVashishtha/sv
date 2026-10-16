import { NextRequest, NextResponse } from 'next/server';
import { getContent, saveContent } from '@/lib/content';
import { verifySession } from '@/lib/auth';
import { redis } from '@/lib/redis';

const REDIS_BIOMETRICS_KEY = 'sv7_biometric_credentials';

export async function POST(request: NextRequest) {
  try {
    const isAuth = await verifySession(request);
    if (!isAuth) {
      return NextResponse.json(
        { error: 'Unauthorized: You must be signed in with your Master Passkey to register biometrics' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const credentialId = (body.credentialId || '').toString().trim();

    if (!credentialId) {
      return NextResponse.json(
        { error: 'Credential ID is required' },
        { status: 400 }
      );
    }

    // Save to content settings
    const content = await getContent();
    const existing = content.settings.biometricCredentialIds || [];
    if (!existing.includes(credentialId)) {
      content.settings.biometricCredentialIds = [...existing, credentialId];
      await saveContent(content);
    }

    // Also persist in Redis
    if (redis) {
      try {
        await redis.sadd(REDIS_BIOMETRICS_KEY, credentialId);
      } catch (redisErr) {
        console.warn('Failed saving biometrics to Redis:', redisErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Fingerprint / Touch ID Passkey registered successfully on this device!',
      credentialId,
    });
  } catch (error) {
    console.error('Error in biometrics register:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
