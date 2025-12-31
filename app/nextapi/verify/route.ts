import { NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth/cookies-server';
import { verifyToken } from '@/lib/api/client';

/**
 * Token verification API endpoint.
 *
 * This endpoint checks the validity of the authentication token.
 * If valid, it returns user information and token expiration.
 */
export async function GET() {
  try {
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    const result = await verifyToken(token);

    if (result.valid) {
      return NextResponse.json({
        valid: true,
        user: result.user,
        exp: result.exp,
      });
    }

    return NextResponse.json({ valid: false }, { status: 401 });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
