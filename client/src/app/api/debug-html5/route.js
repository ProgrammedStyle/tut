import { NextResponse } from 'next/server';
import { join } from 'path';
import { existsSync, readdirSync } from 'fs';

export async function GET() {
    try {
        const cwd = process.cwd();
        const html5Path = join(cwd, '..', '_html5');
        
        let html5Contents = 'Directory not found';
        if (existsSync(html5Path)) {
            try {
                const files = readdirSync(html5Path);
                html5Contents = files.slice(0, 20); // Show first 20 files
            } catch (err) {
                html5Contents = 'Error reading directory: ' + err.message;
            }
        }
        
        const debugInfo = {
            currentWorkingDirectory: cwd,
            html5Path: html5Path,
            html5Exists: existsSync(html5Path),
            html5Contents: html5Contents,
            project13Exists: existsSync(join(html5Path, 'Project13.html')),
            project13Path: join(html5Path, 'Project13.html'),
            note: "This debug route helps troubleshoot the _html5 directory access",
            deploymentEnvironment: process.env.RENDER ? 'Render.com' : 'Local'
        };
        
        return NextResponse.json(debugInfo);
        
    } catch (error) {
        return NextResponse.json({ 
            error: error.message,
            stack: error.stack,
            cwd: process.cwd()
        }, { status: 500 });
    }
}
