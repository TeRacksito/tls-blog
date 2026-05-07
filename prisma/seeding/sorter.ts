import { ExecutionLevel, SeederGraph, SeederModule } from './types';

export function topologicalSort(
  seederModules: SeederModule[]
): ExecutionLevel[] {
  const seederModuleMap = new Map<string, SeederModule>();
  const graph: SeederGraph = new Map();
  const inDegree = new Map<string, number>();

  for (const seederModule of seederModules) {
    if (seederModuleMap.has(seederModule.name)) {
      const existing = seederModuleMap.get(seederModule.name);
      throw new Error(
        `Duplicate seeder name '${seederModule.name}' found in files '${existing?.filePath}' and '${seederModule.filePath}'. Seeder names must be unique.`
      );
    }

    seederModuleMap.set(seederModule.name, seederModule);
    graph.set(seederModule.name, new Set());
    inDegree.set(seederModule.name, 0);
  }

  for (const seederModule of seederModules) {
    const dependencies = seederModule.seeder.dependencies || [];

    for (const depSeeder of dependencies) {
      if (!depSeeder || depSeeder.name === undefined) {
        throw new Error(
          `Seeder '${seederModule.name}' in file '${seederModule.filePath}' has an undefined dependency.
          This usually indicates a circular dependency or a missing import. Please check the dependencies of this seeder.`
        );
      }

      const depName = depSeeder.name;

      if (!seederModuleMap.has(depName)) {
        throw new Error(
          `Seeder '${seederModule.name}' in file '${seederModule.filePath}' has a dependency on '${depName}', which was not found among the discovered seeders.`
        );
      }

      graph.get(depName)?.add(seederModule.name);
      inDegree.set(
        seederModule.name,
        (inDegree.get(seederModule.name) || 0) + 1
      );
    }
  }

  const levels: ExecutionLevel[] = [];
  const processed = new Set<string>();
  let currentLevel: string[] = [];

  for (const [name, degree] of inDegree.entries()) {
    if (degree === 0) {
      currentLevel.push(name);
    }
  }

  while (currentLevel.length > 0) {
    const levelModules: SeederModule[] = [];

    for (const name of currentLevel) {
      const seederModule = seederModuleMap.get(name);
      if (seederModule) {
        levelModules.push(seederModule);
        processed.add(name);
      }
    }

    levels.push(levelModules);

    const nextLevel: string[] = [];

    for (const name of currentLevel) {
      const dependents = graph.get(name) || new Set();

      for (const dependent of dependents) {
        const newDegree = (inDegree.get(dependent) || 0) - 1;

        if (newDegree === 0) {
          nextLevel.push(dependent);
        }
      }
    }

    currentLevel = nextLevel;
  }

  if (processed.size !== seederModules.length) {
    const unprocessed = seederModules
      .filter((s) => !processed.has(s.name))
      .map((s) => s.name);
    throw new Error(
      `Circular dependency detected among seeders: {${unprocessed.join(', ')}}.`
    );
  }

  return levels;
}
