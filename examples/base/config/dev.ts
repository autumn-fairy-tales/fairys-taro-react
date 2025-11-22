import type { UserConfigExport } from '@tarojs/cli';

export default {
  mini: {
    debugReact: true,
  },
  h5: {
    devServer: {
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:9012', // 后端地址
          changeOrigin: true,
          // pathRewrite: {
          //   '^/api': ''
          // }
        },
      },
    },
  },
} as UserConfigExport<'vite'>;
