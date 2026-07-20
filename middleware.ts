import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Protect POST, PUT, DELETE requests with CSRF token validation
export function middleware(request: NextRequest) {
  // Skip CSRF check for GET requests and static files
  if (request.method === 'GET' || request.nextUrl.pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  // Skip for auth endpoints (they handle their own validation)
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // For state-changing operations (POST, PUT, DELETE)
  if (['POST', 'PUT', 'DELETE'].includes(request.method)) {
    const csrfToken = request.headers.get('x-csrf-token');
    const sessionToken = request.cookies.get('authToken')?.value;

    // If user is authenticated, require CSRF token for API calls
    if (sessionToken) {
      if (!csrfToken) {
        return NextResponse.json(
          { message: 'CSRF token missing' },
          { status: 403 }
        );
      }

      // In a real app, you'd validate the token against the session
      // For now, we just check that it's present
      if (typeof csrfToken !== 'string' || csrfToken.length < 10) {
        return NextResponse.json(
          { message: 'Invalid CSRF token' },
          { status: 403 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match API routes
    '/api/:path*',
    // Match page routes but exclude static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
