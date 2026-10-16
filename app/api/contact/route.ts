import { NextRequest, NextResponse } from 'next/server';
import { getMessages, saveMessage, deleteMessage, markMessageRead } from '@/lib/messages';
import { verifySession } from '@/lib/auth';
import { getContent } from '@/lib/content';

function escapeHtml(text: string): string {
  return (text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

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

    const saved = await saveMessage({
      name: (name || 'Anonymous Visitor').trim(),
      email: email.trim(),
      subject: (subject || 'General Inquiry via sv7.dev').trim(),
      message: message.trim(),
    });

    const content = await getContent();

    // 1. Send Email Notification via Resend if RESEND_API_KEY is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    const notificationRecipient =
      process.env.NOTIFICATION_EMAIL ||
      (content.settings.contact as any)?.notificationEmail ||
      content.profile.email;

    if (resendApiKey && notificationRecipient) {
      try {
        const fromAddress =
          process.env.EMAIL_FROM ||
          'sv7.dev Dispatches <onboarding@resend.dev>';

        const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; color: #fafafa; margin: 0; padding: 24px; }
    .card { background-color: #121215; border: 1px solid #27272a; border-radius: 16px; padding: 24px; max-width: 580px; margin: 0 auto; }
    .header { border-bottom: 1px solid #27272a; padding-bottom: 16px; margin-bottom: 20px; }
    .brand { font-size: 11px; font-family: monospace; color: #10b981; letter-spacing: 0.05em; text-transform: uppercase; font-weight: bold; }
    .title { font-size: 18px; font-weight: bold; margin: 6px 0 0 0; color: #ffffff; }
    .field { margin-bottom: 16px; }
    .label { font-size: 11px; font-family: monospace; color: #a1a1aa; text-transform: uppercase; margin-bottom: 4px; }
    .value { font-size: 14px; color: #ffffff; }
    .message-box { background-color: #09090b; border: 1px solid #27272a; border-radius: 12px; padding: 16px; font-size: 14px; line-height: 1.6; color: #e4e4e7; white-space: pre-wrap; }
    .button { display: inline-block; background-color: #ffffff; color: #000000; text-decoration: none; font-weight: 600; font-size: 13px; padding: 12px 20px; border-radius: 10px; margin-top: 20px; }
    .footer { font-size: 11px; font-family: monospace; color: #71717a; margin-top: 24px; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="brand">&#9679; sv7.dev Dispatch Received</div>
      <div class="title">${escapeHtml(saved.subject)}</div>
    </div>
    <div class="field">
      <div class="label">Sender Name</div>
      <div class="value">${escapeHtml(saved.name)}</div>
    </div>
    <div class="field">
      <div class="label">Sender Email</div>
      <div class="value"><a href="mailto:${escapeHtml(saved.email)}" style="color: #38bdf8;">${escapeHtml(saved.email)}</a></div>
    </div>
    <div class="field">
      <div class="label">Message</div>
      <div class="message-box">${escapeHtml(saved.message)}</div>
    </div>
    <div>
      <a class="button" href="mailto:${escapeHtml(saved.email)}?subject=Re:%20${encodeURIComponent(saved.subject)}">Reply to ${escapeHtml(saved.name)}</a>
    </div>
    <div class="footer">Delivered securely via sv7.dev contact API</div>
  </div>
</body>
</html>
`;

        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromAddress,
            to: [notificationRecipient],
            reply_to: saved.email,
            subject: `[sv7.dev Inquiry] ${saved.subject} (from ${saved.name})`,
            html: emailHtml,
          }),
        });
      } catch (emailErr) {
        console.warn('Resend email alert failed, inquiry still saved:', emailErr);
      }
    }

    // 2. Optional webhook notification (e.g. Discord, Telegram, or Slack)
    try {
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
export async function GET(request: NextRequest) {
  const isAuthenticated = await verifySession(request);
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const messages = await getMessages();
  return NextResponse.json({ messages });
}

export async function DELETE(request: NextRequest) {
  const isAuthenticated = await verifySession(request);
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
  }

  const success = await deleteMessage(id);
  return NextResponse.json({ success });
}

export async function PATCH(request: NextRequest) {
  const isAuthenticated = await verifySession(request);
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
  }

  const success = await markMessageRead(id);
  return NextResponse.json({ success });
}
