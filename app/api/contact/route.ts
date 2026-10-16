import { NextRequest, NextResponse } from 'next/server';
import { getMessages, saveMessage, deleteMessage, markMessageRead } from '@/lib/messages';
import { verifySession } from '@/lib/auth';
import { getContent } from '@/lib/content';

// Public endpoint to receive contact inquiries without exposing personal email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!email || !message) {
      return NextResponse.json(
        { error: 'Email and message are required.' },
        { status: 400 }
      );
    }

    const saved = saveMessage({
      name: (name || 'Anonymous Visitor').trim(),
      email: email.trim(),
      subject: (subject || 'General Inquiry via sv7.dev').trim(),
      message: message.trim(),
    });

    // Optional webhook notification (e.g. Discord, Telegram, or Slack)
    try {
      const content = getContent();
      const webhookUrl = (content.settings.contact as any)?.webhookUrl;
      if (webhookUrl && webhookUrl.startsWith('http')) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `📬 **New sv7.dev Inquiry**\n**From:** ${saved.name} (${saved.email})\n**Subject:** ${saved.subject}\n**Message:**\n${saved.message}`,
          }),
        });
      }
    } catch (webhookErr) {
      console.warn('Webhook notification failed, message still saved:', webhookErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been securely delivered.',
      id: saved.id,
    });
  } catch (error) {
    console.error('Error handling contact submission:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Protected admin endpoints to read, mark read, or delete messages
export async function GET() {
  const isAuthenticated = verifySession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const messages = getMessages();
  return NextResponse.json({ messages });
}

export async function DELETE(request: NextRequest) {
  const isAuthenticated = verifySession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
  }

  const success = deleteMessage(id);
  return NextResponse.json({ success });
}

export async function PATCH(request: NextRequest) {
  const isAuthenticated = verifySession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
  }

  const success = markMessageRead(id);
  return NextResponse.json({ success });
}
