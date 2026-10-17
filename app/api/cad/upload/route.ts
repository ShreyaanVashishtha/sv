import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

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

    const modelsDir = path.join(process.cwd(), 'public', 'models');
    if (!fs.existsSync(modelsDir)) {
      fs.mkdirSync(modelsDir, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(modelsDir, safeName);
    fs.writeFileSync(filePath, buffer);

    // Also mirror to scratch if present for development persistence
    const scratchDir = '/Users/shreyaan/.gemini/antigravity/scratch/sv7-dev/public/models';
    if (fs.existsSync('/Users/shreyaan/.gemini/antigravity/scratch/sv7-dev')) {
      if (!fs.existsSync(scratchDir)) {
        fs.mkdirSync(scratchDir, { recursive: true });
      }
      fs.writeFileSync(path.join(scratchDir, safeName), buffer);
    }

    return NextResponse.json({
      success: true,
      url: `/models/${safeName}`,
      fileName: safeName,
      originalName,
      format: ext === 'step' || ext === 'stp' ? 'stl' : ext,
      size: file.size,
    });
  } catch (error: any) {
    console.error('CAD file upload error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to upload CAD file' },
      { status: 500 }
    );
  }
}
