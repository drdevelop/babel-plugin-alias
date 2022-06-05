import * as path from 'path';
import PathHost from '../../core/pathHost';
// eslint-disable-next-line
const tsConfig = require('../tsconfig.json');

const root = '/User/project';

test('alias path to relative path for different begin dir', async () => {
  const { baseUrl, paths } = await tsConfig.compilerOptions;
  const pathHost = new PathHost({
    baseUrl: path.join(root, baseUrl),
    paths,
  });
  const absolutePath = pathHost.changeModulePath('/User/project/a/index.ts', '@test/b', 'relative');
  expect(absolutePath).toBe('../test/b');
})
