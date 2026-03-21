import 'server-only';

import { NODE_API_BASE_URL } from '@/lib/config/api';
import type { LoginRequest, LoginResponse } from '@/lib/types/auth';

/**
 * Authenticates credentials against the upstream auth API.
 */
export async function authenticateUpstreamUser(
  credentials: LoginRequest
): Promise<LoginResponse> {
  const response = await fetch(`${NODE_API_BASE_URL}/auth-user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Authentication failed');
  }

  return response.json();
}
