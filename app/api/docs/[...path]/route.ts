import fs from 'fs';
import path from 'path';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    // Construct the file path from the URL parameters
    const filePath = params.path.join('/');
    const fullPath = path.join(process.cwd(), 'app', 'docs', 'content', `${filePath}.md`);

    // Check if file exists and read it
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: 'Documentation file not found' }, { status: 404 });
    }

    const content = fs.readFileSync(fullPath, 'utf-8');

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error reading documentation file:', error);
    return NextResponse.json({ error: 'Failed to read documentation file' }, { status: 500 });
  }
}
