import * as fs from 'fs'
import * as path from 'path'
import * as ts from 'typescript'

import {resolveUnixPaths} from '../utils/resolve-unix-paths'

const registryPath = "/imports/service-registry/symbols.ts";
const serviceRegistrationPath = "/imports/service-registry/services.ts";

const registryConfig = {
  "repository": "/imports/repository",
  "domain": "/imports/domain/services",
  "domain/events": "/imports/domain/events",
  "application": "/imports/application",
  "infrastructure": "/imports/infrastructure/services",
  "seeder": "/imports/seeder",
}

type ServiceRegistryEntry = {
  key: string,
  importPath: string,
  factoryFunction: string,
  instance: 'singleton' | 'transient'
}

const registryKeys = new Map<string, ServiceRegistryEntry>();

for(const key in registryConfig) {
  const importPath = registryConfig[key as keyof typeof registryConfig];
  const dir = resolveUnixPaths(importPath);
  const queue = [{ currentDir: dir, importPath }];

  while(queue.length > 0) {
    const { currentDir, importPath } = queue.shift()!;
    const filesOrDirs = fs.readdirSync(currentDir);
    for(const fileOrDir of filesOrDirs) {
      const fullPath = path.join(currentDir, fileOrDir);
      const stat = fs.statSync(fullPath);
      if(stat.isDirectory()) {
        queue.push({ currentDir: fullPath, importPath: importPath + "/" + fileOrDir });
      } else if(stat.isFile() && fileOrDir.endsWith(".ts")) {
        const contents = fs.readFileSync(fullPath, 'utf8');
        const source = ts.createSourceFile("temp.ts", contents, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

        // Find an exported const that starts with the string "register" and is a function of type ServiceCreator

        // Find an exported function that starts with the string "create"
        const registerFunction = source.statements.find(statement => {
          if(!ts.isFunctionDeclaration(statement)) {
            return false;
          }
          if(!statement.modifiers) {
            return false;
          }
          if(!statement.modifiers.find(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword)) {
            return false;
          }

          return statement.name?.getText().startsWith("register");
        }) as ts.FunctionDeclaration | undefined;

        if(registerFunction && registerFunction.name) {
          const registryKey = key + fullPath.replace(dir, "")
            .replace(/\\/g, "/")
            .replace(".ts", "");

          // console.log(registerFunction.name.getText(), registerFunction.parameters.map(p => p.getText()));

          registryKeys.set(registryKey, {
            key: registryKey,
            importPath: importPath + "/" + fileOrDir.replace(".ts", ""),
            factoryFunction: registerFunction.name.getText(),
            // instance: registerFunction.name.getText().startsWith('registerTransient') ? 'transient' : 'singleton'
            instance: 'transient'
          });
        }
      }
    }
  }
}

function registerServicesFunctionTemplate(entries: ServiceRegistryEntry[], functionName: string, file: fs.WriteStream) {
  file.write(`export function ${functionName}() {\n`);
  for (const service of entries) {
    file.write(`\tcontainer.register(registry["${service.key}"], ${service.instance}(${service.factoryFunction}));\n`);
  }
  file.write("}\n")
}

/**
 * Write the registry file.
 */
const registryFile = fs.createWriteStream(resolveUnixPaths(registryPath));
registryFile.write(`/**
 * --------------------------------------
 * GENERATED CODE - DO NOT MODIFY BY HAND
 * --------------------------------------
 */\n`);
registryFile.write(`export const registry = {\n`);
for(const [ registryKey ] of registryKeys) {
  registryFile.write(`\t"${registryKey}": Symbol.for("${registryKey}"),\n`);
}
registryFile.write(`} as const\n`);
registryFile.close();

// Write import statements for each service
const servicesFile = fs.createWriteStream(resolveUnixPaths(serviceRegistrationPath));
servicesFile.write(`/**
 * --------------------------------------
 * GENERATED CODE - DO NOT MODIFY BY HAND
 * --------------------------------------
 */\n`);
for(const [, service] of registryKeys) {
  servicesFile.write(`import {${service.factoryFunction}} from '${service.importPath}'\n`);
}
servicesFile.write("\n");
servicesFile.write("import {ServiceConfig, ServiceCreator, ServiceLocator} from './service-locator'\n");
servicesFile.write(`import {registry} from './symbols'\n`);
servicesFile.write("\n");
servicesFile.write("const container = ServiceLocator.instance;\n");
servicesFile.write("\n");
// servicesFile.write(`const singleton = (create: ServiceCreator): ServiceConfig => ({ lifecycle: "singleton", create })\n`);
servicesFile.write(`const transient = (create: ServiceCreator): ServiceConfig => ({ lifecycle: "per-request", create })\n`);
// servicesFile.write(`const factory = (create: ServiceCreator): ServiceConfig => ({ lifecycle: "per-request", create })\n`);
servicesFile.write("\n");
// Write the registration statements for each service
registerServicesFunctionTemplate(Array.from(registryKeys.values()), "register", servicesFile);

servicesFile.close();

