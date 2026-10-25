import { NextResponse } from 'next/server';
import { contractFromJson } from '@prisma/orm-postgres/static';
import { Contract } from '@/app/generated/prisma/contract';
import contractJson from '@/app/generated/prisma/contract.json';
import postgres from '@prisma/orm-postgres/runtime';

const contract = contractFromJson<Contract>(contractJson);
const db = postgres({ url: process.env.DATABASE_URL, contract });

/**
 * Public endpoint to test database connection.
 * This is not protected by authentication.
 *
 * WARNING: This is a test endpoint and will be deleted at some point.
 */
export async function GET() {
  try {
    const testTitle = await db.orm.public.ConnectionTestTitle.whereUnique({
      id: 1,
    })
      .select('id', 'title', 'description')
      .first();

    if (!testTitle) {
      return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }

    return NextResponse.json(testTitle);
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { error: 'Database connection failed' },
      { status: 500 }
    );
  }
}
