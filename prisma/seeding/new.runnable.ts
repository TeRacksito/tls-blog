/**
 * An utility script to create a new seeder file with a predefined template.
 * @author TeRacksito
 * @TeRacksito
 */

import { createFile } from '@/lib/util/create-file';
import { safePathParse } from '@/lib/util/safe-path-parse';
import { join } from 'node:path';

function generateSeederTemplate(seederName: string): string {
  return `import { Seeder } from '../types';
  
  export default {
    name: '${seederName}',
    dependencies: [],
    options: {
      suppressDuplicateKeyErrors: false,
    },
    seed: async (tx) => {
      // TODO: Implement seeding logic here
      console.log('Hello world from seeder: ${seederName}!');
    },
  } satisfies Seeder;
  `;
}

async function main(): Promise<void> {
  const seederPath = process.argv[2];

  if (!seederPath) {
    console.error('Error: Seeder path argument is required.');
    console.info('Usage: pnpm run p:seed:new <SeederPath>');
    console.info(`Examples:`);
    console.info(`  pnpm run p:seed:new connection-test`);
    console.info(`  pnpm run p:seed:new users/create-admin-user`);
    console.info(`  pnpm run p:seed:new core/settings/default`);
    process.exit(1);
  }

  const targetDir = join(__dirname, 'seeders');
  const parsedPath = safePathParse(targetDir, seederPath);

  if (!parsedPath.name) {
    console.error(`Error: Invalid seeder name in path '${seederPath}'.`);
    process.exit(1);
  }

  if (parsedPath.ext) {
    console.error(
      `Error: Seeder path should not include a file extension. Received path: '${seederPath}'.`
    );
    process.exit(1);
  }

  const targetFileName = `${parsedPath.name}.seeder.ts`;
  const targetPath = join(parsedPath.dir, targetFileName);

  try {
    const content = generateSeederTemplate(parsedPath.name);
    await createFile(targetPath, { content });
    console.info(`Seeder file created successfully at: ${targetPath}`);
  } catch (error: unknown) {
    console.error(`Failed to create seeder file at path: ${targetPath}`);
    console.error((error as Error).message);
    process.exit(1);
  }

  console.info(`Next steps:`);
  console.info(`1. Implement the seeding logic in the generated file.`);
  console.info(
    `2. Run 'pnpm run p:seed:info' to see the seeder's position in the execution plan.`
  );
  console.info(`3. Run 'pnpm run p:seed' to execute the seeders.`);
}

if (require.main === module) {
  main()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('An unexpected error occurred:');
      console.error((error as Error).message);
      process.exit(1);
    });
}
