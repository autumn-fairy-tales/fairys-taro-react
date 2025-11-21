import { RspackPluginInstance, Compiler, Compilation, sources } from '@rspack/core';
import { replace, ReplaceOptions } from './utils';

export interface ReplacePluginOptions extends Omit<ReplaceOptions, 'content' | 'isPostcss'> {
  replace?: (str: string, isPostcss: boolean) => string;
}

export class ReplacePlugin implements RspackPluginInstance {
  options: ReplacePluginOptions;

  constructor(options: ReplacePluginOptions = {}) {
    this.options = options;
  }

  // 替换内容
  _replace = (str: string) => {
    const { replace: parentReplace, ...rest } = this.options;
    return parentReplace?.(str, false) || replace({ content: str, ...rest, isPostcss: false });
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
              assets[filename] = new sources.RawSource(this._replace(sourceStr));
            }
          }
        },
      );
    });
  }
}
