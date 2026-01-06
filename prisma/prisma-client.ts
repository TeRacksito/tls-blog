import { PrismaClient } from '../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

if (isSetAndNotEmpty('DATABASE_URL')) {
  throw new Error('DATABASE_URL environment variable is not set or is empty.');
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });

const createPrismaClient = () => {
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['warn', 'error'],
  }).$extends({
    result: {
      milestoneResource: {
        progressPercentage: {
          needs: { currentQuantity: true, targetQuantity: true },
          compute(resource) {
            if (resource.targetQuantity === 0) return 0;
            return Math.round(
              (resource.currentQuantity / resource.targetQuantity) * 100
            );
          },
        },
      },
    },
  });
};

declare global {
  var prisma: ReturnType<typeof createPrismaClient> | undefined;
}

export const prisma = globalThis.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export type ExtendedPrismaClient = typeof prisma;
