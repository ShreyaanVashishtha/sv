import { NextRequest, NextResponse } from 'next/server';
import { getContent } from '@/lib/content';
import { createSessionToken, verifySession, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function GET() {
  const isAuthenticated = verifySession();
  return NextResponse.json({ authenticated: isAuthenticated });
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const content = getContent();

    if (!password || password !== content.settings.adminPassword) {
      return NextResponse.json(
        { error: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    const token = createSessionToken(content.settings.adminPassword);
    const response = NextResponse.json({ success: true, message: 'Logged in successfully' });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}
