import { View } from '@tarojs/components';
import { Picker, TaroPickerProps, PickerOptions, PickerOption } from '@nutui/nutui-react-taro';
import { useMemo, useState } from 'react';
import { FairysTaroTextClearBase } from 'components/clear';

export interface FairysTaroPickerProps extends Omit<Partial<TaroPickerProps>, 'value' | 'onChange'> {
  placeholder?: string;
  value?: PickerOptions | PickerOption;
  onChange?: (value: PickerOptions | PickerOption) => void;
  bodyClassName?: string;
  bodyStyle?: React.CSSProperties;
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
    ...rest
  } = props;
  const [visible, setVisible] = useState(false);

  // 根据 options 长度进行判断是否为单层级, 单层的value存储对象，多层的存储数组
  const isSingle = (options || []).length <= 1;

  const _renderValue = useMemo(() => {
    if (isSingle) {
      return (value as PickerOption)?.label || '';
    }
    if (Array.isArray(value)) {
      return value.map((item) => item.label).join(' / ');
    }
    return undefined;
  }, [value]);

  const _value = useMemo(() => {
    if (isSingle) {
      const _value = (value as PickerOption)?.value || '';
      if (typeof _value === 'number') {
        return [_value];
      }
      return [_value].filter(Boolean);
    }
    if (Array.isArray(value)) {
      return value.map((item) => item.value);
    }
    return undefined;
  }, [value]);

  return (
    <View className={`fairys-taro-picker ${className || ''}`} style={style}>
      <FairysTaroTextClearBase
        warpClassName="fairys-taro-picker-text"
        isValue={!!_renderValue}
        onTextClick={() => setVisible(true)}
        onClearClick={() => onChange?.(undefined)}
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
            onChange?.(selectedOptions?.[0]);
          } else {
            onChange?.(selectedOptions);
          }
        }}
      />
    </View>
  );
};
