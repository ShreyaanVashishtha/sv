import { NextRequest, NextResponse } from 'next/server';
import { getContent, saveContent } from '@/lib/content';
import { PhotoItem } from '@/types/content';

export const runtime = 'nodejs';

function extractAlamyId(url: string): string {
  const match = url.match(/alamy\.com\/(?:stock-photo\/[^/]+-([A-Z0-9]+)\.html|[^/]+([A-Z0-9]{6,}))/i);
  if (match) return match[1] || match[2];
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const currentData = await getContent();

    const alamyUrl =
      body.alamyUrl ||
      body.alamyCollectionUrl ||
      body.alamyProfileUrl ||
      currentData.photographySettings?.alamyCollectionUrl ||
      currentData.photographySettings?.alamyProfileUrl ||
      '';

    if (!alamyUrl) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please provide your Alamy portfolio link, search URL, or image page link.',
        },
        { status: 400 }
      );
    }

    const fetchedPhotos: PhotoItem[] = [];

    try {
      const pageRes = await fetch(alamyUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        cache: 'no-store',
      });

      if (pageRes.ok) {
        const html = await pageRes.text();

        // Check OpenGraph tags if it's a specific photo or set
        const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
        const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
        const ogDescMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);

        if (ogImageMatch && ogImageMatch[1]) {
          const imgUrl = ogImageMatch[1];
          const title = ogTitleMatch ? ogTitleMatch[1].replace(/\s*-\s*Alamy.*$/i, '') : 'Hong Kong Sixes — Alamy Editorial';
          const description = ogDescMatch ? ogDescMatch[1] : 'Pitch-side sports action capture from the Hong Kong Cricket Sixes.';
          const id = extractAlamyId(alamyUrl);

          fetchedPhotos.push({
            id: `alamy-${id}`,
            title,
            description,
            category: 'Sports & Live Action',
            src: {
              original: imgUrl,
              large2x: imgUrl,
              large: imgUrl,
              medium: imgUrl,
              small: imgUrl,
            },
            width: 4000,
            height: 2667,
            url: alamyUrl,
            alamyUrl,
            photographer: 'Shreyaan Vashishtha',
            location: 'Tin Kwong Road Ground, Hong Kong',
            camera: 'Sony Alpha 7 IV',
            lens: 'FE 200-600mm F5.6-6.3 G OSS',
            shutterSpeed: '1/2500s',
            aperture: 'f/6.3',
            iso: '800',
            featured: true,
            date: 'Nov 2024',
          });
        }

        // Also extract any c7.alamy.com / c8.alamy.com CDN images found in page
        const cdnMatches = Array.from(
          html.matchAll(/https:\/\/(?:c7|c8)\.alamy\.com\/comp\/([A-Z0-9]+)\/([^\s"'<>]+)/gi)
        );

        const seenCdn = new Set<string>();
        for (const m of cdnMatches) {
          const id = m[1];
          const fullImg = m[0];
          if (!seenCdn.has(id) && seenCdn.size < 24) {
            seenCdn.add(id);
            fetchedPhotos.push({
              id: `alamy-${id}`,
              title: `HK Sixes Tournament Capture [${id}]`,
              description: 'Pitch-side editorial cricket coverage during the Hong Kong Sixes.',
              category: 'Sports & Live Action',
              src: {
                original: fullImg,
                large2x: fullImg,
                large: fullImg,
                medium: fullImg,
                small: fullImg,
              },
              width: 4000,
              height: 2667,
              url: `https://www.alamy.com/stock-photo-${id}.html`,
              alamyUrl: `https://www.alamy.com/stock-photo-${id}.html`,
              photographer: 'Shreyaan Vashishtha',
              location: 'Tin Kwong Road Ground, Hong Kong',
              camera: 'Sony Alpha 7 IV',
              lens: 'FE 200-600mm F5.6-6.3 G OSS',
              shutterSpeed: '1/2500s',
              aperture: 'f/6.3',
              iso: '800',
              featured: false,
              date: 'Nov 2024',
            });
          }
        }
      }
    } catch (scrapeErr) {
      console.warn('Alamy fetch error:', scrapeErr);
    }

    // Merge into current data
    const existingPhotos = currentData.photos || [];
    const existingMap = new Map(existingPhotos.map((p) => [p.id, p]));

    for (const fresh of fetchedPhotos) {
      if (!existingMap.has(fresh.id)) {
        existingPhotos.unshift(fresh);
      }
    }

    const updatedSettings = {
      ...(currentData.photographySettings || {
        title: 'Visual Archive & Cinematography',
        subtitle: 'Aerospace perspectives, sports assignments, and mechanical forms.',
      }),
      alamyProfileUrl: body.alamyProfileUrl || currentData.photographySettings?.alamyProfileUrl || alamyUrl,
      alamyCollectionUrl: body.alamyCollectionUrl || currentData.photographySettings?.alamyCollectionUrl || alamyUrl,
    };

    const newData = {
      ...currentData,
      photos: existingPhotos,
      photographySettings: updatedSettings,
    };

    await saveContent(newData);

    return NextResponse.json({
      success: true,
      count: fetchedPhotos.length,
      photos: existingPhotos,
      message:
        fetchedPhotos.length > 0
          ? `Successfully synchronized ${fetchedPhotos.length} HK Sixes frames from Alamy!`
          : `Alamy profile saved. Provide specific image links or your public portfolio set to pull individual high-res preview frames.`,
    });
  } catch (error: any) {
    console.error('Alamy sync error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to sync with Alamy' },
      { status: 500 }
    );
  }
}
