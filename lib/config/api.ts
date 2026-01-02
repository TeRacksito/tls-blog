const defaultNodeApiBaseUrl = 'https://new.tls-unbound.es/api';
const defaultNextApiBaseUrl = '/nextapi';

/**
 * Node.js API base URL.
 */
export const NODE_API_BASE_URL =
  process.env.NODE_API_BASE_URL ?? defaultNodeApiBaseUrl;

/**
 * Next.js internal API base URL.
 */
export const NEXT_API_BASE_URL =
  process.env.NEXT_API_BASE_URL ?? defaultNextApiBaseUrl;
