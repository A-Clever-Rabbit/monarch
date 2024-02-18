import * as path from 'path'
import * as fs from 'fs'

export function createFileWithDirs(filePath: string, content: string) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}
