import UnoCSS from '@unocss/postcss';
import { postcssClassProcessor } from "@fairys/taro-tools-plugins"

export default {
  plugins: [
    UnoCSS(),
    postcssClassProcessor({
      prefix: "fairystaroform__"
    }),
  ],
};