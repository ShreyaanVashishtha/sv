import { NextRequest, NextResponse } from 'next/server';
import {
  createSessionToken,
  verifySession,
  verifyPasskey,
  SESSION_COOKIE_NAME,
} from '@/lib/auth';

export async function GET(request: NextRequest) {
  const isAuthenticated = await verifySession(request);
  return NextResponse.json({ authenticated: isAuthenticated });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const candidate = (body.passkey || body.password || '').toString().trim();

    if (!candidate) {
      return NextResponse.json(
        { error: 'Master passkey is required' },
        { status: 400 }
      );
    }

    // STRICT CHECK: The default password 'admin' is permanently disallowed
    if (candidate.toLowerCase() === 'admin') {
      return NextResponse.json(
        {
          error:
            "The default password 'admin' is permanently disabled for security. Please enter your secure Master Passkey.",
        },
        { status: 401 }
      );
    }

    const isValid = await verifyPasskey(candidate);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid master passkey. Please check and try again.' },
        { status: 401 }
      );
    }

    const token = createSessionToken();
    const response = NextResponse.json({
      success: true,
      message: 'Authenticated successfully with Master Passkey',
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
    console.error('Error in auth route POST:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}
