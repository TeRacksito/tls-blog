import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export default async function Home() {
  const testTitle = await prisma.connectionTestTitle.findUnique({
    where: { id: 1 },
    select: { id: true, title: true, description: true },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
      <main className="flex flex-col items-center gap-8 p-8">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
          TLS Web
        </h1>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Database Connection Test
          </h2>

          {testTitle ? (
            <div className="space-y-2">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                <span className="font-medium">ID:</span> {testTitle.id}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                <span className="font-medium">Title:</span> {testTitle.title}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                <span className="font-medium">Description:</span>{" "}
                {testTitle.description}
              </p>
              <p className="mt-4 text-sm font-medium text-green-600 dark:text-green-400">
                ✓ Database connected successfully
              </p>
            </div>
          ) : (
            <p className="text-sm text-red-600 dark:text-red-400">
              ✗ No data found
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
