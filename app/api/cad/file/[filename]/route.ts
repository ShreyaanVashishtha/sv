import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

export const dynamic = 'force-dynamic';

function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'stl':
      return 'model/stl';
    case 'glb':
      return 'model/gltf-binary';
    case 'gltf':
      return 'model/gltf+json';
    case 'step':
    case 'stp':
      return 'application/step';
    default:
      return 'application/octet-stream';
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = decodeURIComponent(params.filename);
    const safeName = path.basename(filename);
    const mimeType = getMimeType(safeName);

    // 1. Check local public/models directory first
    try {
      const localPath = path.join(process.cwd(), 'public', 'models', safeName);
      if (fs.existsSync(localPath)) {
        const fileBuffer = fs.readFileSync(localPath);
        return new NextResponse(fileBuffer, {
          headers: {
            'Content-Type': mimeType,
            'Content-Disposition': `inline; filename="${safeName}"`,
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    } catch (e) {
      // Local disk check skipped or not accessible in serverless
    }

    // 2. Check Redis database storage
    if (redis) {
      try {
        const base64Data = await redis.get<string>(`sv7:cad_file:${safeName}`);
        if (base64Data) {
          let buffer = Buffer.from(base64Data, 'base64');

          // Check if stored with gzip compression
          const meta = await redis.get<{ compressed?: boolean; contentType?: string }>(
            `sv7:cad_meta:${safeName}`
          );

          if (meta?.compressed) {
            try {
              buffer = zlib.gunzipSync(buffer);
            } catch (unzipErr) {
              console.warn('Gunzip failed, serving raw buffer:', unzipErr);
            }
          }

          return new NextResponse(buffer, {
            headers: {
              'Content-Type': meta?.contentType || mimeType,
              'Content-Disposition': `inline; filename="${safeName}"`,
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          });
        }
      } catch (redisErr) {
        console.warn('Redis file lookup failed:', redisErr);
      }
    }

    return NextResponse.json(
      { error: `CAD file '${safeName}' not found` },
      { status: 404 }
    );
  } catch (error: any) {
    console.error('Error serving CAD file:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to serve CAD file' },
      { status: 500 }
    );
  }
}
