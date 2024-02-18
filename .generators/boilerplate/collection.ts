import * as path from 'path'
import * as fs from 'fs'
import {createFileWithDirs} from '../utils/create-file-with-dirs'
import {kebabToCamel, kebabToPascal} from '../utils/strings'

const args = process.argv.slice(2);

const collectionPath = args[0];
const collectionName = collectionPath.split("/").pop()!;

const collectionFilePath = path.join(process.cwd(), "imports", "infrastructure/db", collectionPath + ".ts");
const modelFilePath = path.join(process.cwd(), "imports", "domain/entities", collectionPath + ".ts");
const repoFilePath = path.join(process.cwd(), "imports", "repository", collectionPath + ".ts");

if(fs.existsSync(collectionFilePath)) {
  throw new Error(`File already exists: ${collectionFilePath}`);
}
if(fs.existsSync(modelFilePath)) {
  throw new Error(`File already exists: ${modelFilePath}`);
}
if(fs.existsSync(repoFilePath)) {
  throw new Error(`File already exists: ${repoFilePath}`);
}

const collectionFileContents =
`import {Mongo} from 'meteor/mongo'
import {${kebabToPascal(collectionName)}Document} from '/imports/domain/entities/${collectionPath}'

export const ${kebabToPascal(collectionName)}Collection = new Mongo.Collection<${kebabToPascal(collectionName)}Document>('${kebabToCamel(collectionName)}');
`
createFileWithDirs(collectionFilePath, collectionFileContents);

const modelFileContents =`
export type ${kebabToPascal(collectionName)}Document = {
  _id: string
  createdAt: Date
  updatedAt: Date
}
`
createFileWithDirs(modelFilePath, modelFileContents);

const repoFileContents =
`import {${kebabToPascal(collectionName)}Document} from '/imports/domain/entities/${collectionPath}'
import {${kebabToPascal(collectionName)}Collection} from '/imports/infrastructure/db/${collectionPath}'
import {createBaseRepositoryService, IRepository} from '/imports/repository/base-repository-service'
import {ServiceLocatorFunction} from '/imports/service-registry/locator'

import {IDateProvider} from '/imports/infrastructure/services/date/default-provider'

export type I${kebabToPascal(collectionName)}Repository = IRepository<${kebabToPascal(collectionName)}Document>

export function create${kebabToPascal(collectionName)}Repository(dateProvider?: IDateProvider): I${kebabToPascal(collectionName)}Repository {
  const service = createBaseRepositoryService(${kebabToPascal(collectionName)}Collection, dateProvider);
  return {
    ...service
  }
}

export function register${kebabToPascal(collectionName)}Repository(locate: ServiceLocatorFunction) {
  return create${kebabToPascal(collectionName)}Repository(
    locate<IDateProvider>("infrastructure/date/default-provider")
  );
}
`
createFileWithDirs(repoFilePath, repoFileContents);
