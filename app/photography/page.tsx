import type { Metadata } from 'next';
import { getContent } from '@/lib/content';
import { fetchPexelsCollectionPhotos, extractCollectionId } from '@/lib/pexels';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PhotographyGallery } from '@/components/PhotographyGallery';

export const runtime = 'nodejs';

async function getPhotosWithLiveFallback(data: any) {
  let photos = data.photos || [];
  if (photos.length === 0) {
    const apiKey =
      process.env.PEXELS_API_KEY ||
      data.photographySettings?.pexelsApiKey ||
      '';
    const collectionId = extractCollectionId(
      data.photographySettings?.pexelsCollectionId || 'portfolio-je8myyb'
    );
    if (apiKey) {
      try {
        const livePhotos = await fetchPexelsCollectionPhotos(apiKey, collectionId);
        if (livePhotos && livePhotos.length > 0) {
          photos = livePhotos;
        }
      } catch (err) {
        console.warn('Auto-fetch Pexels collection failed:', err);
      }
    }
  }
  return photos;
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await getContent();
    const photos = await getPhotosWithLiveFallback(data);
    const siteName = data.settings?.siteName || 'sv7.dev';
    const canonicalBase = (data.settings?.canonicalUrl || 'https://sv7.dev').replace(/\/$/, '');
    const title = `${data.photographySettings?.title || 'Visual Archive & Photography'} — ${data.profile?.name || 'Shreyaan Vashishtha'} | ${siteName}`;
    const description =
      data.photographySettings?.subtitle ||
      'Curated visual archive featuring aerospace perspectives, structural geometry, urban nocturnes, and Pexels photography by Shreyaan Vashishtha.';

    const featuredPhoto = photos.find((p: any) => p.featured) || photos[0];
    const ogImage = featuredPhoto?.src?.large2x || featuredPhoto?.src?.large || '/opengraph-image';

    return {
      title,
      description,
      alternates: {
        canonical: `${canonicalBase}/photography`,
      },
      openGraph: {
        title,
        description,
        url: `${canonicalBase}/photography`,
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
        creator: data.settings?.twitterHandle || '@shreyaanv',
        images: [ogImage],
      },
    };
  } catch (e) {
    return {
      title: 'Visual Archive & Photography — sv7.dev',
      description: 'Aerospace perspectives and terrestrial observations through the lens.',
    };
  }
}

export default async function PhotographyPage() {
  const data = await getContent();
  const photos = await getPhotosWithLiveFallback(data);

  return (
    <div className="min-h-screen bg-zinc-950 text-foreground selection:bg-white selection:text-black">
      <Navbar
        status={data.profile.status}
        siteName={data.settings.siteName}
        cvUrl={data.settings.cvUrl}
        headerSettings={data.settings.header}
      />

      <main>
        <PhotographyGallery
          photos={photos}
          settings={data.photographySettings}
          profile={data.profile}
          socials={data.socials}
          siteSettings={data.settings}
        />
      </main>

      <Footer
        siteName={data.settings.siteName}
        footerSettings={data.settings.footer}
      />
    </div>
  );
}
