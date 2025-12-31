import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/api/client';
import { setAuthToken } from '@/lib/auth/cookies-server';
import type { LoginRequest } from '@/lib/types/auth';

export async function POST(request: Request) {
  try {
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
