import { readdir, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { Seeder, SeederModule } from './types';
import { pathToFileURL } from 'node:url';

/**
 * Recursively discovers all .seeder.ts files in the given directory.
 */
export async function discoverSeedFiles(seedsDir: string): Promise<string[]> {
  const files: string[] = [];

  async function walk(dir: string) {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.seeder.ts')) {
        files.push(fullPath);
      }
    }
  }

  try {
    const stats = await stat(seedsDir);
    if (stats.isDirectory()) await walk(seedsDir);
    else console.warn(`Provided path '${seedsDir}' is not a directory.`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.warn(`Directory '${seedsDir}' does not exist.`);
      return [];
    }
    throw error;
  }

  return files;
}

export async function loadSeederModules(
  filePaths: string[],
  seedsDir: string
): Promise<SeederModule[]> {
  const seederModules: SeederModule[] = [];

  for (const filePath of filePaths) {
    try {
      const fileUrl = pathToFileURL(filePath).href;
      const seederModule = (await import(fileUrl)) as { default: Seeder };

      if (!seederModule.default) {
        console.warn(
          `Seeder file '${filePath}' does not export a default Seeder.`
        );
        continue;
      }

      const seeder = seederModule.default;

      if (!seeder.name || typeof seeder.seed !== 'function') {
        console.warn(
          `Seeder in '${filePath}' is missing required properties (name, seed function).`
        );
        continue;
      }

      const relativePath = relative(seedsDir, filePath);
      seederModules.push({ name: seeder.name, filePath: relativePath, seeder });
    } catch (error) {
      console.error(`Failed to load seeder from '${filePath}':`, error);
      throw error;
    }
  }

  return seederModules;
}
