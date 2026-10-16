import { PhotoItem } from '@/types/content';

export function extractCollectionId(urlOrId: string): string {
  if (!urlOrId) return 'je8myyb';
  const trimmed = urlOrId.trim().replace(/\/$/, '');
  const lastSegment = trimmed.split('/').pop() || '';
  const parts = lastSegment.split('-');
  const candidate = parts[parts.length - 1];
  return candidate || 'je8myyb';
}

export function categorizePexelsPhoto(altText: string): string {
  const text = (altText || '').toLowerCase();
  if (
    text.includes('rocket') ||
    text.includes('airplane') ||
    text.includes('plane') ||
    text.includes('jet') ||
    text.includes('aviation') ||
    text.includes('flight') ||
    text.includes('sky') ||
    text.includes('space') ||
    text.includes('star') ||
    text.includes('astronomy')
  ) {
    return 'Aerospace & Aviation';
  }
  if (
    text.includes('building') ||
    text.includes('architecture') ||
    text.includes('bridge') ||
    text.includes('tower') ||
    text.includes('concrete') ||
    text.includes('structure') ||
    text.includes('window')
  ) {
    return 'Architecture & Geometry';
  }
  if (
    text.includes('city') ||
    text.includes('street') ||
    text.includes('night') ||
    text.includes('light') ||
    text.includes('traffic') ||
    text.includes('urban') ||
    text.includes('hong kong')
  ) {
    return 'Urban & Nocturne';
  }
  return 'Nature & Textures';
}

export function mapPexelsPhotoToItem(p: any): PhotoItem {
  return {
    id: String(p.id),
    title: p.alt || (p.id ? `Pexels Photograph #${p.id}` : 'Photograph'),
    description: p.alt || '',
    category: categorizePexelsPhoto(p.alt || ''),
    src: {
      original: p.src?.original || '',
      large2x: p.src?.large2x || p.src?.large || p.src?.original || '',
      large: p.src?.large || p.src?.original || '',
      medium: p.src?.medium || p.src?.large || '',
      small: p.src?.small || p.src?.medium || '',
      portrait: p.src?.portrait,
      landscape: p.src?.landscape,
      tiny: p.src?.tiny,
    },
    width: p.width || 4000,
    height: p.height || 3000,
    url: p.url || `https://www.pexels.com/photo/${p.id}/`,
    photographer: p.photographer || 'Shreyaan Vashishtha',
    photographerUrl: p.photographer_url || '',
    avgColor: p.avg_color,
    alt: p.alt,
    camera: 'Sony Alpha',
    lens: 'FE 24-70mm f/2.8',
    aperture: 'f/2.8',
    shutterSpeed: '1/500s',
    iso: '100',
    featured: false,
  };
}

export async function fetchPexelsCollectionPhotos(
  apiKey: string,
  collectionId: string = 'je8myyb'
): Promise<PhotoItem[]> {
  if (!apiKey) return [];
  const cleanId = extractCollectionId(collectionId);
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/collections/${cleanId}?per_page=80`,
      {
        headers: {
          Authorization: apiKey,
          'User-Agent': 'sv7-portfolio-sync/1.0',
        },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) {
      console.warn(`Pexels API error HTTP ${res.status}`);
      return [];
    }
    const data = await res.json();
    if (Array.isArray(data.media)) {
      return data.media
        .filter((m: any) => m.type === 'Photo' || m.src)
        .map(mapPexelsPhotoToItem);
    }
  } catch (err) {
    console.warn('Failed to fetch Pexels collection:', err);
  }
  return [];
}
