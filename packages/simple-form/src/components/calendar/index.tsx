import { View, Text, ViewProps } from '@tarojs/components';
import { Calendar, CalendarProps } from '@nutui/nutui-react-taro';
import { useMemo, useState } from 'react';
import clsx from 'clsx';

export interface FairysTaroCalendarProps extends Partial<CalendarProps> {
  placeholder?: string;
  value?: string;
  className?: string;
  style?: ViewProps['style'];
  onChange?: (value: string, date: string | string[]) => void;
}

export const FairysTaroCalendarBase = (props: FairysTaroCalendarProps) => {
  const { placeholder = '请选择', value, className, style, onChange, ...rest } = props;
  const [visible, setVisible] = useState(false);
  const clsx_text = useMemo(() => {
    return clsx('fairys-taro-calendar-text', {
      'fairys-taro-calendar-text-placeholder fairystaroform__text-gray-600 fairystaroform__font-normal': !value,
      'fairys-taro-calendar-text-value fairystaroform__text-black': value,
    });
  }, [value]);

  return (
    <View className={`fairys-taro-calendar ${className || ''}`} style={style}>
      <Text onClick={() => setVisible(true)} className={clsx_text}>
        {value || placeholder}
      </Text>
      <Calendar
        {...rest}
        visible={visible}
        defaultValue={value}
        onClose={() => setVisible(false)}
        onConfirm={(date) => {
          const [year, month, day] = date;
          if (year) {
            onChange?.(`${year}-${month}-${day}`, date);
          } else {
            onChange?.(undefined, date);
          }
          setVisible(false);
        }}
      />
    </View>
  );
};
