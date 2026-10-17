import { NextRequest, NextResponse } from 'next/server';
import { getContent, saveContent } from '@/lib/content';
import { VideoItem } from '@/types/content';
import { fetchBeholdReels, extractBeholdFeedId } from '@/lib/instagram';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const currentData = await getContent();

    const rawFeedInput =
      body.beholdFeedUrl ||
      currentData.photographySettings?.beholdFeedUrl ||
      'https://feeds.behold.so/1lkLZszNd2q0wm55agTN';

    const feedId = extractBeholdFeedId(rawFeedInput) || '1lkLZszNd2q0wm55agTN';
    const feedUrl = `https://feeds.behold.so/${feedId}`;

    const fetchedReels: VideoItem[] = await fetchBeholdReels(feedId);

    if (fetchedReels.length === 0) {
      return NextResponse.json(
        {
          success: false,
          count: 0,
          error: `No Reels could be retrieved from Behold feed (${feedId}). Please verify your Behold feed URL is active and contains published video reels from @sv.snap.`,
        },
        { status: 400 }
      );
    }

    // Merge or update existing videos preserving manual user customizations
    const existingVideos = currentData.videos || [];
    const existingMap = new Map(existingVideos.map((v) => [v.id, v]));
    const existingUrlMap = new Map(
      existingVideos.filter((v) => v.instagramUrl).map((v) => [v.instagramUrl, v])
    );

    const updatedVideos = fetchedReels.map((fresh) => {
      const prev = existingMap.get(fresh.id) || (fresh.instagramUrl ? existingUrlMap.get(fresh.instagramUrl) : undefined);
      if (prev) {
        return {
          ...fresh,
          title: prev.title || fresh.title,
          description: prev.description !== undefined ? prev.description : fresh.description,
          category: prev.category || fresh.category,
          camera: prev.camera || fresh.camera,
          lens: prev.lens || fresh.lens,
          fps: prev.fps || fresh.fps,
          resolution: prev.resolution || fresh.resolution,
          location: prev.location || fresh.location,
          date: prev.date || fresh.date,
          duration: prev.duration || fresh.duration,
          aspectRatio: prev.aspectRatio || fresh.aspectRatio,
          featured: prev.featured ?? fresh.featured,
          hidden: prev.hidden ?? fresh.hidden,
        };
      }
      return fresh;
    });

    // Preserve any custom non-Behold videos manually added in admin
    const fetchedIdSet = new Set(fetchedReels.map((v) => v.id));
    for (const prev of existingVideos) {
      if (!fetchedIdSet.has(prev.id)) {
        updatedVideos.push(prev);
      }
    }

    // Update settings
    const updatedSettings = {
      ...(currentData.photographySettings || {
        title: 'Visual Archive & Cinematography',
        subtitle: 'Aerospace perspectives, mechanical forms, and high-speed motion studies.',
      }),
      beholdFeedUrl: feedUrl,
      beholdFeedId: feedId,
      instagramHandle: currentData.photographySettings?.instagramHandle || 'sv.snap',
      instagramProfileUrl:
        currentData.photographySettings?.instagramProfileUrl || 'https://www.instagram.com/sv.snap/',
    };

    const newData = {
      ...currentData,
      videos: updatedVideos,
      photographySettings: updatedSettings,
    };

    await saveContent(newData);

    return NextResponse.json({
      success: true,
      count: updatedVideos.length,
      videos: updatedVideos,
      photographySettings: updatedSettings,
      message: `Successfully synchronized ${fetchedReels.length} Reels from @sv.snap via Behold!`,
    });
  } catch (error: any) {
    console.error('Reels sync error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to sync Reels from Behold' },
      { status: 500 }
    );
  }
}
