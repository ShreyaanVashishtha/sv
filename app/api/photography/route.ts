import { NextRequest, NextResponse } from 'next/server';
import { getContent, saveContent } from '@/lib/content';
import { PhotoItem } from '@/types/content';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const data = await getContent();
    return NextResponse.json({
      photos: data.photos || [],
      photographySettings: data.photographySettings,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to get photography content' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const currentData = await getContent();

    let updatedPhotos = currentData.photos || [];

    // If whole list is provided (reorder or batch edit)
    if (Array.isArray(body.photos)) {
      updatedPhotos = body.photos;
    } else if (body.photo) {
      // Adding a single photo
      const newPhoto: PhotoItem = {
        id: body.photo.id || String(Date.now()),
        title: body.photo.title || 'Untitled Photograph',
        description: body.photo.description || '',
        category: body.photo.category || 'Aerospace & Aviation',
        src: body.photo.src || {
          original: body.photo.url || '',
          large2x: body.photo.url || '',
          large: body.photo.url || '',
          medium: body.photo.url || '',
          small: body.photo.url || '',
        },
        width: body.photo.width || 4000,
        height: body.photo.height || 3000,
        url: body.photo.url || '',
        photographer: body.photo.photographer || 'Shreyaan Vashishtha',
        photographerUrl: body.photo.photographerUrl || 'https://www.pexels.com/@shreyaan-vashishtha',
        camera: body.photo.camera || 'Sony Alpha',
        lens: body.photo.lens || 'FE 24-70mm f/2.8 GM',
        focalLength: body.photo.focalLength || '50mm',
        aperture: body.photo.aperture || 'f/2.8',
        shutterSpeed: body.photo.shutterSpeed || '1/500s',
        iso: body.photo.iso || '100',
        featured: Boolean(body.photo.featured),
        location: body.photo.location || '',
      };
      updatedPhotos = [newPhoto, ...updatedPhotos];
    }

    const updatedSettings = body.photographySettings
      ? { ...currentData.photographySettings, ...body.photographySettings }
      : currentData.photographySettings;

    const newData = {
      ...currentData,
      photos: updatedPhotos,
      photographySettings: updatedSettings,
    };

    await saveContent(newData);

    return NextResponse.json({
      success: true,
      photos: updatedPhotos,
      photographySettings: updatedSettings,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to save photography content' },
      { status: 500 }
    );
  }
}
