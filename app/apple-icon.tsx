import { ImageResponse } from 'next/og';
import { getContent } from '@/lib/content';

export const runtime = 'nodejs';
export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default async function AppleIcon() {
  let badgeText = 'sv7';
  try {
    const data = await getContent();
    if (data.settings?.header?.logoBadge) {
      badgeText = data.settings.header.logoBadge.trim();
    }
  } catch (e) {
    // fallback
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          borderRadius: '44px',
          color: '#09090b',
          fontFamily: 'monospace, sans-serif',
          fontWeight: 900,
          fontSize: badgeText.length > 3 ? '60px' : '72px',
          letterSpacing: '-2px',
        }}
      >
        {badgeText}
      </div>
    ),
    {
      ...size,
    }
  );
}
