/**
 * An utility script to analyze and display information about the seeders configuration, including their dependencies and execution plan.
 * This can be used to verify that seeders are set up correctly before running them.
 * It discovers seeder files, loads their modules, performs a topological sort based on dependencies, and prints out the execution levels and details of each seeder;
 * without any real database operations.
 * @author TeRacksito
 * @TeRacksito
 */

import { join } from 'node:path';
import { discoverSeedFiles, loadSeederModules } from './loader';
import { topologicalSort } from './sorter';
import { ImportedSeederGraph, SeederModule } from './types';

async function main(): Promise<void> {
  console.info(`Analyzing seeders configuration...`);

  const seedsDir = join(__dirname, 'seeders');
  const filePaths = await discoverSeedFiles(seedsDir);

  if (filePaths.length === 0) {
    console.warn(`No seeder files found in '${seedsDir}'.`);
    return;
  }

  console.info(
    `Discovered ${filePaths.length} seeder file(s) in '${seedsDir}':`
  );

  const seederModules = await loadSeederModules(filePaths, seedsDir);

  if (seederModules.length === 0) {
    console.warn(`No valid seeder modules found in '${seedsDir}'.`);
    return;
  }

  console.info(
    `Loaded ${seederModules.length} seeder module(s) from seeder file(s).`
  );

  const levels = topologicalSort(seederModules);

  console.info(
    `\nExecution plan: ${levels.length} level(s), with ${seederModules.length} total seeder(s).`
  );

  levels.forEach((level, i) => {
    const levelNum = i + 1;
    const names = level.map((mod) => mod.name).join(', ');
    console.info(`Level ${levelNum}: [${names}]`);
  });

  const seederMap = new Map<string, SeederModule>();
  const dependant: ImportedSeederGraph = new Map();

  for (const seederModule of seederModules) {
    seederMap.set(seederModule.name, seederModule);
    dependant.set(seederModule.name, []);
  }

  for (const seederModule of seederModules) {
    const deps = seederModule.seeder.dependencies || [];
    for (const depSeeder of deps) {
      const currentDependant = dependant.get(depSeeder.name) || [];
      currentDependant.push(seederModule.name);
      dependant.set(depSeeder.name, currentDependant);
    }
  }

  console.info(`\nSeeder details:`);
  seederModules.forEach((mod) => {
    const depNames = mod.seeder.dependencies?.map((d) => d.name) || [];
    const depBy = dependant.get(mod.name) || [];
    console.info(
      `- ${mod.name} (depends on: [${depNames.join(', ')}], depended by: [${depBy.join(', ')}], options: ${JSON.stringify(mod.seeder.options)})`
    );
  });
}

if (require.main === module) {
  main()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error analyzing seeders: ', error);
      process.exit(1);
    });
}
