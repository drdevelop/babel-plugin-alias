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

  getHeadReg(oldRegStr: string): RegExp {
    return new RegExp(`^(${oldRegStr})`);
  }

  clearAllMatchMark(str: string): string {
    return str.replace('*', '');
  }

  aliasToAbsolute(modulePath: string): string {
    const match: { value?: string; mapPath?: string } = {};
    Object.keys(this.aliasMapPaths).forEach(valuePath => {
      if (match.value) return;
      const regStr = this.getHeadReg(valuePath);
      const matchModulePath = new RegExp(regStr).exec(modulePath);
      match.value = matchModulePath && matchModulePath[0];
      if (match.value) {
        match.mapPath = this.clearAllMatchMark(this.aliasMapPaths[valuePath][0]);
      }
    })

    if (match.value) {
      const replaceReg = this.getHeadReg(match.value);
      return path.join(match.mapPath, modulePath.replace(replaceReg, ''));
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
    // console.log('aliasToAbsolute', fileName, absolutePath, path.isAbsolute(absolutePath));
    if (!path.isAbsolute(absolutePath)) {
      return aliasPath;
    }
    let replacePath;
    if (outputType === 'absolute') {
      replacePath = absolutePath;
    } else if (outputType === 'relative') {
      // console.log('[absolutePath]', absolutePath)
      replacePath = this.getRelativeBetween2AbsolutePath(fileName, absolutePath);
    }
    return replacePath;
  }

  getRelativeBetween2AbsolutePath(fileName: string, importPath: string): string {
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
    const oldMatchDir = currDir.slice(0, end + 1);
    const realMatchDir = oldMatchDir.split('/').slice(0, -1).join('/') + '/';
    // console.log('matchdir', oldMatchDir, realMatchDir, currDir)
    if (end === currDir.length - 1) {
      // The path to be imported is in the current directory
      return importPath.replace(this.getHeadReg(currDir), '.');
    } else {
      // The path to be imported is out the current directory
      // The path separator of window system is\, need according to different systems to split
      // Mac os is /, window is \
      const replacedMatchPart = fileName.replace(this.getHeadReg(realMatchDir), '');
      // If go out, real layers show be reduced 1
      const goOutLayers = replacedMatchPart.split('/').length - 1;
      let layersStr = '';
      for (let i = 0; i < goOutLayers; i++) {
        layersStr += '../';
      }
      // clear tail separator
      return layersStr + importPath.replace(this.getHeadReg(realMatchDir), '');
    }
  }
}

export default PathHost;
