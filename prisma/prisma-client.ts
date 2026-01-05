import { PrismaClient } from '../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma = new PrismaClient({ adapter }).$extends({
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

export type ExtendedPrismaClient = typeof prisma;
