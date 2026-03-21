import { NextResponse } from 'next/server';
import { deleteAuthToken } from '@/lib/auth/cookies-server';
import { getServerAuthSession } from '@/lib/auth/get-server-auth-session';

/**
 * Token verification API endpoint.
 *
 * This endpoint checks the validity of the authentication token.
 * If valid, it returns user information and token expiration.
 */
export async function GET() {
  try {
    const session = await getServerAuthSession();

    if (!session) {
      await deleteAuthToken();
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    return NextResponse.json({
      valid: true,
      user: session.user,
      exp: session.exp,
      iat: session.iat,
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
