import type { Metadata } from 'next';
import { getContent, saveContent } from '@/lib/content';
import { PhotoItem } from '@/types/content';
import { fetchPexelsCollectionPhotos, extractCollectionId } from '@/lib/pexels';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PhotographyGallery } from '@/components/PhotographyGallery';

export const runtime = 'nodejs';

async function getPhotosWithLiveFallback(data: any): Promise<PhotoItem[]> {
  const existingPhotos: PhotoItem[] = data.photos || [];
  const existingMap = new Map(existingPhotos.map((p) => [p.id, p]));

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
        // Auto-curate and merge: preserve user edits from admin
        const merged: PhotoItem[] = livePhotos.map((fresh) => {
          const prev = existingMap.get(fresh.id);
          if (prev) {
            return {
              ...fresh,
              title: prev.title || fresh.title,
              description: prev.description !== undefined ? prev.description : fresh.description,
              category: prev.category || fresh.category,
              camera: prev.camera || fresh.camera,
              lens: prev.lens || fresh.lens,
              focalLength: prev.focalLength || fresh.focalLength,
              aperture: prev.aperture || fresh.aperture,
              shutterSpeed: prev.shutterSpeed || fresh.shutterSpeed,
              iso: prev.iso || fresh.iso,
              location: prev.location || fresh.location,
              date: prev.date || fresh.date,
              featured: prev.featured ?? fresh.featured,
              hidden: prev.hidden ?? fresh.hidden,
            };
          }
          return fresh;
        });

        // Preserve any manually added non-Pexels frames
        const liveIds = new Set(livePhotos.map((p) => p.id));
        for (const prev of existingPhotos) {
          if (!liveIds.has(prev.id)) {
            merged.push(prev);
          }
        }

        // Background persist if new photos were discovered
        if (merged.length !== existingPhotos.length) {
          saveContent({ ...data, photos: merged }).catch(() => {});
        }

        return merged;
      }
    } catch (err) {
      console.warn('Auto-sync Pexels collection failed:', err);
    }
  }

  return existingPhotos;
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
