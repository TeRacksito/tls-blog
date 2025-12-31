import { NODE_API_BASE_URL } from '@/lib/config/api';
import type {
  LoginRequest,
  LoginResponse,
  VerifyTokenResponse,
} from '@/lib/types/auth';

/**
 * Authenticate user with Node.js API
 */
export async function authenticateUser(
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

/**
 * Verify JWT token with Node.js API
 */
export async function verifyToken(token: string): Promise<VerifyTokenResponse> {
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
