import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { DbClient } from '../seed';
import { discoverSeedFiles, loadSeederModules } from './loader';
import { topologicalSort } from './sorter';
import { ExecutionLevel, SeederModule } from './types';

/**
 * Executes a single seeder within a database transaction.
 * @param id A string identifier for logging purposes,
 * typically in the format 'LXX-YYY' where XX is the execution level and YYY is the index of the seeder within that level.
 * @author TeRacksito
 * @TeRacksito
 */
async function executeSeeder(
  seederModule: SeederModule,
  db: DbClient,
  id: string
): Promise<void> {
  console.info(
    `\t[${id}] Executing seeder '${seederModule.name}' from file '${seederModule.filePath}'...`
  );

  try {
    await db.$transaction(async (tx) => {
      await seederModule.seeder.seed(tx);
    });

    console.info(
      `\t[${id}] Seeder '${seederModule.name}' executed successfully.`
    );
  } catch (error) {
    const isPrismaError =
      error && error instanceof PrismaClientKnownRequestError;

    const isDuplicateKeyError = isPrismaError && error.code === 'P2002';

    if (
      isDuplicateKeyError &&
      seederModule.seeder.options?.suppressDuplicateKeyErrors
    ) {
      const tableName = (error.meta?.modelName as string) || '#UNKNOWN_TABLE';

      console.info(
        `\t[${id}] Seeder '${seederModule.name}' attempted to insert duplicate key into table '${tableName}', but this error is suppressed by seeder options.`
      );
      return;
    }

    console.error(
      `\t[${id}] Failed to execute seeder '${seederModule.name}' from file '${seederModule.filePath}'.`
    );
    throw error;
  }
}

/**
 * Executes all seeders in the given execution level in parallel.
 * @param levelIndex The index of the execution level (0-based). Used for logging purposes to indicate the current level being executed.
 * @author TeRacksito
 * @TeRacksito
 */
async function executeLevel(
  level: ExecutionLevel,
  levelIndex: number,
  db: DbClient
): Promise<void> {
  const levelNum = levelIndex + 1;

  const names = level.map((mod) => mod.name).join(', ');
  console.info(`\nExecuting level ${levelNum} with seeders: [${names}]`);

  await Promise.all(
    level.map((seeder, i) =>
      executeSeeder(
        seeder,
        db,
        `${levelNum.toString().padStart(3, '0')}-${(i + 1).toString().padStart(3, '0')}`
      )
    )
  );
}

/**
 * Discovers, sorts, and executes seeders found in the specified directory.
 * @param seedsDir The directory to search for seeder files. Each seeder file must export a default Seeder object.
 * @author TeRacksito
 * @TeRacksito
 */
export async function runSeeders(
  db: DbClient,
  seedsDir: string
): Promise<void> {
  console.info(`Reading '${seedsDir}' directory for seeders...`);

  const filePaths = await discoverSeedFiles(seedsDir);

  if (filePaths.length === 0) {
    console.warn(`No seeder files found in '${seedsDir}'.`);
    return;
  }

  console.info(`Discovered ${filePaths.length} seeder file(s).`);

  const seederModules = await loadSeederModules(filePaths, seedsDir);

  if (seederModules.length === 0) {
    console.warn(`No valid seeder modules found in '${seedsDir}'.`);
    return;
  }

  console.info(`Loaded ${seederModules.length} seeder module(s).`);

  const levels = topologicalSort(seederModules);

  console.info(
    `\nExecution plan: ${levels.length} level(s), with ${seederModules.length} total seeder(s).`
  );

  for (let i = 0; i < levels.length; i++) {
    const level = levels[i];
    if (level) {
      await executeLevel(level, i, db);
    }
  }

  console.info(`\nAll seeders executed successfully.`);
}
