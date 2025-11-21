import type postcss from 'postcss';
import { replace, ReplaceOptions } from './utils';
// 这个解决了 tailwindcss 类名中的符号替换问题
export interface PostcssClassProcessorOptions extends Omit<ReplaceOptions, 'content' | 'isPostcss'> {
  replace?: (str: string, isPostcss: boolean) => string;
}
export const postcssClassProcessor = (options: PostcssClassProcessorOptions = {}) => {
  const { replace: parentReplace, ...rest } = options;
  return (root: postcss.Root) => {
    root.walkRules((rule: postcss.Rule) => {
      // 或处理选择器中的 class（如 .my-class → .prefix-my-class）
      const regx = new RegExp(`^\\.${rest.prefix || 'fairystaro--'}`);
      if (regx.test(rule.selector)) {
        rule.selector =
          parentReplace?.(rule.selector, true) ||
          replace({
            ...rest,
            content: rule.selector,
            isPostcss: true,
          });
      }
    });
  };
};
