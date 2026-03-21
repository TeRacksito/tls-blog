import { NextResponse } from 'next/server';
import { csrf } from '@/lib/security/csrf';

export async function GET() {
  const token = await csrf.issueToken();
  return NextResponse.json({ token });
}
