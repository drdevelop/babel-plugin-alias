import * as path from 'path';
import PathHost from '../../core/pathHost';
// eslint-disable-next-line
const tsConfig = require('../tsconfig.json');

const root = '/User/project';

test('alias path to relative path for same begin dir', () => {
  const { baseUrl, paths } = tsConfig.compilerOptions;
  const pathHost = new PathHost({
    baseUrl: path.join(root, baseUrl),
    paths,
  });
  const absolutePath = pathHost.changeModulePath('/User/project/test/a.ts', '@test/b/index', 'relative');
  expect(absolutePath).toBe('./b/index');
})

test('alias path to relative path for child dir', async () => {
  const { baseUrl, paths } = await tsConfig.compilerOptions;
  const pathHost = new PathHost({
    baseUrl: path.join(root, baseUrl),
    paths,
  });
  const absolutePath = pathHost.changeModulePath('/User/project/test/a.ts', '@test/b', 'relative');
  expect(absolutePath).toBe('./b');
})
