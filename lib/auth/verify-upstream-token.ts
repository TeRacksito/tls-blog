import 'server-only';

import { NODE_API_BASE_URL } from '@/lib/config/api';
import type { VerifyTokenResponse } from '@/lib/types/auth';

/**
 * Verifies a JWT token against the upstream auth API.
 */
export async function verifyUpstreamToken(
  token: string
): Promise<VerifyTokenResponse> {
  const response = await fetch(`${NODE_API_BASE_URL}/verify-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return { valid: false, error: 'Token verification failed' };
  }

  return response.json();
}
