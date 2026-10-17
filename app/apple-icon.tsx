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
  let logoStyle: string = 'classic';

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

  // 1. Classic style fallback: solid white square with bold text
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

  // 2. Supersonic Nozzle: Two opposing aerodynamic chevrons
  if (logoStyle === 'nozzle') {
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
            padding: '24px',
          }}
        >
          <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none">
            <g fill="#09090b">
              <path d="M8 9 L18 13 L28 9 L28 12.5 L18 16.5 L8 12.5 Z" />
              <path d="M8 27 L18 23 L28 27 L28 23.5 L18 19.5 L8 23.5 Z" />
            </g>
          </svg>
        </div>
      ),
      { ...size }
    );
  }

  // 3. Polestar Guidance Vector: Opposing 45° diagonal aerodynamic chevrons
  if (logoStyle === 'polestar') {
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
            padding: '24px',
          }}
        >
          <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none">
            <g fill="#09090b" transform="rotate(45 18 18)">
              <path d="M8 9 L18 13 L28 9 L28 12.5 L18 16.5 L8 12.5 Z" />
              <path d="M8 27 L18 23 L28 27 L28 23.5 L18 19.5 L8 23.5 Z" />
            </g>
          </svg>
        </div>
      ),
      { ...size }
    );
  }

  // 4. Mach Diamond: Concentric precision diamond
  if (logoStyle === 'diamond') {
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
            padding: '24px',
          }}
        >
          <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none">
            <g fill="#09090b" fillRule="evenodd">
              <path d="M18 7 L29 18 L18 29 L7 18 Z M18 11.5 L24.5 18 L18 24.5 L11.5 18 Z" />
              <rect x="15.5" y="15.5" width="5" height="5" rx="0.5" transform="rotate(45 18 18)" />
            </g>
          </svg>
        </div>
      ),
      { ...size }
    );
  }

  // 5. Square CAD Datum: Concentric upright geometry
  if (logoStyle === 'square') {
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
            padding: '24px',
          }}
        >
          <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none">
            <g fill="#09090b" fillRule="evenodd">
              <path d="M8 8 H28 V28 H8 Z M11.5 11.5 H24.5 V24.5 H11.5 Z" />
              <rect x="14.5" y="14.5" width="7" height="7" rx="1.5" />
            </g>
          </svg>
        </div>
      ),
      { ...size }
    );
  }

  // 6. Mach Delta Chevron ('chevron' or 'delta'): Single razor-sharp supersonic delta wing
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
          padding: '24px',
        }}
      >
        <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none">
          <path
            d="M18 7.5 L28.5 26 H22.5 L18 18.5 L13.5 26 H7.5 Z"
            fill="#09090b"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
