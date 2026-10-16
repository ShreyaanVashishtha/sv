import { NextRequest, NextResponse } from 'next/server';
import { getContent, saveContent } from '@/lib/content';
import { PhotoItem } from '@/types/content';
import { extractCollectionId, mapPexelsPhotoToItem, categorizePexelsPhoto } from '@/lib/pexels';

export const runtime = 'nodejs';

function extractPexelsUsername(urlOrHandle: string): string {
  if (!urlOrHandle) return '';
  const trimmed = urlOrHandle.trim();
  const match = trimmed.match(/pexels\.com\/@([a-zA-Z0-9_-]+)/i);
  if (match) return match[1];
  return trimmed.replace(/^@/, '');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const currentData = await getContent();

    const apiKey =
      body.pexelsApiKey ||
      process.env.PEXELS_API_KEY ||
      currentData.photographySettings?.pexelsApiKey ||
      '';

    const rawProfileUrl =
      body.pexelsProfileUrl ||
      currentData.photographySettings?.pexelsProfileUrl ||
      'https://www.pexels.com/@shreyaan/';

    const username =
      body.pexelsUsername ||
      extractPexelsUsername(rawProfileUrl) ||
      currentData.photographySettings?.pexelsUsername ||
      'shreyaan';

    const rawCollectionInput =
      body.pexelsCollectionId ||
      currentData.photographySettings?.pexelsCollectionId ||
      'portfolio-je8myyb';

    const cleanCollectionId = extractCollectionId(rawCollectionInput) || 'je8myyb';

    let fetchedPhotos: PhotoItem[] = [];

    // METHOD 1: Pexels Official REST API (if apiKey is supplied or in environment)
    if (apiKey) {
      const headers = {
        Authorization: apiKey,
        'User-Agent': 'sv7-portfolio-sync/1.0',
      };

      // 1A. Fetch from specific collection if collectionId provided
      if (cleanCollectionId) {
        try {
          const colRes = await fetch(
            `https://api.pexels.com/v1/collections/${cleanCollectionId}?per_page=80`,
            { headers, cache: 'no-store' }
          );
          if (colRes.ok) {
            const colData = await colRes.json();
            if (Array.isArray(colData.media)) {
              fetchedPhotos = colData.media
                .filter((m: any) => m.type === 'Photo' || m.src)
                .map(mapPexelsPhotoToItem);
            }
          } else {
            console.warn(`Pexels collection fetch error: HTTP ${colRes.status}`);
          }
        } catch (colErr) {
          console.warn('Pexels collection fetch error:', colErr);
        }
      }

      // 1B. Fetch ALL user's collections if no collectionId specified or 0 photos found
      if (fetchedPhotos.length === 0) {
        try {
          const myColRes = await fetch(
            'https://api.pexels.com/v1/collections/my-collections?per_page=20',
            { headers, cache: 'no-store' }
          );
          if (myColRes.ok) {
            const myColData = await myColRes.json();
            if (Array.isArray(myColData.collections) && myColData.collections.length > 0) {
              const allMedia: any[] = [];
              for (const col of myColData.collections) {
                try {
                  const mediaRes = await fetch(
                    `https://api.pexels.com/v1/collections/${col.id}?per_page=80`,
                    { headers, cache: 'no-store' }
                  );
                  if (mediaRes.ok) {
                    const mediaData = await mediaRes.json();
                    if (Array.isArray(mediaData.media)) {
                      allMedia.push(...mediaData.media);
                    }
                  }
                } catch (colFetchErr) {
                  console.warn(`Failed to fetch media for collection ${col.id}:`, colFetchErr);
                }
              }

              const seen = new Set<string>();
              fetchedPhotos = allMedia
                .filter((m: any) => {
                  if (seen.has(String(m.id))) return false;
                  seen.add(String(m.id));
                  return m.type === 'Photo' || m.src;
                })
                .map(mapPexelsPhotoToItem);
            }
          }
        } catch (myColErr) {
          console.warn('Pexels my-collections fetch error:', myColErr);
        }
      }
    }

    // METHOD 2: Public Scraper / Parser for Pexels Profile URL (if no API key or API returned 0)
    if (fetchedPhotos.length === 0 && rawProfileUrl) {
      try {
        const fullUrl = rawProfileUrl.startsWith('http')
          ? rawProfileUrl
          : `https://www.pexels.com/@${rawProfileUrl.replace(/^@/, '')}`;

        const pageRes = await fetch(fullUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml',
          },
          cache: 'no-store',
        });

        if (pageRes.ok) {
          const html = await pageRes.text();
          // Extract JSON-LD or Next data embedded in page
          const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi);
          if (jsonLdMatch) {
            for (const scriptTag of jsonLdMatch) {
              try {
                const content = scriptTag
                  .replace(/<script type="application\/ld\+json">/i, '')
                  .replace(/<\/script>/i, '');
                const parsed = JSON.parse(content);
                if (parsed['@type'] === 'ImageGallery' && Array.isArray(parsed.image)) {
                  for (const img of parsed.image) {
                    fetchedPhotos.push({
                      id: String(img.identifier || Math.random().toString(36).slice(2)),
                      title: img.name || img.caption || 'Pexels Photograph',
                      url: img.url || fullUrl,
                      width: img.width || 4000,
                      height: img.height || 3000,
                      src: {
                        original: img.contentUrl || img.thumbnailUrl,
                        large2x: img.contentUrl || img.thumbnailUrl,
                        large: img.contentUrl || img.thumbnailUrl,
                        medium: img.thumbnailUrl || img.contentUrl,
                        small: img.thumbnailUrl || img.contentUrl,
                      },
                      photographer: parsed.author?.name || 'Shreyaan Vashishtha',
                      photographerUrl: fullUrl,
                    });
                  }
                }
              } catch (e) {
                // continue to next block
              }
            }
          }

          // Regex fallback for pexels CDN images on the profile
          if (fetchedPhotos.length === 0) {
            const photoMatches = Array.from(
              html.matchAll(/https:\/\/images\.pexels\.com\/photos\/(\d+)\/[^"'\s]+/g)
            );
            const seenIds = new Set<string>();
            for (const m of photoMatches) {
              const id = m[1];
              if (!seenIds.has(id) && seenIds.size < 30) {
                seenIds.add(id);
                fetchedPhotos.push({
                  id,
                  title: `Pexels Capture #${id}`,
                  url: `https://www.pexels.com/photo/${id}/`,
                  width: 4000,
                  height: 3000,
                  src: {
                    original: `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg`,
                    large2x: `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1200`,
                    large: `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1000`,
                    medium: `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=600`,
                    small: `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=350`,
                  },
                  photographer: 'Shreyaan Vashishtha',
                  photographerUrl: fullUrl,
                });
              }
            }
          }
        }
      } catch (scrapeErr) {
        console.warn('Pexels scrape error:', scrapeErr);
      }
    }

    if (fetchedPhotos.length === 0) {
      return NextResponse.json(
        {
          success: false,
          count: 0,
          error:
            'No photos could be retrieved from your Pexels collection. Please make sure your Pexels Collection link or ID is entered, and that your PEXELS_API_KEY is set in Vercel or in the settings below.',
        },
        { status: 400 }
      );
    }

    // Merge or update existing photos
    const existingPhotos = currentData.photos || [];
    const existingMap = new Map(existingPhotos.map((p) => [p.id, p]));
    const updatedPhotos = fetchedPhotos.map((fresh) => {
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

    // Update settings
    const updatedSettings = {
      ...(currentData.photographySettings || {
        title: 'Visual Archive & Photography',
        subtitle: 'Aerospace perspectives, mechanical forms, and terrestrial observations.',
      }),
      pexelsProfileUrl: rawProfileUrl,
      pexelsUsername: username,
      pexelsCollectionId: rawCollectionInput,
      pexelsApiKey: apiKey,
    };

    const newData = {
      ...currentData,
      photos: updatedPhotos,
      photographySettings: updatedSettings,
    };

    await saveContent(newData);

    return NextResponse.json({
      success: true,
      count: updatedPhotos.length,
      photos: updatedPhotos,
      message: `Successfully synchronized ${updatedPhotos.length} photos from your Pexels collection!`,
    });
  } catch (error: any) {
    console.error('Photography sync error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to sync with Pexels' },
      { status: 500 }
    );
  }
}

