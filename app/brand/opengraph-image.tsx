import { ImageResponse } from 'next/og';
import { getContent } from '@/lib/content';

export const runtime = 'nodejs';
export const alt = 'Brand Guidelines & Identity Standards — sv7.dev';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  let siteName = 'sv7.dev';
  let title = 'Brand Guidelines & Identity Standards';
  let subtitle = 'Official brand assets, logo geometry, typography scale, and color systems for sv7.dev.';

  try {
    const data = await getContent();
    if (data.settings?.siteName) siteName = data.settings.siteName;
  } catch (e) {
    // fallback
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#050505',
          padding: '64px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Subtle Ambient Monochrome Halo */}
        <div
          style={{
            position: 'absolute',
            top: '-150px',
            right: '-100px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, rgba(5, 5, 5, 0) 70%)',
          }}
        />

        {/* Top Header Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            zIndex: 10,
          }}
        >
          {/* Brand badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '9999px',
              padding: '10px 22px',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#000000',
                border: '1px solid #52525b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg viewBox="0 0 36 36" width="20" height="20" fill="none">
                <g fill="#ffffff" transform="rotate(45 18 18)">
                  <path d="M9.5 7.5 L18 13.0 L26.5 7.5 L28 9.0 L18 17.2 L8 9.0 Z" />
                  <path d="M8 27.0 L18 18.8 L28 27.0 L26.5 28.5 L18 23.0 L9.5 28.5 Z" />
                </g>
              </svg>
            </div>
            <span
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '0.04em',
              }}
            >
              {siteName}
            </span>
            <span style={{ color: '#52525b', fontSize: '18px' }}>•</span>
            <span
              style={{
                fontSize: '14px',
                color: '#a1a1aa',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                fontWeight: 600,
              }}
            >
              Identity Standards
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '9999px',
              padding: '8px 20px',
              gap: '8px',
            }}
          >
            <span
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#e4e4e7',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                fontFamily: 'monospace',
              }}
            >
              Design Tokens &amp; Geometry
            </span>
          </div>
        </div>

        {/* Main Center Section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            zIndex: 10,
            maxWidth: '1000px',
          }}
        >
          <div
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: '#d4d4d8',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: 'monospace',
            }}
          >
            Precision Monolith System &bull; TC1 Mark &bull; Kinetic Typography
          </div>

          <div
            style={{
              fontSize: '56px',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>

          <div
            style={{
              fontSize: '22px',
              color: '#a1a1aa',
              lineHeight: 1.4,
              maxWidth: '920px',
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Bottom Bar: Specifications */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', gap: '12px' }}>
            {['TC1 Balanced Mark', 'SF Mono & Archivo', 'Hex #09090b', 'Export Vector SVG', 'Color Matrix'].map(
              (tag) => (
                <div
                  key={tag}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    color: '#e4e4e7',
                    fontFamily: 'monospace',
                  }}
                >
                  {tag}
                </div>
              )
            )}
          </div>

          <div
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#ffffff',
              fontFamily: 'monospace',
              letterSpacing: '0.05em',
            }}
          >
            sv7.dev/brand
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
