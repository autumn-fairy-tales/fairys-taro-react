export const replaceRegx = [
  [':', '__mh__'],
  ['\\/', '__xg__'],
  ['\\[', '__zkh1__'],
  ['\\]', '__zhk2__'],
  ['\\(', '__xkh1__'],
  ['\\)', '__xkh2__'],
  ['\\!', '__gqh__'],
  ['%', '__bfh__'],
  ['\\*', '__x__'],
];

export interface ReplaceOptions {
  /**内容*/
  content: string;
  /**是否是postcss*/
  isPostcss?: boolean;
  /**前缀*/
  prefix?: string;
  /**替换规则*/
  regexList?: Array<[string, string]>;
}

export const replace = (options: ReplaceOptions) => {
  const { content, isPostcss = true, prefix = 'fairystaro--', regexList = replaceRegx } = options;
  // /fairystaro--(\S+?)(?=[\s'"]|$)/g
  return content.replace(new RegExp(`${prefix}(\\S+?)(?=[\\s'"]|$)`, 'g'), (match) => {
    let _newStr = match;
    for (let index = 0; index < regexList.length; index++) {
      const item = regexList[index];
      if (isPostcss) {
        _newStr = _newStr.replace(new RegExp(`\\\\${item[0]}`, 'g'), item[1]);
      } else {
        _newStr = _newStr.replace(new RegExp(`${item[0]}`, 'g'), item[1]);
      }
    }
    return _newStr;
  });
};
