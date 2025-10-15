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
        // Check if user has authentication cookie
        const token = request.cookies.get('token');
        
        console.log('Middleware checking route:', pathname);
        console.log('Token present:', !!token);
        
        if (!token) {
            console.log('No token found - redirecting to /SignIn');
            // Redirect to sign in if not authenticated
            const signInUrl = new URL('/SignIn', request.url);
            return NextResponse.redirect(signInUrl);
        }
        
        console.log('Token found - allowing access');
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

