import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

export const CSRF_COOKIE_NAME = 'csrf_token';
export const CSRF_HEADER_NAME = 'x-csrf-token';

function createToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

function timingSafeMatch(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export const csrf = {
  headerName: CSRF_HEADER_NAME,

  async issueToken(): Promise<string> {
    const cookieStore = await cookies();
    const existingToken = cookieStore.get(CSRF_COOKIE_NAME)?.value;

    if (existingToken) {
      return existingToken;
    }

    const token = createToken();

    cookieStore.set(CSRF_COOKIE_NAME, token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60,
      path: '/',
    });

    return token;
  },

  validateRequest(request: NextRequest): boolean {
    const headerToken = request.headers.get(CSRF_HEADER_NAME);
    const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;

    if (!headerToken || !cookieToken) {
      return false;
    }

    return timingSafeMatch(headerToken, cookieToken);
  },
};
