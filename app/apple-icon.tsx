import { ImageResponse } from 'next/og';
import { getContent } from '@/lib/content';

export const runtime = 'nodejs';
export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default async function AppleIcon() {
  let badgeText = 'SV7';
  try {
    const data = await getContent();
    if (data.settings?.header?.logoBadge) {
      badgeText = data.settings.header.logoBadge.trim().toUpperCase();
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
          borderRadius: '40px',
          border: '8px solid #09090b',
          color: '#09090b',
          fontFamily: '"Arial Black", Impact, system-ui, sans-serif',
          fontWeight: 900,
          fontSize: badgeText.length > 3 ? '66px' : '82px',
          letterSpacing: '-3px',
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
