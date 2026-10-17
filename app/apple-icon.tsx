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
  let logoStyle: 'delta' | 'classic' = 'delta';

  try {
    const data = await getContent();
    if (data.settings?.header?.logoBadge) {
      badgeText = data.settings.header.logoBadge.trim().toUpperCase();
    }
    if (data.settings?.header?.logoStyle) {
      logoStyle = data.settings.header.logoStyle;
    }
  } catch (e) {
    // fallback
  }

  // Classic style fallback
  if (logoStyle === 'classic') {
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
            fontFamily: '"Arial Black", Impact, system-ui, sans-serif',
            fontWeight: 900,
            fontSize: badgeText.length > 3 ? '60px' : '76px',
            letterSpacing: '-2px',
          }}
        >
          {badgeText}
        </div>
      ),
      { ...size }
    );
  }

  // Refined Supersonic Delta style (High Contrast)
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
          padding: '28px',
        }}
      >
        <svg
          viewBox="0 0 32 32"
          width="100%"
          height="100%"
          fill="none"
        >
          <path
            d="M17 5 L26.5 25 H20.5 L17 18 V5 Z"
            fill="#09090b"
          />
          <path
            d="M15 9 L5.5 25 H11.5 L15 18 V9 Z"
            fill="#09090b"
          />
          <path
            d="M17 9 H23.5 L21.5 12.5 H17 V9 Z"
            fill="#09090b"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
