import { ImageResponse } from 'next/og';
import { getContent } from '@/lib/content';

export const runtime = 'nodejs';
export const alt = 'Shreyaan Vashishtha — sv7.dev';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  let name = 'Shreyaan Vashishtha';
  let title = 'Mechanical & Aerospace Engineering';
  let tagline = 'Astrix Rocketry, Aerodynamics & Descent Control, Computational Engineering';
  let siteName = 'sv7.dev';

  try {
    const data = await getContent();
    if (data.profile?.name) name = data.profile.name;
    if (data.profile?.title) title = data.profile.title;
    if (data.profile?.tagline) tagline = data.profile.tagline;
    if (data.settings?.siteName) siteName = data.settings.siteName;
  } catch (e) {
    // fallback to defaults
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
          backgroundColor: '#09090b',
          padding: '64px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Background glow accents */}
        <div
          style={{
            position: 'absolute',
            top: '-150px',
            right: '-100px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(9, 9, 11, 0) 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-120px',
            left: '-100px',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, rgba(9, 9, 11, 0) 70%)',
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
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '9999px',
              padding: '10px 22px',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
              }}
            />
            <span
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '0.05em',
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
                letterSpacing: '0.1em',
              }}
            >
              Systems &amp; Aerospace
            </span>
          </div>

          {/* Affiliation Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '9999px',
              padding: '8px 20px',
            }}
          >
            <span
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#34d399',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              HKUST Astrix Rocketry
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
              fontSize: '66px',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
            }}
          >
            {name}
          </div>

          <div
            style={{
              fontSize: '30px',
              fontWeight: 600,
              color: '#38bdf8',
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </div>

          <div
            style={{
              fontSize: '22px',
              color: '#a1a1aa',
              lineHeight: 1.4,
              maxWidth: '900px',
            }}
          >
            {tagline}
          </div>
        </div>

        {/* Bottom Bar: Engineering Tags & Domain */}
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
            {['Descent Control', 'SolidWorks CAD', 'Computational Python', 'Aerodynamics'].map(
              (tag) => (
                <div
                  key={tag}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    color: '#e4e4e7',
                    fontWeight: 500,
                  }}
                >
                  {tag}
                </div>
              )
            )}
          </div>

          <div
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#10b981',
              fontFamily: 'monospace',
              letterSpacing: '0.05em',
            }}
          >
            sv7.dev
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
