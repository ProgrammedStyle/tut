import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ 
        message: "Next.js API route is working!", 
        timestamp: new Date().toISOString(),
        note: "This confirms the Next.js API routes are functioning"
    });
}
