import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Generate a CSRF token
 * In production, you should store this in a session
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Validate CSRF token
 * In production, you should verify against the session
 */
export function validateCSRFToken(token: string, sessionToken?: string): boolean {
  if (!token || typeof token !== 'string') {
    return false;
  }

  // Check token length (should be 64 chars for 32 bytes hex)
  if (token.length !== 64) {
    return false;
  }

  // Check that it's valid hex
  if (!/^[a-f0-9]{64}$/.test(token)) {
    return false;
  }

  return true;
}

/**
 * Get CSRF token from request
 * Checks header and body
 */
export function getCSRFTokenFromRequest(request: Request): string | null {
  // Check header first (recommended)
  const headerToken = request.headers.get('x-csrf-token');
  if (headerToken) {
    return headerToken;
  }

  // Fallback to body (for forms)
  // Note: This would need to be form data in a real app
  return null;
}

/**
 * Validate CSRF token in API route
 * Use this wrapper in protected API routes
 */
export function validateCSRFInRoute(request: NextRequest): NextResponse | null {
  const csrfToken = getCSRFTokenFromRequest(request);
  const sessionToken = request.cookies.get('authToken')?.value;

  // If user is authenticated, require CSRF token for POST/PUT/DELETE
  if (sessionToken && ['POST', 'PUT', 'DELETE'].includes(request.method)) {
    if (!csrfToken) {
      return NextResponse.json(
        { message: 'CSRF token missing' },
        { status: 403 }
      );
    }

    if (!validateCSRFToken(csrfToken)) {
      return NextResponse.json(
        { message: 'Invalid CSRF token' },
        { status: 403 }
      );
    }
  }

  return null; // Validation passed
}
