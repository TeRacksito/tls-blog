import { cookies } from 'next/headers';
import { TOKEN_COOKIE_NAME } from '../types/auth';
import { NextRequest } from 'next/server';

/**
 * Set authentication token in cookie (server-side)
 */
export async function setAuthToken(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_COOKIE_NAME, token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60,
    path: '/',
  });
}

/**
 * Get authentication token from cookie (server-side)
 */
export async function getAuthToken(
  request?: NextRequest
): Promise<string | undefined> {
  if (request) {
    return request.cookies.get(TOKEN_COOKIE_NAME)?.value;
  }
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE_NAME)?.value;
}

/**
 * Delete authentication token from cookie (server-side)
 */
export async function deleteAuthToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE_NAME);
}
