'use client';

import { CSRF_HEADER_NAME } from '@/lib/types/csrf';

const UNSAFE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

let csrfTokenCache: string | null = null;

interface CsrfResponse {
  token?: string;
}

function isUnsafeMethod(method: string): boolean {
  return UNSAFE_METHODS.has(method.toUpperCase());
}

async function fetchCsrfToken(forceRefresh = false): Promise<string> {
  if (!forceRefresh && csrfTokenCache) {
    return csrfTokenCache;
  }

  const response = await fetch('/nextapi/csrf', {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Unable to initialize CSRF token');
  }

  const body = (await response.json()) as CsrfResponse;
  const token = body.token;

  if (!token) {
    throw new Error('CSRF token missing in response');
  }

  csrfTokenCache = token;
  return token;
}

async function doFetch(
  input: string,
  init: RequestInit,
  csrfToken?: string
): Promise<Response> {
  const headers = new Headers(init.headers);

  if (csrfToken) {
    headers.set(CSRF_HEADER_NAME, csrfToken);
  }

  return fetch(input, {
    ...init,
    headers,
    credentials: init.credentials ?? 'include',
  });
}

/**
 * Browser HTTP helper for `/nextapi/*` calls.
 * Adds CSRF automatically to unsafe methods and retries once on 403.
 */
export async function fetchApi(
  input: string,
  init: RequestInit = {}
): Promise<Response> {
  const method = (init.method ?? 'GET').toUpperCase();

  if (!isUnsafeMethod(method)) {
    return doFetch(input, init);
  }

  const csrfToken = await fetchCsrfToken();
  let response = await doFetch(input, init, csrfToken);

  if (response.status !== 403) {
    return response;
  }

  const freshToken = await fetchCsrfToken(true);
  response = await doFetch(input, init, freshToken);

  return response;
}
