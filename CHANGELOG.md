# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.2.1](https://github.com/drdevelop/babel-plugin-alias/compare/v1.2.0...v1.2.1) (2022-07-03)


### Bug Fixes

* The "path" argument must be of type string. Received undefined ([daa0b3c](https://github.com/drdevelop/babel-plugin-alias/commit/daa0b3cfecaa9509b15bcec2866227fc032bbced))

## [1.2.0](https://github.com/drdevelop/babel-plugin-alias/compare/v1.1.0...v1.2.0) (2022-07-03)


### Features

* support resolve the path of window system ([6cf4444](https://github.com/drdevelop/babel-plugin-alias/commit/6cf44444a04c8b839baac197704a507c07e473c9))

## 1.1.0 (2022-06-08)


### Features

* alias babel plugin ([4c51788](https://github.com/drdevelop/babel-plugin-alias/commit/4c517886a39f189632390c02b3f5046cdd59b44d))


### Bug Fixes

* when paths include alias "@/*", file import "@ant-design/icon", but it was been transformed the error path "../xxx".Actually, that can not transform, because it was not an alias path. ([3616fd3](https://github.com/drdevelop/babel-plugin-alias/commit/3616fd3b40aa06d49c7869ee5eb1603981c81a91))
