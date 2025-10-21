import { NextResponse } from 'next/server';
import { join } from 'path';
import { existsSync, readdirSync } from 'fs';

export async function GET() {
    try {
        const cwd = process.cwd();
        const html5Path = join(cwd, '..', '_html5');
        
        const debugInfo = {
            currentWorkingDirectory: cwd,
            html5Path: html5Path,
            html5Exists: existsSync(html5Path),
            html5Contents: existsSync(html5Path) ? readdirSync(html5Path) : 'Directory not found',
            project13Exists: existsSync(join(html5Path, 'Project13.html')),
            note: "This debug route helps troubleshoot the _html5 directory access"
        };
        
        return NextResponse.json(debugInfo);
        
    } catch (error) {
        return NextResponse.json({ 
            error: error.message,
            cwd: process.cwd()
        }, { status: 500 });
    }
}
