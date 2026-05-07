import { PrismaClient } from '@/app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { join } from 'path';
import { runSeeders } from './seeding/runner';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const seedsDir = join(__dirname, 'seeding', 'seeders');

/**
 * Abstract type for the ORM client.
 */
export type DbClient = typeof prisma;

/**
 * Abstract type for the ORM transaction context.
 */
export type TransactionContext = Parameters<
  Parameters<DbClient['$transaction']>[0]
>[0];

export async function main() {
  console.info('Starting database seeding process...');

  try {
    await runSeeders(prisma, seedsDir);
  } catch (error) {
    console.error('Error seeding database: ', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
