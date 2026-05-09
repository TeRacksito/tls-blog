import path from 'node:path';

/**
 * Parses a relative file path against a base directory,
 * ensuring that the resulting absolute path is contained within the base directory to prevent path traversal vulnerabilities..
 * @throws Error if the resolved path is outside of the base directory or if the relative path is invalid.
 * @author TeRacksito
 * @TeRacksito
 */
export function safePathParse(
  baseDir: string,
  relativePath: string
): path.ParsedPath {
  const safeBaseDir = path.resolve(baseDir);
  const resolveFullPath = path.resolve(safeBaseDir, relativePath);

  if (!resolveFullPath.startsWith(safeBaseDir)) {
    throw new Error(
      `Invalid file path: ${relativePath}. Path traversal is not allowed.`
    );
  }

  return path.parse(resolveFullPath);
}
