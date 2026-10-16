import type { Metadata } from 'next';
import './globals.css';
import { getContent } from '@/lib/content';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await getContent();
    const siteName = data.settings?.siteName || 'sv7.dev';
    const title = data.settings?.metaTitle || `${data.profile?.name || 'Shreyaan Vashishtha'} — Mechanical & Aerospace Engineering | ${siteName}`;
    const description = data.settings?.metaDescription || data.profile?.tagline || 'Official portfolio & systems lab of Shreyaan Vashishtha (sv7.dev).';
    const canonicalUrl = (data.settings?.canonicalUrl || 'https://sv7.dev').replace(/\/$/, '');
    const keywords = data.settings?.keywords && data.settings.keywords.length > 0 ? data.settings.keywords : [
      'Shreyaan Vashishtha',
      'Mechanical Engineering',
      'Aerospace Engineering',
      'HKUST',
      'Astrix Rocketry',
      'Aerodynamics and Descent Control',
      'SolidWorks CAD',
      'Computational Python',
      'Hong Kong Engineer',
      'sv7.dev'
    ];
    const ogImage = data.settings?.ogImageUrl?.trim() ? data.settings.ogImageUrl : '/opengraph-image';
    const twitterHandle = data.settings?.twitterHandle || '@shreyaanv';

    return {
      metadataBase: new URL(canonicalUrl),
      title: {
        default: title,
        template: `%s | ${siteName}`,
      },
      description,
      keywords,
      authors: [{ name: data.profile?.name || 'Shreyaan Vashishtha', url: canonicalUrl }],
      creator: data.profile?.name || 'Shreyaan Vashishtha',
      publisher: data.profile?.name || 'Shreyaan Vashishtha',
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        type: 'website',
        locale: 'en_US',
        url: canonicalUrl,
        title,
        description,
        siteName,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        creator: twitterHandle,
        images: [ogImage],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      icons: {
        icon: '/favicon.ico',
      },
    };
  } catch (e) {
    return {
      metadataBase: new URL('https://sv7.dev'),
      title: 'sv7.dev — Shreyaan Vashishtha',
      description: 'Personal Developer & Engineering Lab',
    };
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let jsonLd = null;
  try {
    const data = await getContent();
    const canonicalUrl = (data.settings?.canonicalUrl || 'https://sv7.dev').replace(/\/$/, '');
    const name = data.profile?.name || 'Shreyaan Vashishtha';
    const jobTitle = data.profile?.title || 'Mechanical & Aerospace Engineering';
    const sameAs = (data.socials || [])
      .map((s) => s.url)
      .filter((url) => Boolean(url) && url.startsWith('http'));

    jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Person',
          '@id': `${canonicalUrl}/#person`,
          name,
          url: canonicalUrl,
          jobTitle,
          affiliation: {
            '@type': 'Organization',
            name: 'Hong Kong University of Science and Technology (HKUST)',
          },
          sameAs,
        },
        {
          '@type': 'WebSite',
          '@id': `${canonicalUrl}/#website`,
          url: canonicalUrl,
          name: data.settings?.siteName || 'sv7.dev',
          description: data.settings?.metaDescription || data.profile?.tagline || '',
          publisher: {
            '@id': `${canonicalUrl}/#person`,
          },
        },
      ],
    };
  } catch (e) {
    // ignore
  }

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-white selection:text-black">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
