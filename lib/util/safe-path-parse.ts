import path from 'node:path';

export function safePathParse(baseDir: string, relativePath: string) {
  const safeBaseDir = path.resolve(baseDir);
  const resolveFullPath = path.resolve(safeBaseDir, relativePath);

  if (!resolveFullPath.startsWith(safeBaseDir)) {
    throw new Error(
      `Invalid file path: ${relativePath}. Path traversal is not allowed.`
    );
  }

  return path.parse(resolveFullPath);
}
