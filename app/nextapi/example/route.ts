import { NextResponse } from 'next/server';

/**
 * Example protected API endpoint
 * This endpoint is automatically protected by the proxy
 *
 * WARNING: This is a test endpoint and will be deleted at some point.
 */
export async function GET() {
  return NextResponse.json({
    message: 'This is a protected API endpoint response!',
    data: {
      text: 'If you can see this, you are authenticated.',
      timestamp: new Date().toISOString(),
      info: 'This endpoint is protected by the proxy and requires a valid authentication token.',
    },
  });
}
