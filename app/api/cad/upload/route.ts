import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { redis } from '@/lib/redis';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

export const dynamic = 'force-dynamic';

function getMimeType(ext: string): string {
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

// Safely attempt local disk write (works in local dev, gracefully caught on serverless read-only containers)
function tryWriteLocal(safeName: string, buffer: Buffer): boolean {
  try {
    const modelsDir = path.join(process.cwd(), 'public', 'models');
    if (!fs.existsSync(modelsDir)) {
      fs.mkdirSync(modelsDir, { recursive: true });
    }
    fs.writeFileSync(path.join(modelsDir, safeName), buffer);

    const scratchDir = '/Users/shreyaan/.gemini/antigravity/scratch/sv7-dev/public/models';
    if (fs.existsSync('/Users/shreyaan/.gemini/antigravity/scratch/sv7-dev')) {
      if (!fs.existsSync(scratchDir)) {
        fs.mkdirSync(scratchDir, { recursive: true });
      }
      fs.writeFileSync(path.join(scratchDir, safeName), buffer);
    }
    return true;
  } catch (e) {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await verifySession(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized: Session expired or invalid.' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const originalName = file.name || 'cad-model.stl';
    const extMatch = originalName.match(/\.([a-zA-Z0-9]+)$/);
    const ext = extMatch ? extMatch[1].toLowerCase() : '';

    if (!['stl', 'glb', 'gltf', 'step', 'stp'].includes(ext)) {
      return NextResponse.json(
        { error: 'Invalid file format. Please upload .stl, .glb, .gltf, or .step CAD files.' },
        { status: 400 }
      );
    }

    // Sanitize file name: remove special chars, keep alphanumeric, dashes, dots
    const baseClean = originalName
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-');
    const safeName = `${baseClean}-${Date.now()}.${ext}`;
    const mimeType = getMimeType(ext);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Tier 1: Check Vercel Blob (if configured in environment)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { put } = await import('@vercel/blob');
        const blob = await put(`models/${safeName}`, buffer, {
          access: 'public',
          addRandomSuffix: false,
          contentType: mimeType,
        });

        // Mirror locally if writable
        tryWriteLocal(safeName, buffer);

        return NextResponse.json({
          success: true,
          url: blob.url,
          fileName: safeName,
          originalName,
          format: ext === 'step' || ext === 'stp' ? 'stl' : ext,
          size: file.size,
          storage: 'vercel-blob',
        });
      } catch (blobErr: any) {
        console.warn('Vercel Blob upload failed, attempting database storage:', blobErr);
      }
    }

    // 2. Tier 2: Check Upstash Redis Database (with gzip compression)
    if (redis) {
      try {
        const compressed = zlib.gzipSync(buffer);
        // Upstash REST API payload limit is ~1MB.
        if (compressed.length <= 950 * 1024) {
          const base64Data = compressed.toString('base64');
          await redis.set(`sv7:cad_file:${safeName}`, base64Data);
          await redis.set(`sv7:cad_meta:${safeName}`, {
            originalName,
            size: file.size,
            contentType: mimeType,
            compressed: true,
            createdAt: new Date().toISOString(),
          });

          // Mirror locally if writable
          tryWriteLocal(safeName, buffer);

          return NextResponse.json({
            success: true,
            url: `/api/cad/file/${safeName}`,
            fileName: safeName,
            originalName,
            format: ext === 'step' || ext === 'stp' ? 'stl' : ext,
            size: file.size,
            storage: 'redis',
          });
        }
      } catch (redisErr: any) {
        console.warn('Redis model storage failed:', redisErr);
      }
    }

    // 3. Tier 3: Local disk (development / writable filesystem)
    const writtenLocally = tryWriteLocal(safeName, buffer);
    if (writtenLocally) {
      return NextResponse.json({
        success: true,
        url: `/models/${safeName}`,
        fileName: safeName,
        originalName,
        format: ext === 'step' || ext === 'stp' ? 'stl' : ext,
        size: file.size,
        storage: 'local-disk',
      });
    }

    // 4. If all fail because file is too large for database and no Blob configured:
    return NextResponse.json(
      {
        error: `Serverless storage limit reached. This CAD file (${(file.size / 1024 / 1024).toFixed(1)} MB) exceeds database capacity. To host large files: 1) Enable Vercel Blob in your Vercel Dashboard (Storage -> Create Blob Store), 2) Add the .stl into "public/models/" in your Git repository, or 3) Paste a direct external URL (GitHub Raw, Printables, Google Drive, or Supabase).`,
        code: 'STORAGE_UNAVAILABLE',
      },
      { status: 413 }
    );
  } catch (error: any) {
    console.error('CAD file upload error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to upload CAD file' },
      { status: 500 }
    );
  }
}
