/***
 * 设置值
 * @param object 任意对象
 * @param paths 值路径
 * @param nextValue 新值
 *
 * @description
 * 值不存在时，当 paths 路径中的值为 number 类型时，会创建一个空数组。当 paths 路径中的值为 string 类型时，会创建一个空对象。
 */
export function set<T>(state: any, paths: PropertyKey[], nextValue: T) {
  const _keys = [...paths];
  let current: any = state;
  const length = _keys.length - 1;
  for (let i = 0; i <= length; i++) {
    const key = _keys[i];
    const _current = current[key];
    // 应该判断下一个key的类型，而不是当前key的类型
    const nextKey = _keys[i + 1];
    /**
     * 如果下一个key不存在，且key是数字，那么创建一个空数组
     */
    if (typeof _current === 'undefined' && typeof nextKey === 'number') {
      current[key] = [];
    } else if (typeof _current === 'undefined' && typeof nextKey === 'string') {
      /**
       * 如果下一个key不存在，且key是字符串，那么创建一个空对象
       */
      current[key] = {};
    }
    // 判断最后一个，直接赋值
    if (i === length) {
      current[key] = nextValue;
    } else {
      current = current[key];
    }
  }
  return state;
}

/***
 * 获取值
 * @param value 任意值
 * @param segments 键路径
 */
export function get<TDefault = unknown>(value: any, segments: PropertyKey[]): TDefault {
  let current: any = value;
  for (const key of segments) {
    current = current?.[key];
  }
  return current;
}

/***
 * 格式化路径，将路径中的数组索引转换为数字
 * @param path 路径
 * @returns 格式化后的路径
 */
export function formatePath(path: PropertyKey) {
  if (typeof path !== 'string') {
    return [path];
  }
  return path
    .split(/[\.]/g)
    .reduce((pre, next) => {
      if (/\[[0-9]+\]$/.test(next)) {
        const _next = next.split(/\[/);
        let _nextValue: (string | number)[] = [];
        for (let index = 0; index < _next.length; index++) {
          const element = _next[index];
          if (/\]$/.test(element)) {
            // 去掉数组索引的方括号
            const _v = element.replace(/\]$/, '');
            // 转换为数字
            const v = Number.parseInt(_v);
            /**判断转换后和转换前的长度是否一致，一致则说明是数字*/
            if (_v.length === `${v}`.length && !Number.isNaN(v)) {
              _nextValue.push(v);
            } else {
              _nextValue.push(_v);
            }
          } else {
            _nextValue.push(element);
          }
        }
        return [...pre, ..._nextValue];
      }
      return [...pre, next];
    }, [] as (string | number)[])
    .map((item) => {
      if (typeof item === 'string') {
        return item.trim();
      }
      return item;
    })
    .filter((item) => item !== '');
}

/**格式化属性名*/
export function formateName(name?: string, parentName?: string) {
  if (parentName && name) {
    return parentName + '.' + name;
  } else if (parentName) {
    return parentName;
  } else if (name) {
    return name;
  }
  return '';
}
