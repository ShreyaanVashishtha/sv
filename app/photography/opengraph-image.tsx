import { ImageResponse } from 'next/og';
import { getContent } from '@/lib/content';

export const runtime = 'nodejs';
export const alt = 'Visual Archive & Cinematography — sv7.dev';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  let siteName = 'sv7.dev';
  let title = 'Visual Archive & Cinematography';
  let subtitle = 'Aerospace perspectives, mechanical forms, and high-speed sports cinematography captured on 35mm & 4K full-frame sensors.';
  let featuredTournament = 'Hong Kong Cricket Sixes';

  try {
    const data = await getContent();
    if (data.settings?.siteName) siteName = data.settings.siteName;
    if (data.photographySettings?.title) title = data.photographySettings.title;
    if (data.photographySettings?.subtitle) subtitle = data.photographySettings.subtitle;
    if (data.photographySettings?.featuredAssignment?.badge) {
      featuredTournament = data.photographySettings.featuredAssignment.badge;
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
          backgroundColor: '#09090b',
          padding: '64px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Ambient Amber & Orange Cinematic Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-160px',
            right: '-100px',
            width: '550px',
            height: '550px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, rgba(9, 9, 11, 0) 70%)',
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
            background: 'radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, rgba(9, 9, 11, 0) 70%)',
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
              border: '1px solid rgba(245, 158, 11, 0.3)',
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
                backgroundColor: '#1c1305',
                border: '1px solid #f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fbbf24" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
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
                color: '#fbbf24',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                fontWeight: 600,
              }}
            >
              Stills &amp; Cinematography
            </span>
          </div>

          {/* Tournament Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
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
                backgroundColor: '#fbbf24',
              }}
            />
            <span
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#fef3c7',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                fontFamily: 'monospace',
              }}
            >
              Featured: {featuredTournament}
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
              color: '#fbbf24',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: 'monospace',
            }}
          >
            Field Assignment &bull; 1/2500s High-Speed Burst &bull; 4K 60fps Motion
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
              color: '#d4d4d8',
              lineHeight: 1.4,
              maxWidth: '920px',
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Bottom Bar: Optics & Gear Specs */}
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
            {['Sony Alpha 7 IV', 'FE 200–600mm G OSS', 'FE 70–200mm f/2.8 GM', 'Alamy Editorial', '@sv.snap Reels'].map(
              (tag) => (
                <div
                  key={tag}
                  style={{
                    backgroundColor: 'rgba(245, 158, 11, 0.08)',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    color: '#fef3c7',
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
              color: '#fbbf24',
              fontFamily: 'monospace',
              letterSpacing: '0.05em',
            }}
          >
            sv7.dev/photography
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
