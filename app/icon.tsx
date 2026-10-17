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
            borderRadius: '8px',
            color: '#09090b',
            fontFamily: '"Arial Black", Impact, system-ui, sans-serif',
            fontWeight: 900,
            fontSize: badgeText.length > 3 ? '10px' : '13px',
            letterSpacing: '-0.5px',
          }}
        >
          {badgeText}
        </div>
      ),
      { ...size }
    );
  }

  // Supersonic Delta style
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#09090b',
          borderRadius: '7px',
          border: '1px solid rgba(255, 255, 255, 0.22)',
          padding: '3px',
        }}
      >
        <svg
          viewBox="0 0 36 36"
          width="100%"
          height="100%"
          fill="none"
        >
          <path
            d="M9 10.5 H16.2 L11.6 17.5 H17.8 L12.2 26 H7.5 L12.5 18.8 H7.8 Z"
            fill="#FFFFFF"
          />
          <path
            d="M18.8 10.5 H28.5 L19.2 26 H14.4 L23.2 14.2 H18.8 Z"
            fill="#FFFFFF"
          />
          <circle cx="18.5" cy="7.2" r="1.1" fill="#FFFFFF" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
