/**
 * Node.js API base URL
 * - Development: Uses new.tls-unbound.es/api (direct API access)
 * - Production: Uses /api (proxied by nginx)
 */
export const NODE_API_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'https://new.tls-unbound.es/api'
    : '/api';

/**
 * Next.js internal API base URL
 */
export const NEXT_API_BASE_URL = '/nextapi';
