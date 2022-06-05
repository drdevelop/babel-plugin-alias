# babel-plugin-alias

This is an alias conversion babel plugin

## Install

install with npm:
```
npm install --save-dev babel-plugin-alias
```

install with yarn:
```
yarn add babel-plugin-alias -dev
```

## Quickstart

### Usage 1: integrate into typescript
1. config tsconfig.json
demo(paths is the same as what you normally configure):
```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@test/*": ["./test/*"]
    }
  },
}
```

2. babel config
```json
  // babel.config.json or .babelrc or babel.config.js
  {
    "plugins": ["babel-plugin-alias"]
  }
```

3. file import
- module test/a.ts
```ts
  import b from '@test/b';
  console.log('module a run success !!!', b);
```

- module test/b.ts
```ts
  console.log('module b run success !!!');
  export default 1;
```
