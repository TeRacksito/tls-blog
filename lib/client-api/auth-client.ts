'use client';

import type { AuthUser } from '@/lib/types/auth';
import { CSRF_HEADER_NAME } from '../security/csrf';

interface VerifyResponse {
  valid: boolean;
  user?: string;
  iat?: number;
  exp?: number;
}

interface LoginResponse {
  user: string;
}

interface CsrfResponse {
  token?: string;
}

export const authClient = {
  async verifySession(): Promise<AuthUser | null> {
    const response = await fetch('/nextapi/verify', {
      method: 'GET',
      credentials: 'include',
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
    const response = await fetch('/nextapi/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: username, pass: password }),
      credentials: 'include',
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
    const csrfResponse = await fetch('/nextapi/csrf', {
      method: 'GET',
      credentials: 'include',
    });

    let csrfToken = '';
    if (csrfResponse.ok) {
      const csrfBody = (await csrfResponse.json()) as CsrfResponse;
      csrfToken = csrfBody.token ?? '';
    }

    const response = await fetch('/nextapi/logout', {
      method: 'POST',
      headers: {
        [CSRF_HEADER_NAME]: csrfToken,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      throw new Error(data.error || 'Logout failed');
    }
  },
};
