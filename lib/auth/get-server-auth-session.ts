import 'server-only';

import type { NextRequest } from 'next/server';
import { getAuthToken } from '@/lib/auth/cookies-server';
import { verifyUpstreamToken } from '@/lib/auth/verify-upstream-token';

export interface ServerAuthSession {
  token: string;
  user: string;
  exp?: number;
  iat?: number;
}

/**
 * Resolves and validates the current authenticated server session.
 */
export async function getServerAuthSession(
  request?: NextRequest
): Promise<ServerAuthSession | null> {
  const token = await getAuthToken(request);

  if (!token) {
    return null;
  }

  const verification = await verifyUpstreamToken(token);

  if (!verification.valid || !verification.user) {
    return null;
  }

  return {
    token,
    user: verification.user,
    exp: verification.exp,
    iat: verification.iat,
  };
}
