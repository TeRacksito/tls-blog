const TOKEN_COOKIE_NAME = 'auth_token';

/**
 * Get authentication token from cookie (client-side)
 */
export function getAuthTokenClient(): string | undefined {
  if (typeof document === 'undefined') return undefined;

  const cookies = document.cookie.split(';');
  const authCookie = cookies.find((cookie) =>
    cookie.trim().startsWith(`${TOKEN_COOKIE_NAME}=`)
  );

  return authCookie?.split('=')[1];
}

/**
 * Delete authentication token from cookie (client-side)
 */
export function deleteAuthTokenClient(): void {
  if (typeof document === 'undefined') return;

  document.cookie = `${TOKEN_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
