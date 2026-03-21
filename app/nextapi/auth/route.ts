import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/api/client';
import { setAuthToken } from '@/lib/auth/cookies-server';
import type { LoginRequest } from '@/lib/types/auth';
import { rateLimiter } from '@/lib/security/rate-limit';

function getRequestIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  return realIp ?? 'unknown';
}

export async function POST(request: Request) {
  try {
    const requestIp = getRequestIp(request);
    const rateLimit = rateLimiter.consume({
      namespace: 'auth-login',
      key: requestIp,
      limit: 8,
      windowMs: 10 * 60 * 1000,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts' },
        {
          status: 429,
          headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) },
        }
      );
    }

    const body: LoginRequest = await request.json();

    if (!body.user || !body.pass) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const result = await authenticateUser(body);

    if (result.verified && result.token) {
      await setAuthToken(result.token);

      return NextResponse.json({
        success: true,
        user: body.user,
      });
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
