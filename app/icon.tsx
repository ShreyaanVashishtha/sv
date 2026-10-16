import { ImageResponse } from 'next/og';
import { getContent } from '@/lib/content';

export const runtime = 'nodejs';
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default async function Icon() {
  let badgeText = 'SV7';
  try {
    const data = await getContent();
    if (data.settings?.header?.logoBadge) {
      badgeText = data.settings.header.logoBadge.trim().toUpperCase();
    }
  } catch (e) {
    // fallback to default
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
          borderRadius: '7px',
          border: '1.5px solid #09090b',
          color: '#09090b',
          fontFamily: '"Arial Black", Impact, system-ui, sans-serif',
          fontWeight: 900,
          fontSize: badgeText.length > 3 ? '11px' : '14px',
          letterSpacing: '-1px',
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
