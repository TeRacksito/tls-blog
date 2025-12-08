import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export async function main() {
  try {
    await prisma.connectionTestTitle.create({
      data: {
        id: 1,
        title: "Connection Test!",
        description: "This is a test title to verify the database connection.",
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code !== "P2002") {
        throw e;
      }
    }
  }
}

main();
