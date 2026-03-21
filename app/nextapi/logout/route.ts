import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { deleteAuthToken } from '@/lib/auth/cookies-server';
import { csrf } from '@/lib/security/csrf';

/**
 * Logout API endpoint.
 *
 * This endpoint deletes the authentication token cookie.
 */
export async function POST(request: NextRequest) {
  try {
    if (!csrf.validateRequest(request)) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      );
    }

    await deleteAuthToken();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
