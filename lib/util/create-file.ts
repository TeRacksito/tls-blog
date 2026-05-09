import { promises } from 'node:fs';
import path from 'node:path';
import { safePathParse } from './safe-path-parse';

export type CreateFileOptions = {
  /**
   * An optional prefix to be added to the file name (before the name and extension).
   */
  readonly filePrefix?: string;
  /**
   * An optional suffix to be added to the file name (after the name, at the extension).
   * Incompatible with file names that already include an extension.
   */
  readonly fileSuffix?: string;
  /**
   * The content to be written to the file. If not provided, an empty file will be created.
   */
  readonly content?: string;
  /**
   * The base directory from which the relative path will be resolved. Defaults to the current working directory.
   */
  readonly baseDir?: string;
};

/**
 * Creates a new file at the specified relative path with the given content and options.
 * Overwrite is not performed.
 * Intermediate directories will be created if they do not exist.
 * @param relativePath The relative path to the file to be created, relative to the baseDir.
 * @param optionsObject Options for file creation.
 * @returns The absolute path to the created file.
 * @throws Error if the file already exists, if the relative path is invalid, or if there is an issue with file system operations.
 * @author TeRacksito
 * @TeRacksito
 */
export async function createFile(
  relativePath: string,
  {
    filePrefix = '',
    fileSuffix = '',
    content = '',
    baseDir = process.cwd(),
  }: CreateFileOptions = {}
): Promise<string> {
  const parsedPath = safePathParse(baseDir, relativePath);

  if (!parsedPath.name) {
    throw new Error(`Invalid file name: ${relativePath}`);
  }

  if (parsedPath.ext && parsedPath.ext.length > 0 && fileSuffix !== '') {
    throw new Error(
      `File suffix cannot be added to a file with an extension. Incoherent file name: ${relativePath} with suffix: ${fileSuffix}
      If you want to add a suffix, please provide a file name without extension.`
    );
  }

  const targetDir = parsedPath.dir;
  const targetFileName = `${filePrefix}${parsedPath.name}${fileSuffix}${parsedPath.ext}`;
  const targetPath = path.join(targetDir, targetFileName);

  try {
    await promises.mkdir(targetDir, { recursive: true });

    await promises.writeFile(targetPath, content || '', { flag: 'wx' });

    return targetPath;
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === 'EEXIST') {
      throw new Error(
        `File already exists at path: ${targetPath}. Content was not overwritten.`
      );
    }
    throw error;
  }
}
