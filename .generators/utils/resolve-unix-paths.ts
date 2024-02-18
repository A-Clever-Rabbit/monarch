import * as path from 'path'

/**
 * Resolve unix style paths to OS independent paths making consideration for the source code root directory.
 * @param unixPath
 */
export function resolveUnixPaths(unixPath: string) {
  if(!unixPath.startsWith('/')) throw new Error('Path must start with a /');
  const parts = unixPath.split('/');
  void parts.shift();
  return path.join(process.cwd(), ...parts);
}
