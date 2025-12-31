import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

/**
 * Public endpoint to test database connection.
 * This is not protected by authentication.
 *
 * WARNING: This is a test endpoint and will be deleted at some point.
 */
export async function GET() {
  try {
    const testTitle = await prisma.connectionTestTitle.findUnique({
      where: { id: 1 },
      select: { id: true, title: true, description: true },
    });

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
