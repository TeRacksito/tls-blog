import { NextResponse } from 'next/server';
import { deleteAuthToken } from '@/lib/auth/cookies-server';

/**
 * Logout API endpoint.
 *
 * This endpoint deletes the authentication token cookie.
 */
export async function POST() {
  try {
    await deleteAuthToken();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
