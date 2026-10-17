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
  let logoStyle: string = 'monoline';

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

  // Stencil style
  if (logoStyle === 'stencil') {
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
            padding: '4px',
          }}
        >
          <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none">
            <g fill="#09090b">
              <path d="M6 10.5 H13 V13.5 H9 V15 H13 V23.5 H6 V20.5 H10 V19 H6 Z" />
              <path d="M14.5 10.5 H18 L20.5 20 L23 10.5 H26.5 L22.5 23.5 H18.5 Z" />
              <path d="M26.5 10.5 H33 L28 23.5 H24.5 L29 13.5 H26.5 Z" />
            </g>
          </svg>
        </div>
      ),
      { ...size }
    );
  }

  // Exponent style
  if (logoStyle === 'exponent') {
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
            padding: '4px',
          }}
        >
          <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none">
            <g fill="#09090b">
              <path d="M5.5 12 H13.5 C14.3 12 15 12.7 15 13.5 V15.5 C15 16.3 14.3 17 13.5 17 H8.5 V21.5 H15 V24.5 H5.5 Z" />
              <path d="M16 12 H19.5 L22.5 21 L25.5 12 H29 L24.5 24.5 H20.5 Z" />
              <path d="M24 7.5 H31 L27.5 15.5 H25 L27.8 9.8 H24 Z" />
            </g>
          </svg>
        </div>
      ),
      { ...size }
    );
  }

  // Default: Mach-7 Aerodynamic Monoline SV7 (Unmistakable S, V, 7)
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
          padding: '3px',
        }}
      >
        <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none">
          <g
            fill="none"
            stroke="#09090b"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M13 10.5 H8.5 C7.1 10.5 6 11.6 6 13 C6 14.4 7.1 15.5 8.5 15.5 H11 C12.4 15.5 13.5 16.6 13.5 18 C13.5 19.4 12.4 20.5 11 20.5 H6.5" />
            <path d="M14.5 11 L18.5 24.5 L22.5 11 H29.5 L24 24.5" />
          </g>
        </svg>
      </div>
    ),
    { ...size }
  );
}
