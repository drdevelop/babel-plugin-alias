import * as path from 'path';
import PathHost from '../../core/pathHost';
// eslint-disable-next-line
const tsConfig = require('../tsconfig.json');

const root = '/User/project';

test('similar match but not matched', () => {
  const { baseUrl, paths } = tsConfig.compilerOptions;
  const pathHost = new PathHost({
    baseUrl: path.join(root, baseUrl),
    paths,
  });
  const absolutePath = pathHost.changeModulePath('/User/project/a/index.ts', '@ant-design/icon', 'relative');
  expect(absolutePath).toBe('@ant-design/icon');
})
