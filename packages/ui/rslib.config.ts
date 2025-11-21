import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSvgr } from '@rsbuild/plugin-svgr';
import { defineConfig, RslibConfig } from '@rslib/core';
import { ReplacePlugin } from './plugins/replace';

export default defineConfig(() => {
  return {
    source: {
      entry: {
        index: ['./src/**', '!src/**/*.md'],
      },
    },
    lib: [
      {
        bundle: false,
        dts: true,
        format: 'esm',
        output: {
          filename: {
            js: '[name].js',
          },
          distPath: {
            root: './esm',
          },
        },
      },
    ],
    tools: {
      rspack: (config) => {
        config.plugins.push(new ReplacePlugin());
      },
    },
    output: {
      target: 'web',
    },
    plugins: [
      pluginReact(),
      pluginSvgr({
        mixedImport: true,
        svgrOptions: { exportType: 'named' },
      }),
    ],
  } as RslibConfig;
});
