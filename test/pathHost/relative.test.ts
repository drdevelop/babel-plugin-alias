import * as path from 'path';
import PathHost from '@core/pathHost';

const tsConfig = {
  "compileOnSave": true,
  "compilerOptions": {
    "module": "commonjs",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "noImplicitAny": true,
    "suppressImplicitAnyIndexErrors": true,
    "lib": [
      "es5",
      "es2015",
      "es2017"
    ],
    "baseUrl": "./",
    "paths": {
      "@test/*": ["./test/*"]
    }
  },
  "include": [
    "bin",
    "core"
  ]
};

const root = '/User/project';

test('change module paths for file external modules', async () => {
  const { baseUrl, paths } = await tsConfig.compilerOptions;
  const pathHost = new PathHost({
    baseUrl: path.join(root, baseUrl),
    paths,
  });
  const absolutePath = pathHost.changeModulePath('/User/project/a/index.ts', '@test/b', 'relative');
  expect(absolutePath).toBe('../test/b');
})
