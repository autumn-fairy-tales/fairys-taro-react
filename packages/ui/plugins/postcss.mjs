import postcss from 'postcss';

function replaceSymbols(str) {
  return str.replace(/fairystaro--(\S+?)(?=[\s'"]|$)/g, (match, p1) => {
    // console.log(match, p1)
    // : 替换 __mh__
    // / 替换 __xg__
    // [] 替换 __zkh1__  __zhk2__
    // () 替换 __xkh1__ __xkh2__
    // ! 替换 __gqh__
    // % 替换 __bfh__
    // * 替换 __x__
    return match
      .replace(/\\:/g, '__mh__')
      .replace(/\\\//g, '__xg__')
      .replace(/\\\[/g, '__zkh1__')
      .replace(/\\\]/g, '__zhk2__')
      .replace(/\\\(/g, '__xkh1__')
      .replace(/\\\)/g, '__xkh2__')
      .replace(/\\!/g, '__gqh__')
      .replace(/\\%/g, '__bfh__')
      .replace(/\\\*/g, '__x__')
  })

}

// 这个解决了 tailwindcss 类名中的符号替换问题
export default function postcssClassProcessor(options = {}) {
  return (root) => {
    root.walkRules((rule) => {
      // 或处理选择器中的 class（如 .my-class → .prefix-my-class）
      // rule.selector = rule.selector.replace(/\.(\w+)/g, (match, p1) => `.prefix-${p1}`);
      // console.log('rule.selector ==1==>', rule.selector)
      if (/^\.fairystaro--/.test(rule.selector)) {
        rule.selector = replaceSymbols(rule.selector)
        // console.log("rule.selector ==2==>", rule.selector);
      }
      // 或处理选择器中的 class（如 .my-class → .prefix-my-class）
    });
  };
}
