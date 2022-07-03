import path from 'path';
import PathHost from './pathHost';

const root = process.cwd();

// eslint-disable-next-line
const tsconfigInfo = require(path.join(root, './tsconfig.json'));

const setBaseUrl = tsconfigInfo.compilerOptions.baseUrl || './';
const baseUrl = path.join(root, setBaseUrl);
const aliasMapPaths = tsconfigInfo.compilerOptions.paths;
const pathHost = new PathHost({
  baseUrl,
  paths: aliasMapPaths,
})

export default function () {
  return {
    visitor: {
      ImportDeclaration(path: any, source: any) {
        if (!tsconfigInfo) {
          throw new Error('please set tsconfig.json');
        }
        if (!tsconfigInfo.compilerOptions || !(tsconfigInfo.compilerOptions && tsconfigInfo.compilerOptions.paths)) {
          throw new Error('please set tsconfig.json tsconfigInfo.compilerOptions.paths');
        }
        const oldImportDeclare = path.node.source.value;
        const fileName = source.filename;
        const relativePath = pathHost.changeModulePath(fileName, oldImportDeclare, 'relative');
        path.node.source.value = relativePath;
      }
    }
  }
}
