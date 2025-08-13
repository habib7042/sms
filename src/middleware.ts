import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname
  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedRoutes = ['/admin'];
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // If it's not a protected route, continue
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Check for session cookie
  const sessionCookie = request.cookies.get('admin_session');
  
  if (!sessionCookie || !sessionCookie.value) {
    // Redirect to home page if no session
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    // Parse session data
    const sessionData = JSON.parse(sessionCookie.value);
    
    // Check if session is expired (24 hours)
    const sessionAge = Date.now() - sessionData.timestamp;
    if (sessionAge > 24 * 60 * 60 * 1000) {
      // Session expired, redirect to home
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Session is valid, continue
    return NextResponse.next();
  } catch (error) {
    // Invalid session data, redirect to home
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: ['/admin/:path*']
};