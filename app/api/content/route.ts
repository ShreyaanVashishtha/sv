import { NextRequest, NextResponse } from 'next/server';
import { getContent, saveContent } from '@/lib/content';
import { verifySession } from '@/lib/auth';
import { WebsiteData } from '@/types/content';
import { isRedisConfigured } from '@/lib/redis';

export async function GET() {
  try {
    const data = await getContent();
    const isAuthenticated = await verifySession();

    if (!isAuthenticated) {
      // Mask admin password when exposed publicly
      const sanitized = {
        ...data,
        settings: {
          ...data.settings,
          adminPassword: '', // do not expose
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
    const isAuthenticated = await verifySession();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updatedData = (await request.json()) as WebsiteData;
    const currentData = await getContent();

    // Preserve existing password if not modified in payload
    if (!updatedData.settings.adminPassword) {
      updatedData.settings.adminPassword = currentData.settings.adminPassword;
    }

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
