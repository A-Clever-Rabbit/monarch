import * as path from 'path'
import * as fs from 'fs'
import {createFileWithDirs} from '../utils/create-file-with-dirs'
import {kebabToPascal} from '../utils/strings'

const args = process.argv.slice(2);

const servicePath = args[0];
const serviceName = servicePath.split("/").pop()!;

const validTopLevelDirectories = [
  "application",
  "infrastructure",
  "domain"
]

const topLevelDirectory = servicePath.split("/")[0];
if(!validTopLevelDirectories.includes(topLevelDirectory)) {
  throw new Error(`Invalid top level directory: ${topLevelDirectory}`);
}

const filePath = path.join(process.cwd(), "imports", servicePath + ".ts");

if(fs.existsSync(filePath)) {
  throw new Error(`File already exists: ${filePath}`);
}

const contents =
`import {ServiceLocatorFunction} from '/imports/service-registry/locator'

export type I${kebabToPascal(serviceName)}Service = {

}

type Dependencies = {

}

export function create${kebabToPascal(serviceName)}Service(
  {

  }: Dependencies): I${kebabToPascal(serviceName)}Service {

  return {

  }
}

export function register${kebabToPascal(serviceName)}Service(locate: ServiceLocatorFunction) {
  return create${kebabToPascal(serviceName)}Service({

  });
}
`

createFileWithDirs(filePath, contents);


