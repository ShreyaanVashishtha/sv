import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getContent, saveContent } from '@/lib/content';
import { verifySession } from '@/lib/auth';
import { redis } from '@/lib/redis';

const REDIS_BIOMETRICS_KEY = 'sv7_biometric_credentials';

export async function GET() {
  try {
    const content = await getContent();
    let credentialIds: string[] = content.settings.biometricCredentialIds || [];

    // Also check Redis if available
    if (redis) {
      try {
        const redisCreds = await redis.smembers(REDIS_BIOMETRICS_KEY);
        if (redisCreds && Array.isArray(redisCreds) && redisCreds.length > 0) {
          credentialIds = Array.from(new Set([...credentialIds, ...redisCreds]));
        }
      } catch (redisErr) {
        console.warn('Failed reading biometrics from redis:', redisErr);
      }
    }

    const challenge = crypto.randomBytes(32).toString('base64');

    return NextResponse.json({
      challenge,
      isConfigured: credentialIds.length > 0,
      credentialIds,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to prepare biometrics' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const isAuth = await verifySession(request);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const content = await getContent();
    content.settings.biometricCredentialIds = [];
    await saveContent(content);

    if (redis) {
      try {
        await redis.del(REDIS_BIOMETRICS_KEY);
      } catch (redisErr) {
        console.warn('Failed to clear biometrics in redis:', redisErr);
      }
    }

    return NextResponse.json({ success: true, message: 'Biometric passkeys removed' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
