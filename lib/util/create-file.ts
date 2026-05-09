import { promises } from 'node:fs';
import path from 'node:path';
import { safePathParse } from './safe-path-parse';

export type CreateFileOptions = {
  readonly filePrefix?: string;
  readonly fileSuffix?: string;
  readonly content?: string;
  readonly baseDir?: string;
};

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
