import { View, Text } from '@tarojs/components';
import { Cascader, CascaderProps, CascaderOption } from '@nutui/nutui-react-taro';
import { useMemo, useState } from 'react';
import clsx from 'clsx';

export interface FairysTaroCascaderProps
  extends Omit<Partial<CascaderProps>, 'visible' | 'onClose' | 'onChange' | 'value'> {
  placeholder?: string;
  labelInValue?: boolean;
  value?: (string | number | CascaderOption)[];
  onChange?: (value: (string | number | CascaderOption)[], pathNodes: CascaderOption[]) => void;
  bodyClassName?: string;
  bodyStyle?: React.CSSProperties;
}

export const FairysTaroCascaderBase = (props: FairysTaroCascaderProps) => {
  const {
    placeholder = '请选择',
    value,
    className,
    style,
    onChange,
    labelInValue = true,
    options,
    optionKey,
    bodyClassName,
    bodyStyle,
    ...rest
  } = props;
  const [visible, setVisible] = useState(false);

  const valueKey = optionKey?.valueKey || 'value';
  const textKey = optionKey?.textKey || 'text';
  const childrenKey = optionKey?.childrenKey || 'children';

  const render = useMemo(() => {
    if (Array.isArray(value) && value.length) {
      if (labelInValue) {
        return value
          .map((it) => {
            if (typeof it === 'string' || typeof it === 'number') {
              return it;
            }
            if (labelInValue) {
              return it?.[textKey] || '';
            }
            return '';
          })
          .filter(Boolean)
          .join('/');
      } else {
        // 通过 options 获取数据
        const _value = [];
        let _options = options || [];
        while (_options.length) {
          const it = _options.shift();
          if (typeof it === 'string' || typeof it === 'number') {
            const findx = _options.findIndex((it) => it[valueKey] === it);
            if (findx) {
              _value.push(it?.[textKey]);
              _options = it?.[childrenKey] || [];
            } else {
              // 没有找到对应的文本，跳出循环
              break;
            }
          } else {
            // 没有找到对应的文本，跳出循环
            break;
          }
        }
        return _value.join('/');
      }
    }
    return '';
  }, [value, labelInValue, valueKey, textKey]);

  const clsx_text = useMemo(() => {
    return clsx('fairys-taro-cascader-text', {
      'fairys-taro-cascader-text-placeholder fairystaroform__text-gray-600 fairystaroform__font-normal': !render,
      'fairys-taro-cascader-text-value fairystaroform__text-black': render,
    });
  }, [render]);

  const _value = useMemo(() => {
    if (Array.isArray(value) && value.length) {
      return value
        .map((it) => {
          if (typeof it === 'string' || typeof it === 'number') {
            return it;
          }
          if (labelInValue) {
            return it[valueKey];
          }
          return '';
        })
        .filter((it) => it !== '');
    }
    return [];
  }, [value, labelInValue, valueKey]);

  return (
    <View className={`fairys-taro-cascader ${className || ''}`} style={style}>
      <Text onClick={() => setVisible(true)} className={clsx_text}>
        {render || placeholder}
      </Text>
      <Cascader
        {...rest}
        className={`fairys-taro-cascader-body fairystaroform__text-left ${bodyClassName || ''}`}
        style={bodyStyle}
        optionKey={optionKey}
        options={options}
        value={_value}
        visible={visible}
        onChange={(value, pathNodes) => {
          if (labelInValue) {
            const _value = pathNodes.map((it) => {
              const { children, ...rest } = it;
              return rest;
            });
            onChange?.(_value, pathNodes);
          } else {
            onChange?.(value, pathNodes);
          }
        }}
        onClose={() => setVisible(false)}
      />
    </View>
  );
};
