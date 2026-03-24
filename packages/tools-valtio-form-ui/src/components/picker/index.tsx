import { View } from '@tarojs/components';
import { Picker, TaroPickerProps, PickerOptions, PickerOption } from '@nutui/nutui-react-taro';
import { useMemo, useState } from 'react';
import { FairysTaroTextClearBase } from 'components/clear';

export interface FairysTaroPickerProps extends Omit<Partial<TaroPickerProps>, 'value' | 'onChange'> {
  placeholder?: string;
  value?: PickerOptions | PickerOption | string | number | undefined | (string | number)[];
  onChange?: (value: FairysTaroPickerProps['value']) => void;
  bodyClassName?: string;
  bodyStyle?: React.CSSProperties;
  disabled?: boolean;
  labelInValue?: boolean;
}

export const FairysTaroPickerBase = (props: FairysTaroPickerProps) => {
  const {
    placeholder = '请选择',
    bodyClassName,
    bodyStyle,
    className,
    style,
    value,
    onChange,
    options,
    disabled,
    labelInValue = true,
    ...rest
  } = props;
  const [visible, setVisible] = useState(false);
  // 根据 options 长度进行判断是否为单层级, 单层的value存储对象，多层的存储数组
  const isSingle = (options || []).length <= 1;

  // 获取数据
  const _values = useMemo(() => {
    if (labelInValue) {
      return value;
    } else {
      if (isSingle) {
        const list = options?.[0] || [];
        const findItem = list.find((item) => item?.value === value);
        return findItem;
      } else {
        if (Array.isArray(value)) {
          let _values: PickerOption[] = [];
          for (let index = 0; index < value.length; index++) {
            const key = value[index] as unknown as string | number;
            const findItem = (options[index] || []).find((item) => item?.value === key);
            if (findItem) {
              _values.push(findItem);
            }
          }
          return _values;
        } else {
          return undefined;
        }
      }
    }
  }, [value, options, labelInValue, isSingle]);

  const _renderValue = useMemo(() => {
    if (isSingle) {
      return (_values as PickerOption)?.label || '';
    }
    if (Array.isArray(_values)) {
      return _values.map((item) => item.label).join(' / ');
    }
    return undefined;
  }, [_values]);

  const _value = useMemo(() => {
    if (isSingle) {
      const _value = (_values as PickerOption)?.value || '';
      if (typeof _value === 'number') {
        return [_value];
      }
      return [_value].filter(Boolean);
    }
    if (Array.isArray(_values)) {
      return _values.map((item) => item?.value);
    }
    return undefined;
  }, [_values]);

  return (
    <View className={`fairys-taro-picker ${className || ''}`} style={style}>
      <FairysTaroTextClearBase
        warpClassName="fairys-taro-picker-text"
        isValue={!!_renderValue}
        onTextClick={() => setVisible(true)}
        onClearClick={() => onChange?.(undefined)}
        disabled={disabled}
      >
        {_renderValue || placeholder}
      </FairysTaroTextClearBase>
      <Picker
        {...rest}
        options={options}
        className={`fairys-taro-picker-body fairystaroform__text-left ${bodyClassName || ''}`}
        style={bodyStyle}
        value={_value}
        visible={visible}
        onClose={() => setVisible(false)}
        onConfirm={(selectedOptions) => {
          setVisible(false);
          if (isSingle) {
            if (labelInValue) {
              onChange?.(selectedOptions?.[0]);
            } else {
              onChange?.(selectedOptions?.[0]?.value);
            }
          } else {
            if (labelInValue) {
              onChange?.(selectedOptions);
            } else {
              onChange?.(selectedOptions.map((item) => item?.value));
            }
          }
        }}
      />
    </View>
  );
};
