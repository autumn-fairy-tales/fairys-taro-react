import { View, Text } from '@tarojs/components';
import { Picker, TaroPickerProps, PickerOptions } from '@nutui/nutui-react-taro';
import { useMemo, useState } from 'react';
import { FairysTaroTextClearBase } from 'components/clear';

export interface FairysTaroPickerProps extends Omit<Partial<TaroPickerProps>, 'value' | 'onChange'> {
  placeholder?: string;
  value?: PickerOptions;
  onChange?: (value: PickerOptions) => void;
  bodyClassName?: string;
  bodyStyle?: React.CSSProperties;
}

export const FairysTaroPickerBase = (props: FairysTaroPickerProps) => {
  const { placeholder = '请选择', bodyClassName, bodyStyle, className, style, value, onChange, ...rest } = props;

  const [visible, setVisible] = useState(false);

  const _renderValue = useMemo(() => {
    if (Array.isArray(value)) {
      return value.map((item) => item.label).join(' / ');
    }
    return undefined;
  }, [value]);

  const _value = useMemo(() => {
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
        className={`fairys-taro-picker-body fairystaroform__text-left ${bodyClassName || ''}`}
        style={bodyStyle}
        value={_value}
        visible={visible}
        onClose={() => setVisible(false)}
        onConfirm={(selectedOptions) => {
          setVisible(false);
          onChange?.(selectedOptions);
        }}
      />
    </View>
  );
};
