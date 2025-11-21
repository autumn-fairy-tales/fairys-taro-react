import { RspackPluginInstance, Compiler, Compilation, sources } from '@rspack/core';
export class ReplacePlugin implements RspackPluginInstance {
  replace = (str: string) => {
    // /fairystaro--(\S+?)(?=[\s'"]|$)/g
    return str.replace(/fairystaro--(\S+?)(?=[\s'"]|$)/g, (match, p1) => {
      // console.log(match, p1)
      // : 替换 __mh__
      // / 替换 __xg__
      // [] 替换 __zkh1__  __zhk2__
      // () 替换 __xkh1__ __xkh2__
      // ! 替换 __gqh__
      // % 替换 __bfh__
      // * 替换 __x__
      // console.log('match ====>', match)
      return match
        .replace(/:/g, '__mh__')
        .replace(/\//g, '__xg__')
        .replace(/\[/g, '__zkh1__')
        .replace(/\]/g, '__zhk2__')
        .replace(/\(/g, '__xkh1__')
        .replace(/\)/g, '__xkh2__')
        .replace(/!/g, '__gqh__')
        .replace(/%/g, '__bfh__')
        .replace(/\*/g, '__x__');
    });
  };

  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap('ReplacePlugin', (compilation: Compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'ReplacePlugin',
          stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE,
        },
        (assets) => {
          for (const filename of Object.keys(assets)) {
            if (
              filename.endsWith('.js') ||
              filename.endsWith('.ts') ||
              filename.endsWith('.tsx') ||
              filename.endsWith('.jsx')
            ) {
              const source = assets[filename].source();
              const sourceStr = source.toString();
              assets[filename] = new sources.RawSource(this.replace(sourceStr));
              // console.log("sourceStr ====>", assets[filename].source().toString());
            }
          }
        },
      );
    });
  }
}
