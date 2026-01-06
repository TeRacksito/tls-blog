/**
 * Checks whether an environment variable is defined.
 * @param key - The environment variable name.
 * @returns true if the variable exists on process.env.
 */
function isSet(key: string | undefined): boolean {
  if (!key) return false;
  return typeof process.env[key] !== 'undefined';
}

/**
 * Checks whether an environment variable is defined and not empty.
 * @param key - The environment variable name.
 * @returns true if the variable exists and contains a non-whitespace value.
 */
function isSetAndNotEmpty(key: string | undefined): boolean {
  if (!key) return false;
  const value = process.env[key];
  if (typeof value !== 'string') return false;
  return value.trim().length > 0;
}
