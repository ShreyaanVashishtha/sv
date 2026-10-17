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

  // 1B. Parabolic Bell Nozzle
  if (logoStyle === 'nozzle-bell') {
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
              <path d="M8 9.5 Q13 11 18 13.5 Q23 11 28 9.5 L28 12.5 Q23 14 18 16.5 Q13 14 8 12.5 Z" />
              <path d="M8 26.5 Q13 25 18 22.5 Q23 25 28 26.5 L28 23.5 Q23 22 18 19.5 Q13 22 8 23.5 Z" />
            </g>
          </svg>
        </div>
      ),
      { ...size }
    );
  }

  // 1C. Injector Datum Core
  if (logoStyle === 'nozzle-core') {
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
              <rect x="16.5" y="16.5" width="3" height="3" rx="0.5" transform="rotate(45 18 18)" />
            </g>
          </svg>
        </div>
      ),
      { ...size }
    );
  }

  // 1D. Vertical Thrust Column
  if (logoStyle === 'nozzle-column') {
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
              <path d="M9 27.5 L14 18 L9 8.5 L12.5 8.5 L17 18 L12.5 27.5 Z" />
              <path d="M27 27.5 L22 18 L27 8.5 L23.5 8.5 L19 18 L23.5 27.5 Z" />
            </g>
          </svg>
        </div>
      ),
      { ...size }
    );
  }

  // 2A. Polestar Guidance Vector (Diagonal)
  if (logoStyle === 'polestar' || logoStyle === 'vector-polestar') {
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
              <path d="M8 9 L18 13.5 L28 9 L28 12.5 L18 17 L8 12.5 Z" />
              <path d="M8 27 L18 22.5 L28 27 L28 23.5 L18 19 L8 23.5 Z" />
            </g>
          </svg>
        </div>
      ),
      { ...size }
    );
  }

  // 2B. Kinetic Forward Vector
  if (logoStyle === 'vector-kinetic') {
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
              <path d="M7 7.5 L18 14 L29 7.5 L29 11 L18 17.5 L7 11 Z" />
              <path d="M10 27.5 L18 23.5 L26 27.5 L26 24.5 L18 20.5 L10 24.5 Z" />
            </g>
          </svg>
        </div>
      ),
      { ...size }
    );
  }

  // 2C. Stratified Multi-Shock Wave
  if (logoStyle === 'vector-shock') {
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
              <path d="M7 8 L18 12.5 L29 8 L29 10.5 L18 15 L7 10.5 Z" />
              <path d="M7 28 L18 23.5 L29 28 L29 25.5 L18 21 L7 25.5 Z" />
              <path d="M11 14.5 L18 17 L25 14.5 L25 16 L18 18.5 L11 16 Z" />
              <path d="M11 21.5 L18 19 L25 21.5 L25 20 L18 17.5 L11 20 Z" />
            </g>
          </svg>
        </div>
      ),
      { ...size }
    );
  }

  // M1. Monolith Stealth Tri-Vector (S-N-V)
  if (logoStyle === 'monolith-tri') {
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
            borderRadius: '44px',
            border: '2px solid #3f3f46',
            padding: '24px',
          }}
        >
          <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none">
            <g fill="#ffffff">
              <path d="M10 9 H18 L24 13.5 L24 16 L18 16 L14 13 L10 13 Z" />
              <path d="M11 15 L14 15 L25 23 L22 23 Z" />
              <path d="M12 27 L18 22.5 L24 27 L24 24 L18 19.5 L12 24 Z" />
            </g>
          </svg>
        </div>
      ),
      { ...size }
    );
  }

  // M2. Monolith Continuous Mach Ribbon
  if (logoStyle === 'monolith-ribbon') {
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
            borderRadius: '44px',
            border: '2px solid #3f3f46',
            padding: '24px',
          }}
        >
          <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none">
            <path
              d="M10 9 H20 L15 14 H22 L22 17 L14 23 H21 L18 27.5 L12 27.5 L15 23 H8 L16 17 H9 L14 12 H10 Z"
              fill="#ffffff"
              fillRule="evenodd"
            />
          </svg>
        </div>
      ),
      { ...size }
    );
  }

  // M3. Monolith Laser Blueprint Superimposed
  if (logoStyle === 'monolith-blueprint') {
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
            borderRadius: '44px',
            border: '2px solid #3f3f46',
            padding: '24px',
          }}
        >
          <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none">
            <g fill="#ffffff" transform="rotate(45 18 18)">
              <path d="M8 9 L18 13.5 L28 9 L28 12.5 L18 17 L8 12.5 Z M12 10.5 H16 V11.5 H12 Z M20 14 H24 V15 H20 Z" fillRule="evenodd" />
              <rect x="17.2" y="16.5" width="1.6" height="3" />
              <path d="M8 27 L18 22.5 L28 27 L28 23.5 L18 19 L8 23.5 Z M17.2 21 H18.8 V25 H17.2 Z" fillRule="evenodd" />
            </g>
          </svg>
        </div>
      ),
      { ...size }
    );
  }

  // M4. Monolith Coordinate Crest
  if (logoStyle === 'monolith-crest') {
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
            borderRadius: '44px',
            border: '2px solid #3f3f46',
            padding: '24px',
          }}
        >
          <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none">
            <g fill="#ffffff">
              <path d="M12 8.5 H21 L16 12.5 H24 L24 14.5 H15 L20 10.5 H12 Z" />
              <path d="M10 16 H13.5 L22.5 21 H26 L26 16 H24 L24 19 L15 14 H10 Z" />
              <path d="M11 25.5 L18 21.5 L25 25.5 L25 23 L18 19 L11 23 Z" />
            </g>
          </svg>
        </div>
      ),
      { ...size }
    );
  }

  // 2D. Inverted Titanium Monolith (Baseline)
  if (logoStyle === 'vector-monolith') {
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
            borderRadius: '44px',
            border: '2px solid #3f3f46',
            padding: '24px',
          }}
        >
          <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none">
            <g fill="#ffffff" transform="rotate(45 18 18)">
              <path d="M8 9 L18 13.5 L28 9 L28 12.5 L18 17 L8 12.5 Z" />
              <path d="M8 27 L18 22.5 L28 27 L28 23.5 L18 19 L8 23.5 Z" />
            </g>
          </svg>
        </div>
      ),
      { ...size }
    );
  }

  // P1. Precision Monolith (High-DPI Retina Tune)
  if (logoStyle === 'precision-monolith' || logoStyle === 'p1-standard') {
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
            borderRadius: '44px',
            border: '2px solid #3f3f46',
            padding: '24px',
          }}
        >
          <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none">
            <g fill="#ffffff" transform="rotate(45 18 18)">
              <path d="M8 8.5 L18 13.5 L28 8.5 L28 12 L18 16.8 L8 12 Z" />
              <path d="M8 27.5 L18 22.5 L28 27.5 L28 24 L18 19.2 L8 24 Z" />
            </g>
          </svg>
        </div>
      ),
      { ...size }
    );
  }

  // P2. The Slim Razor Spec
  if (logoStyle === 'p2-slim') {
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
            borderRadius: '44px',
            border: '2px solid #3f3f46',
            padding: '24px',
          }}
        >
          <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none">
            <g fill="#ffffff" transform="rotate(45 18 18)">
              <path d="M8 9.5 L18 14.2 L28 9.5 L28 12 L18 16.7 L8 12 Z" />
              <path d="M8 26.5 L18 21.8 L28 26.5 L28 24 L18 19.3 L8 24 Z" />
            </g>
          </svg>
        </div>
      ),
      { ...size }
    );
  }

  // P3. Chamfered Wingtips
  if (logoStyle === 'p3-chamfer') {
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
            borderRadius: '44px',
            border: '2px solid #3f3f46',
            padding: '24px',
          }}
        >
          <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none">
            <g fill="#ffffff" transform="rotate(45 18 18)">
              <path d="M9.5 8.5 L18 13 L26.5 8.5 L28 10 L18 16.8 L8 10 Z" />
              <path d="M8 26 L18 19.2 L28 26 L26.5 27.5 L18 23 L9.5 27.5 Z" />
            </g>
          </svg>
        </div>
      ),
      { ...size }
    );
  }

  // P4. The Datum Core Reticle
  if (logoStyle === 'p4-datum') {
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
            borderRadius: '44px',
            border: '2px solid #3f3f46',
            padding: '24px',
          }}
        >
          <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none">
            <g fill="#ffffff" transform="rotate(45 18 18)">
              <path d="M8 8.5 L18 13.5 L28 8.5 L28 12 L18 16.8 L8 12 Z" />
              <path d="M8 27.5 L18 22.5 L28 27.5 L28 24 L18 19.2 L8 24 Z" />
              <rect x="16.9" y="16.9" width="2.2" height="2.2" rx="0.4" />
            </g>
          </svg>
        </div>
      ),
      { ...size }
    );
  }

  // P5. The Heavy Thrust Spec
  if (logoStyle === 'p5-bold') {
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
            borderRadius: '44px',
            border: '2px solid #3f3f46',
            padding: '24px',
          }}
        >
          <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none">
            <g fill="#ffffff" transform="rotate(45 18 18)">
              <path d="M7 7.5 L18 12.5 L29 7.5 L29 12 L18 16.7 L7 12 Z" />
              <path d="M7 28.5 L18 23.5 L29 28.5 L29 24 L18 19.3 L7 24 Z" />
            </g>
          </svg>
        </div>
      ),
      { ...size }
    );
  }

  // P6. Hypersonic Delta Cone
  if (logoStyle === 'p6-acute') {
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
            borderRadius: '44px',
            border: '2px solid #3f3f46',
            padding: '24px',
          }}
        >
          <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none">
            <g fill="#ffffff" transform="rotate(45 18 18)">
              <path d="M9 7 L18 14.5 L27 7 L27 10 L18 17.2 L9 10 Z" />
              <path d="M9 29 L18 21.5 L27 29 L27 26 L18 18.8 L9 26 Z" />
            </g>
          </svg>
        </div>
      ),
      { ...size }
    );
  }

  // H1. Hypersonic Heavy
  if (logoStyle === 'h1-hybrid') {
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
            borderRadius: '44px',
            border: '2px solid #3f3f46',
            padding: '24px',
          }}
        >
          <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none">
            <g fill="#ffffff" transform="rotate(45 18 18)">
              <path d="M8 7 L18 13.5 L28 7 L28 11.5 L18 17.2 L8 11.5 Z" />
              <path d="M8 29 L18 22.5 L28 29 L28 24.5 L18 18.8 L8 24.5 Z" />
            </g>
          </svg>
        </div>
      ),
      { ...size }
    );
  }

  // H2. Tapered Mach Airfoil
  if (logoStyle === 'h2-tapered') {
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
            borderRadius: '44px',
            border: '2px solid #3f3f46',
            padding: '24px',
          }}
        >
          <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none">
            <g fill="#ffffff" transform="rotate(45 18 18)">
              <path d="M8.5 8.5 L18 12.8 L27.5 8.5 L27.5 10.8 L18 17.2 L8.5 10.8 Z" />
              <path d="M8.5 27.5 L18 23.2 L27.5 27.5 L27.5 25.2 L18 18.8 L8.5 25.2 Z" />
            </g>
          </svg>
        </div>
      ),
      { ...size }
    );
  }

  // H3. Chamfered Hypersonic Wedge
  if (logoStyle === 'h3-chamfered') {
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
            borderRadius: '44px',
            border: '2px solid #3f3f46',
            padding: '24px',
          }}
        >
          <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none">
            <g fill="#ffffff" transform="rotate(45 18 18)">
              <path d="M9.5 7 L18 13 L26.5 7 L28 8.5 L18 17.2 L8 8.5 Z" />
              <path d="M8 27.5 L18 18.8 L28 27.5 L26.5 29 L18 23 L9.5 29 Z" />
            </g>
          </svg>
        </div>
      ),
      { ...size }
    );
  }

  // H4. Razor Slit Compression
  if (logoStyle === 'h4-knife') {
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
            borderRadius: '44px',
            border: '2px solid #3f3f46',
            padding: '24px',
          }}
        >
          <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none">
            <g fill="#ffffff" transform="rotate(45 18 18)">
              <path d="M8 7.5 L18 13.5 L28 7.5 L28 12 L18 17.4 L8 12 Z" />
              <path d="M8 28.5 L18 22.5 L28 28.5 L28 24 L18 18.6 L8 24 Z" />
            </g>
          </svg>
        </div>
      ),
      { ...size }
    );
  }

  // H5. Faceted Stealth Wedge
  if (logoStyle === 'h5-stealth') {
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
            borderRadius: '44px',
            border: '2px solid #3f3f46',
            padding: '24px',
          }}
        >
          <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none">
            <g fill="#ffffff" transform="rotate(45 18 18)">
              <path d="M8 8 L13 11 L18 14 L23 11 L28 8 L28 12 L23 14.5 L18 17.2 L13 14.5 L8 12 Z" />
              <path d="M8 28 L13 25 L18 22 L23 25 L28 28 L28 24 L23 21.5 L18 18.8 L13 21.5 L8 24 Z" />
            </g>
          </svg>
        </div>
      ),
      { ...size }
    );
  }

  // H6. Relief-Notched Choke
  if (logoStyle === 'h6-notch') {
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
            borderRadius: '44px',
            border: '2px solid #3f3f46',
            padding: '24px',
          }}
        >
          <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none">
            <g fill="#ffffff" transform="rotate(45 18 18)">
              <path d="M8 7 L18 13.5 L28 7 L28 11.5 L19 16.8 L17 16.8 L8 11.5 Z" />
              <path d="M8 29 L18 22.5 L28 29 L28 24.5 L19 19.2 L17 19.2 L8 24.5 Z" />
            </g>
          </svg>
        </div>
      ),
      { ...size }
    );
  }

  // TC-1. Tapered Airfoil × Chamfered Wedge (The Balanced Master)
  if (logoStyle === 'tc1-balanced') {
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
            borderRadius: '44px',
            border: '2px solid #3f3f46',
            padding: '24px',
          }}
        >
          <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none">
            <g fill="#ffffff" transform="rotate(45 18 18)">
              <path d="M9.5 7.5 L18 13.0 L26.5 7.5 L28 9.0 L18 17.2 L8 9.0 Z" />
              <path d="M8 27.0 L18 18.8 L28 27.0 L26.5 28.5 L18 23.0 L9.5 28.5 Z" />
            </g>
          </svg>
        </div>
      ),
      { ...size }
    );
  }

  // TC-2. Deep-Choke Compression
  if (logoStyle === 'tc2-choke') {
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
            borderRadius: '44px',
            border: '2px solid #3f3f46',
            padding: '24px',
          }}
        >
          <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none">
            <g fill="#ffffff" transform="rotate(45 18 18)">
              <path d="M9.5 7.5 L18 13.0 L26.5 7.5 L28 8.8 L18 17.35 L8 8.8 Z" />
              <path d="M8 27.2 L18 18.65 L28 27.2 L26.5 28.5 L18 23.0 L9.5 28.5 Z" />
            </g>
          </svg>
        </div>
      ),
      { ...size }
    );
  }

  // TC-3. Heavy Mass Wedge
  if (logoStyle === 'tc3-heavy') {
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
            borderRadius: '44px',
            border: '2px solid #3f3f46',
            padding: '24px',
          }}
        >
          <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none">
            <g fill="#ffffff" transform="rotate(45 18 18)">
              <path d="M9.0 7.0 L18 12.4 L27.0 7.0 L28.5 8.8 L18 17.2 L7.5 8.8 Z" />
              <path d="M7.5 27.2 L18 18.8 L28.5 27.2 L27.0 29.0 L18 23.6 L9.0 29.0 Z" />
            </g>
          </svg>
        </div>
      ),
      { ...size }
    );
  }

  // TC-4. Wide-Span Flare
  if (logoStyle === 'tc4-wide') {
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
            borderRadius: '44px',
            border: '2px solid #3f3f46',
            padding: '24px',
          }}
        >
          <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none">
            <g fill="#ffffff" transform="rotate(45 18 18)">
              <path d="M10.0 6.5 L18 13.0 L26.0 6.5 L28.5 8.5 L18 17.2 L7.5 8.5 Z" />
              <path d="M7.5 27.5 L18 18.8 L28.5 27.5 L26.0 29.5 L18 23.0 L10.0 29.5 Z" />
            </g>
          </svg>
        </div>
      ),
      { ...size }
    );
  }

  // 3. Mach Diamond
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

  // 4. Square CAD Datum
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

  // 5. Delta Chevron ('chevron' or 'delta')
  if (logoStyle === 'chevron' || logoStyle === 'delta') {
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
            <path d="M18 7.5 L28.5 26 H22.5 L18 18.5 L13.5 26 H7.5 Z" fill="#09090b" />
          </svg>
        </div>
      ),
      { ...size }
    );
  }

  // Default: Linear Razor Nozzle ('nozzle' or 'nozzle-linear')
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
            <path d="M8 9 L18 13.5 L28 9 L28 12.5 L18 17 L8 12.5 Z" />
            <path d="M8 27 L18 22.5 L28 27 L28 23.5 L18 19 L8 23.5 Z" />
          </g>
        </svg>
      </div>
    ),
    { ...size }
  );
}
