import { ImageResponse } from 'next/og';
import { getContent } from '@/lib/content';

export const runtime = 'nodejs';
export const alt = '3D CAD Lab & Mechanical Assemblies — sv7.dev';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  let siteName = 'sv7.dev';
  let title = '3D CAD Lab & Mechanical Assemblies';
  let subtitle = 'Interactive 3D WebGL assemblies, parametric rocketry mechanisms, and STL models engineered in Autodesk Fusion 360 & SolidWorks.';

  try {
    const data = await getContent();
    if (data.settings?.siteName) siteName = data.settings.siteName;
    if (data.cadSettings?.title) title = data.cadSettings.title;
    if (data.cadSettings?.subtitle && data.cadSettings.subtitle !== 'TO BE UPDATED') {
      subtitle = data.cadSettings.subtitle;
    }
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
          backgroundColor: '#05070a',
          padding: '64px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Ambient Cyan / Aerospace Blue Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-150px',
            right: '-100px',
            width: '550px',
            height: '550px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.18) 0%, rgba(5, 7, 10, 0) 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-140px',
            left: '-100px',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.14) 0%, rgba(5, 7, 10, 0) 70%)',
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
              border: '1px solid rgba(6, 182, 212, 0.3)',
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
                backgroundColor: '#081420',
                border: '1px solid #06b6d4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#22d3ee" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
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
                color: '#22d3ee',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                fontWeight: 600,
              }}
            >
              3D Systems Laboratory
            </span>
          </div>

          {/* Interactive WebGL Tag */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.35)',
              borderRadius: '9999px',
              padding: '8px 20px',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#22d3ee',
              }}
            />
            <span
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#67e8f9',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontFamily: 'monospace',
              }}
            >
              Interactive Three.js WebGL
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
              color: '#38bdf8',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: 'monospace',
            }}
          >
            Mechanical Design &amp; Rocketry Recovery
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
              color: '#94a3b8',
              lineHeight: 1.4,
              maxWidth: '920px',
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Bottom Bar: Engineering Specs & Features */}
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
            {['Fusion 360', 'SolidWorks 2024', 'Direct STL / GLTF', 'GD&T Tolerances ±0.02mm', 'Wireframe Topology'].map(
              (tag) => (
                <div
                  key={tag}
                  style={{
                    backgroundColor: 'rgba(6, 182, 212, 0.08)',
                    border: '1px solid rgba(6, 182, 212, 0.2)',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    color: '#e0f2fe',
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
              color: '#38bdf8',
              fontFamily: 'monospace',
              letterSpacing: '0.05em',
            }}
          >
            sv7.dev/cad
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
