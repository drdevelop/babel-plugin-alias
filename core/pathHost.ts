import path from 'path';

class PathHost {
  baseUrl: string;
  paths: any;
  aliasMapPaths: any;

  constructor({baseUrl, paths}: any) {
    this.baseUrl = baseUrl;
    this.paths = paths;
    this.aliasMapPaths = this.transformConfigPaths(baseUrl, paths);
  }

  replaceStart(str: string, replaceStr: string, replaceValue: string) {
    if (str.indexOf(replaceStr) !== 0) return str;
    return replaceValue + str.slice(replaceStr.length);
  }

  clearAllMatchMark(str: string): string {
    return str.replace('*', '');
  }

  minimatch(origin: string, target: string) {
    target = this.clearAllMatchMark(target);
    return origin.indexOf(target) === 0;
  }

  normalizeSeparator(filePath: string) {
    const sysSeparator = path.sep;
    const filePathSeparator = '/';
    if (sysSeparator === filePathSeparator) return filePath;
    while (true) {
      if (!filePath.includes(sysSeparator)) {
        break;
      }
      filePath = filePath.replace(sysSeparator, filePathSeparator);
    }
    return filePath;
  }

  aliasToAbsolute(modulePath: string): string {
    const match: { value?: string; mapPath?: string } = {};
    Object.keys(this.aliasMapPaths).forEach(valuePath => {
      if (match.value) return;
      const matched = this.minimatch(modulePath, valuePath);
      match.value = matched && this.clearAllMatchMark(valuePath);
      if (match.value) {
        match.mapPath = this.clearAllMatchMark(this.aliasMapPaths[valuePath][0]);
      }
    })

    if (match.value) {
      return path.join(
        match.mapPath,
        this.replaceStart(modulePath, match.value, '')
      );
    }
    return modulePath;
  }

  transformConfigPaths(baseUrl: string, paths: any): any {
    const absolutePaths = {};
    Object.keys(paths).forEach(aliasName => {
      const relatePathValue: any = [];
      paths[aliasName].forEach((relatePath: string) => {
        relatePathValue.push(path.join(baseUrl, relatePath));
      })
      absolutePaths[aliasName] = relatePathValue;
    })
    return absolutePaths;
  }

  /**
   * change module path for file external module
   * @param {*} sourceText file source text
   * @param {*} aliasPath alias module path
   * @param {*} outputType the type of output external module path, for example: 'relative' | 'absolute'
   */
  changeModulePath(fileName: string, aliasPath: string, outputType: 'relative' | 'absolute'): string {
    const absolutePath = this.aliasToAbsolute(aliasPath);
    if (!path.isAbsolute(absolutePath)) {
      return aliasPath;
    }
    let replacePath;
    if (outputType === 'absolute') {
      replacePath = absolutePath;
    } else if (outputType === 'relative') {
      replacePath = this.getRelativeBetween2AbsolutePath(fileName, absolutePath);
    }
    return replacePath;
  }

  getRelativeBetween2AbsolutePath(fileName: string, importPath: string): string {
    // console.log('getRelativeBetween2AbsolutePath', fileName, importPath);
    const currDir = path.dirname(fileName);
    // console.log('currdir', currDir, importPath);
    const strHeap = currDir.split('');
    // computed between fileName and importPath common dir prefix
    let end = 0;
    for (let i = 0; i < strHeap.length; i++) {
      if (importPath[i] === strHeap[i]) {
        end = i;
      } else {
        break;
      }
    }
    // The path separator of window system is\, need according to different systems to split
    // Mac os is /, window is \
    const sysSeparator = path.sep;
    const oldMatchDir = currDir.slice(0, end + 1);
    const realMatchDir = oldMatchDir.split(sysSeparator).slice(0, -1).join(sysSeparator) + sysSeparator;
    // console.log('matchdir', oldMatchDir, realMatchDir, currDir)
    if (end === currDir.length - 1) {
      // The path to be imported is in the current directory
      return this.normalizeSeparator(
        this.replaceStart(importPath, currDir, '.')
      );
    } else {
      // The path to be imported is out the current directory
      const replacedMatchPart = this.replaceStart(fileName, realMatchDir, '');
      // If go out, real layers show be reduced 1
      const goOutLayers = replacedMatchPart.split(sysSeparator).length - 1;
      let layersStr = '';
      for (let i = 0; i < goOutLayers; i++) {
        layersStr += '../';
      }
      // clear tail separator
      return layersStr + this.normalizeSeparator(
        this.replaceStart(importPath, realMatchDir, '')
      );
    }
  }
}

export default PathHost;
