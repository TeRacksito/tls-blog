'use client';

import type { AuthUser } from '@/lib/types/auth';
import { fetchApi } from '@/lib/client-api/http-client';

interface VerifyResponse {
  valid: boolean;
  user?: string;
  iat?: number;
  exp?: number;
}

interface LoginResponse {
  user: string;
}

export const authClient = {
  async verifySession(): Promise<AuthUser | null> {
    const response = await fetchApi('/nextapi/verify', {
      method: 'GET',
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as VerifyResponse;

    if (!data.valid || !data.user) {
      return null;
    }

    return {
      user: data.user,
      iat: data.iat ?? 0,
      exp: data.exp ?? 0,
    };
  },

  async login(username: string, password: string): Promise<AuthUser> {
    const response = await fetchApi('/nextapi/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: username, pass: password }),
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      throw new Error(data.error || 'Login failed');
    }

    const data = (await response.json()) as LoginResponse;

    return {
      user: data.user,
      iat: 0,
      exp: 0,
    };
  },

  async logout(): Promise<void> {
    const response = await fetchApi('/nextapi/logout', {
      method: 'POST',
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      throw new Error(data.error || 'Logout failed');
    }
  },
};
