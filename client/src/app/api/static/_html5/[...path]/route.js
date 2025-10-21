import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, statSync } from 'fs';

export async function GET(request, { params }) {
  try {
    // Await params to resolve it properly in Next.js 15
    const resolvedParams = await params;
    
    // Get the file path from the URL parameters
    const filePath = resolvedParams.path.join('/');
    
    // Construct the full path to the file in the _html5 directory
    // Go up from client directory to the root, then into _html5
    const rootDir = process.cwd();
    const fullPath = join(rootDir, '..', '_html5', filePath);
    
    console.log('=== HTML5 Static File Serving ===');
    console.log('Requested file:', filePath);
    console.log('Root dir:', rootDir);
    console.log('Full path:', fullPath);
    console.log('File exists:', existsSync(fullPath));
    
    // Security check: ensure the path is within the _html5 directory
    const normalizedPath = join(rootDir, '..', '_html5');
    if (!fullPath.startsWith(normalizedPath)) {
      console.log('Security check failed: Path outside _html5 directory');
      return new NextResponse('Forbidden', { status: 403 });
    }
    
    // Check if file exists
    if (!existsSync(fullPath)) {
      console.log('File not found:', fullPath);
      return new NextResponse('File not found: ' + fullPath, { status: 404 });
    }
    
    // Check if it's a directory (return 404 for directories)
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      return new NextResponse('Directory listing not allowed', { status: 404 });
    }
    
    // Read the file
    const fileContent = await readFile(fullPath);
    
    // Determine content type based on file extension
    const extension = filePath.split('.').pop().toLowerCase();
    let contentType = 'text/plain';
    
    switch (extension) {
      case 'html':
        contentType = 'text/html; charset=utf-8';
        break;
      case 'css':
        contentType = 'text/css; charset=utf-8';
        break;
      case 'js':
        contentType = 'application/javascript; charset=utf-8';
        break;
      case 'json':
        contentType = 'application/json; charset=utf-8';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg';
        break;
      case 'gif':
        contentType = 'image/gif';
        break;
      case 'mp3':
        contentType = 'audio/mpeg';
        break;
      case 'svg':
        contentType = 'image/svg+xml';
        break;
      case 'ico':
        contentType = 'image/x-icon';
        break;
      case 'wav':
        contentType = 'audio/wav';
        break;
      case 'ogg':
        contentType = 'audio/ogg';
        break;
      default:
        contentType = 'application/octet-stream';
    }
    
    // Return the file with appropriate headers
    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
        'Access-Control-Allow-Origin': '*', // Allow CORS for all origins
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
    
  } catch (error) {
    console.error('Error serving static file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
