import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname } = request.nextUrl;
    
    // Define protected routes
    const protectedRoutes = ['/Dashboard', '/dashboard'];
    
    // Check if the current path is a protected route or starts with a protected route
    const isProtectedRoute = protectedRoutes.some(route => 
        pathname === route || pathname.startsWith(route + '/')
    );
    
    if (isProtectedRoute) {
        // Since we're using localStorage + Authorization headers (not cookies),
        // let the client-side authentication handle the protection
        // This middleware will allow the request through and let the Dashboard
        // page's useProtectedRoute hook handle authentication
        console.log('Middleware: Allowing protected route through for client-side auth check:', pathname);
    }
    
    return NextResponse.next();
}

// Configure which routes should run the middleware
export const config = {
    matcher: [
        '/Dashboard/:path*',
        '/dashboard/:path*'
    ]
};

