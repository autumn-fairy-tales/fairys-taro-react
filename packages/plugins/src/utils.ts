import { transformSelector, transformEscapESelector, defaultRules } from 'unplugin-transform-class/utils';

/**
 * 处理特殊字符正则表达式
 */
export const defaultReplaceRules = {
  ...defaultRules,
  ':': '_mh_',
  '/': '_xg_',
  '[': '_zkh1_',
  ']': '_zhk2_',
  '(': '_xkh1_',
  ')': '_xkh2_',
  '!': '_gqh_',
  '%': '_bfh_',
  '*': '_x_',
} as const;

export interface ReplaceOptions {
  /**内容*/
  content: string;
  /**是否是postcss*/
  isPostcss?: boolean;
  /**前缀*/
  prefix?: string;
  /**替换规则*/
  replaceRules?: Record<string, string>;
}

export const replace = (options: ReplaceOptions) => {
  const { content, isPostcss = true, prefix = 'fairystaro__', replaceRules = defaultReplaceRules } = options;
  // /fairystaro__(\S+?)(?=[\s'"]|$)/g
  return content.replace(new RegExp(`${prefix}(\\S+?)(?=[\\s'"]|$)`, 'g'), (match) => {
    let _newStr = match;
    if (isPostcss) {
      _newStr = transformEscapESelector(_newStr, replaceRules);
    } else {
      _newStr = transformSelector(_newStr, replaceRules);
    }
    return _newStr;
  });
};
