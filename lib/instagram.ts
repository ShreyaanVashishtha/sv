import { VideoItem } from '@/types/content';

export function extractBeholdFeedId(urlOrId: string): string {
  if (!urlOrId) return '';
  const trimmed = urlOrId.trim().replace(/\/$/, '');
  const match = trimmed.match(/feeds\.behold\.so\/([a-zA-Z0-9_-]+)/i);
  if (match) return match[1];
  return trimmed;
}

export function categorizeInstagramReel(caption: string = '', hashtags: string[] = []): string {
  const combined = (caption + ' ' + hashtags.join(' ')).toLowerCase();
  if (
    combined.includes('plane') ||
    combined.includes('airplane') ||
    combined.includes('aviation') ||
    combined.includes('flight') ||
    combined.includes('airport') ||
    combined.includes('hkg') ||
    combined.includes('aircraft') ||
    combined.includes('aero') ||
    combined.includes('runway')
  ) {
    return 'Aerospace & Aviation';
  }
  if (
    combined.includes('reservoir') ||
    combined.includes('nature') ||
    combined.includes('mountain') ||
    combined.includes('hike') ||
    combined.includes('forest') ||
    combined.includes('green') ||
    combined.includes('sea') ||
    combined.includes('water')
  ) {
    return 'Nature & Textures';
  }
  if (
    combined.includes('building') ||
    combined.includes('architecture') ||
    combined.includes('tower') ||
    combined.includes('geometry') ||
    combined.includes('facade') ||
    combined.includes('structure')
  ) {
    return 'Architecture & Geometry';
  }
  return 'Urban & Nocturne';
}

export function formatTimestampToDate(timestamp?: string): string {
  if (!timestamp) return 'Recent';
  try {
    const d = new Date(timestamp);
    if (isNaN(d.getTime())) return 'Recent';
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch {
    return 'Recent';
  }
}

export function mapBeholdPostToVideoItem(p: any): VideoItem {
  const rawCaption = p.prunedCaption || p.caption || '';
  const cleanTitle = rawCaption.split('\n')[0]?.trim().slice(0, 60) || 'Instagram Reel';
  const hashtags = Array.isArray(p.hashtags) ? p.hashtags : [];
  const category = categorizeInstagramReel(rawCaption, hashtags);

  // Behold provides sizes: full, large, medium, small, as well as thumbnailUrl
  const posterUrl =
    p.sizes?.large?.mediaUrl ||
    p.sizes?.full?.mediaUrl ||
    p.thumbnailUrl ||
    p.sizes?.medium?.mediaUrl ||
    '';

  return {
    id: `ig-${p.id}`,
    title: cleanTitle,
    description: p.caption || '',
    category,
    videoUrl: p.mediaUrl || '',
    posterUrl,
    instagramUrl: p.permalink || 'https://www.instagram.com/sv.snap/',
    duration: 'Reel',
    aspectRatio: '9:16',
    resolution: '1080p 60fps',
    camera: 'Sony Alpha',
    lens: 'Prime / Zoom',
    fps: '60fps',
    location: 'Hong Kong SAR',
    date: formatTimestampToDate(p.timestamp),
    featured: false,
    hidden: false,
  };
}

export async function fetchBeholdReels(feedUrlOrId: string): Promise<VideoItem[]> {
  const feedId = extractBeholdFeedId(feedUrlOrId);
  if (!feedId) return [];

  const url = `https://feeds.behold.so/${feedId}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'sv7-portfolio-sync/1.0',
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn(`Behold feed error: HTTP ${res.status}`);
      return [];
    }

    const data = await res.json();
    const rawPosts = Array.isArray(data) ? data : Array.isArray(data?.posts) ? data.posts : [];

    // Filter to videos / reels that have a mediaUrl
    const videoPosts = rawPosts.filter(
      (p: any) => p && (p.mediaType === 'VIDEO' || p.mediaUrl?.includes('.mp4') || p.mediaUrl)
    );

    return videoPosts.map(mapBeholdPostToVideoItem);
  } catch (err) {
    console.warn('Failed to fetch Behold reels:', err);
    return [];
  }
}
