import { TransactionContext } from '../seed';

export type SeederFunction = (tx: TransactionContext) => Promise<void>;

export type SeederOptions = {
  suppressDuplicateKeyErrors?: boolean;
};

export type Seeder = {
  name: string;
  dependencies: Seeder[];
  seed: SeederFunction;
  options?: SeederOptions;
};

export type SeederModule = {
  name: string;
  filePath: string;
  seeder: Seeder;
};

export type SeederGraph = Map<string, Set<string>>;
export type ImportedSeederGraph = Map<string, string[]>;

export type ExecutionLevel = SeederModule[];
