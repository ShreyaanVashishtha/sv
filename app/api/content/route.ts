import { NextRequest, NextResponse } from 'next/server';
import { getContent, saveContent } from '@/lib/content';
import { verifySession } from '@/lib/auth';
import { WebsiteData } from '@/types/content';
import { isRedisConfigured } from '@/lib/redis';

export async function GET(request: NextRequest) {
  try {
    const data = await getContent();
    const isAuthenticated = await verifySession(request);

    if (!isAuthenticated) {
      // Mask admin passkey when exposed publicly
      const sanitized = {
        ...data,
        settings: {
          ...data.settings,
          adminPassword: '', // do not expose
          adminPasskey: '', // do not expose
        },
      };
      return NextResponse.json(sanitized);
    }

    return NextResponse.json({
      ...data,
      isDatabaseConnected: isRedisConfigured,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve website data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await verifySession(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized: Session expired or invalid. Please re-enter your master passkey.' },
        { status: 401 }
      );
    }

    const updatedData = (await request.json()) as WebsiteData;
    const currentData = await getContent();

    // STRICT CHECK: Disallow setting passkey to "admin"
    if (
      updatedData.settings.adminPasskey &&
      updatedData.settings.adminPasskey.trim().toLowerCase() === 'admin'
    ) {
      return NextResponse.json(
        { error: "The passkey cannot be set to 'admin'. Please choose a secure passkey." },
        { status: 400 }
      );
    }

    // Preserve existing passkey if not explicitly changed
    if (!updatedData.settings.adminPasskey) {
      updatedData.settings.adminPasskey =
        currentData.settings.adminPasskey || 'sv7-passkey-2026';
    }

    // Keep legacy adminPassword synced with adminPasskey for backwards compatibility
    updatedData.settings.adminPassword = updatedData.settings.adminPasskey;

    const success = await saveContent(updatedData);
    if (!success) {
      return NextResponse.json({ error: 'Failed to write content to storage' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: updatedData,
      isDatabaseConnected: isRedisConfigured,
    });
  } catch (error) {
    console.error('Error saving content:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
