const DEFAULT_NODE_API_BASE_URL = 'https://new.tls-unbound.es/api';
const DEFAULT_NEXT_API_BASE_URL = '/nextapi';

/**
 * Node.js API base URL.
 */
export const NODE_API_BASE_URL =
  process.env.NODE_API_BASE_URL ?? DEFAULT_NODE_API_BASE_URL;

/**
 * Next.js internal API base URL.
 */
export const NEXT_API_BASE_URL =
  process.env.NEXT_API_BASE_URL ?? DEFAULT_NEXT_API_BASE_URL;
