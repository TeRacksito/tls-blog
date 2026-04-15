import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerAuthSession } from '@/lib/auth/get-server-auth-session';
import { TOKEN_COOKIE_NAME } from '@/lib/types/auth';
import { csrf } from '@/lib/security/csrf';
import { rateLimiter } from '@/lib/security/rate-limit';

/**
 * Public API routes that don't require authentication
 */
const PUBLIC_API_ROUTES = [
  '/nextapi/auth',
  '/nextapi/verify',
  '/nextapi/db-test',
  '/nextapi/csrf',
];

const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  if (pathname.startsWith('/nextapi/auth') && method === 'POST') {
    const requestIp = getRequestIp(request);
    const authRateLimit = rateLimiter.consume({
      namespace: 'auth-login',
      key: requestIp,
      limit: 8,
      windowMs: 10 * 60 * 1000,
    });

    if (!authRateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts' },
        {
          status: 429,
          headers: { 'Retry-After': String(authRateLimit.retryAfterSeconds) },
        }
      );
    }
  }

  if (!isProtectedApiRoute(pathname)) {
    return NextResponse.next();
  }

  const hasToken = Boolean(request.cookies.get(TOKEN_COOKIE_NAME)?.value);

  if (!hasToken) {
    return createUnauthorizedResponse('Authentication required');
  }

  const session = await getServerAuthSession(request);

  if (!session) {
    return createInvalidTokenResponse();
  }

  if (isProtectedWriteMethod(method)) {
    if (!csrf.validateRequest(request)) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      );
    }

    const requestIp = getRequestIp(request);
    const rateLimit = rateLimiter.consume({
      namespace: 'protected-api-write',
      key: requestIp,
      limit: 60,
      windowMs: 60_000,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many write requests' },
        {
          status: 429,
          headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) },
        }
      );
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-auth-user', session.user);

  if (session.exp) {
    requestHeaders.set('x-auth-exp', String(session.exp));
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

function isProtectedWriteMethod(method: string): boolean {
  return WRITE_METHODS.has(method);
}

function getRequestIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  return realIp ?? 'unknown';
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
