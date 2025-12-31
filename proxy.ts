import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/api/client';
import { getAuthToken } from './lib/auth/cookies-server';

/**
 * Public API routes that don't require authentication
 */
const PUBLIC_API_ROUTES = [
  '/nextapi/auth',
  '/nextapi/verify',
  '/nextapi/logout',
  '/nextapi/db-test',
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedApiRoute(pathname)) {
    return NextResponse.next();
  }

  const token = await getAuthToken(request);

  if (!token) {
    return createUnauthorizedResponse('Authentication required');
  }

  const verification = await verifyToken(token);

  if (!verification.valid) {
    return createInvalidTokenResponse();
  }

  return NextResponse.next();
}

/**
 * Returns true if the given pathname targets a protected API route.
 */
function isProtectedApiRoute(pathname: string): boolean {
  return pathname.startsWith('/nextapi/') && !isPublicRoute(pathname);
}

/**
 * Returns true if the pathname matches a public API route that does not
 * require authentication.
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_API_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Creates a 401 JSON response with the provided error message.
 */
function createUnauthorizedResponse(message: string): NextResponse {
  return NextResponse.json({ error: message }, { status: 401 });
}

/**
 * Creates a 401 response for an invalid/expired token and clears the
 * `auth_token` cookie from the response.
 */
function createInvalidTokenResponse(): NextResponse {
  const response = createUnauthorizedResponse('Invalid or expired token');
  response.cookies.delete('auth_token');
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
