import { View, ViewProps } from '@tarojs/components';
import { Calendar, CalendarProps } from '@nutui/nutui-react-taro';
import { useState } from 'react';
import { FairysTaroTextClearBase } from 'components/clear';

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

  return (
    <View className={`fairys-taro-calendar ${className || ''}`} style={style}>
      <FairysTaroTextClearBase
        warpClassName="fairys-taro-calendar-text"
        isValue={!!value}
        onTextClick={() => setVisible(true)}
        onClearClick={() => onChange?.(undefined, undefined)}
      >
        {value || placeholder}
      </FairysTaroTextClearBase>
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
