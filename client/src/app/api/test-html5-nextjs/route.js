import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET() {
    try {
        // Check if _html5 directory exists
        const html5Path = join(process.cwd(), '..', '_html5');
        
        if (!existsSync(html5Path)) {
            return NextResponse.json({ 
                message: "_html5 directory not found", 
                html5Path: html5Path,
                cwd: process.cwd()
            }, { status: 404 });
        }
        
        // Try to read Project13.html
        const project13Path = join(html5Path, 'Project13.html');
        
        if (!existsSync(project13Path)) {
            return NextResponse.json({ 
                message: "Project13.html not found", 
                html5Path: html5Path,
                project13Path: project13Path
            }, { status: 404 });
        }
        
        return NextResponse.json({ 
            message: "_html5 directory and Project13.html found!", 
            html5Path: html5Path,
            project13Path: project13Path,
            note: "The static file serving should work now"
        });
        
    } catch (error) {
        return NextResponse.json({ 
            message: "Error checking _html5 directory", 
            error: error.message,
            cwd: process.cwd()
        }, { status: 500 });
    }
}
