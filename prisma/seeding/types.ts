import { TransactionContext } from '../seed';

/**
 * An runnable function that performs data seeding operations using a provided transaction context.
 */
export type SeederFunction = (tx: TransactionContext) => Promise<void>;

export type SeederOptions = {
  /**
   * If true, suppresses errors caused by duplicate key violations during seeding.
   * This allows seeders to be idempotent and safely re-run without failing due to existing data.
   */
  suppressDuplicateKeyErrors?: boolean;
  /**
   * If true, indicates that the seeder should only be run in development environments.
   */
  devOnly?: boolean;
};

/**
 * Defines the structure of a Seeder.
 * It is expected that each seeder module exports a default object that satisfies this interface.
 */
export type Seeder = {
  /**
   * A unique name identifying the seeder.
   */
  name: string;
  /**
   * An optional array of Seeder instances that this seeder depends on.
   * These dependencies will be executed before the seeder itself is run.
   */
  dependencies?: Seeder[];
  /**
   * The runnable function that performs the seeding logic.
   * It receives a transaction context that can be used to execute database operations atomically.
   */
  seed: SeederFunction;
  options?: SeederOptions;
};

export type SeederModule = {
  /**
   * The name of the seeder.
   * This is the same as `seeder.name`.
   */
  name: string;
  filePath: string;
  seeder: Seeder;
};

/**
 * Graph representation of seeder dependencies, where each key is a seeder name and the value is a set of seeder names that depend on it.
 */
export type SeederGraph = Map<string, Set<string>>;

/**
 * Graph representation of imported seeders, where each key is a seeder name and the value is an array of file paths that import it.
 */
export type ImportedSeederGraph = Map<string, string[]>;

/**
 * All seeders on a given execution level must be runnable in parallel, as they should have no dependencies between them.
 */
export type ExecutionLevel = SeederModule[];
