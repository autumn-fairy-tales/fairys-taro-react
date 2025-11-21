import UnoCSS from '@unocss/postcss';
import postcssClassProcessor from './plugins/postcss.mjs';

export default {
  plugins: [
    UnoCSS(),
    postcssClassProcessor(),
  ],
};