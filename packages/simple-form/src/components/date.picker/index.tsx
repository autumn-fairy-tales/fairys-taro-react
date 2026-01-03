import { View } from '@tarojs/components';
import { DatePicker, DatePickerProps } from '@nutui/nutui-react-taro';
import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { FairysTaroTextClearBase } from 'components/clear';

export interface FairysTaroDatePickerProps extends Omit<Partial<DatePickerProps>, 'value' | 'onChange'> {
  placeholder?: string;
  /**
   * 日期格式
   * @description
   * 当 type 为 date 时，格式为 YYYY-MM-DD
   * 当 type 为 time 时，格式为 HH:mm:ss
   * 当 type 为 year-month 时，格式为 YYYY-MM
   * 当 type 为 month-day 时，格式为 MM-DD
   * 当 type 为 datehour 时，格式为 YYYY-MM-DD HH
   * 当 type 为 datetime 时，格式为 YYYY-MM-DD HH:mm
   * 当 type 为 hour-minutes 时，格式为 HH:mm
   */
  value?: string | Date;
  onChange?: (value?: string) => void;
}

const getDate = (selectedValue: (string | number)[], type: DatePickerProps['type']) => {
  if (Array.isArray(selectedValue) && selectedValue.length) {
    const [year, month, day, hour, minute, second] = selectedValue;
    //  "date" | "time" | "year-month" | "month-day" | "datehour" | "datetime" | "hour-minutes"
    let date = `${year}-${month}-${day} ${hour}:${minute}`;
    if (type === 'date') {
      date = `${year}-${month}-${day}`;
    } else if (type === 'time') {
      date = `${hour}:${minute}:${second}`;
    } else if (type === 'year-month') {
      date = `${year}-${month}`;
    } else if (type === 'month-day') {
      date = `${month}-${day}`;
    } else if (type === 'datehour') {
      date = `${year}-${month}-${day} ${hour}`;
    } else if (type === 'datetime') {
      date = `${year}-${month}-${day} ${hour}:${minute}`;
    } else if (type === 'hour-minutes') {
      date = `${hour}:${minute}`;
    }
    return date;
  }
  return undefined;
};

const renderDate = (date: string | undefined | Date, type: DatePickerProps['type']) => {
  let renderStr = undefined;
  let _value = undefined;
  const defaultValue = new Date();
  if (date) {
    const isDate = date instanceof Date;
    if (type === 'date') {
      if (isDate) {
        renderStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        _value = date;
      } else {
        const [year, month, day] = date.split(/[-|\s]/);
        renderStr = `${year}-${month}-${day}`;
        _value = new Date(`${year}-${month}-${day}`);
      }
    } else if (type === 'time') {
      if (isDate) {
        renderStr = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        _value = date;
      } else {
        const [hour, minute, second] = date.split(/[:|]/);
        renderStr = `${hour}:${minute}:${second}`;
        _value = new Date(
          `${defaultValue.getFullYear()}-${
            defaultValue.getMonth() + 1
          }-${defaultValue.getDate()} ${hour}:${minute}:${second}`,
        );
      }
    } else if (type === 'year-month') {
      if (isDate) {
        renderStr = `${date.getFullYear()}-${date.getMonth() + 1}`;
        _value = date;
      } else {
        const [year, month] = date.split(/[-|\s]/);
        renderStr = `${year}-${month}`;
        _value = new Date(`${year}-${month}-01`);
      }
    } else if (type === 'month-day') {
      if (isDate) {
        renderStr = `${date.getMonth() + 1}-${date.getDate()}`;
        _value = date;
      } else {
        const [month, day] = date.split(/[-|\s]/);
        renderStr = `${month}-${day}`;
        _value = new Date(`${defaultValue.getFullYear()}-${month}-${day}`);
      }
    } else if (type === 'datehour') {
      if (isDate) {
        renderStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}`;
        _value = date;
      } else {
        const [year, month, day, hour] = date.split(/[-|\s|:]/);
        renderStr = `${year}-${month}-${day} ${hour}`;
        _value = new Date(`${year}-${month}-${day} ${hour}:00:00`);
      }
    } else if (type === 'datetime') {
      if (isDate) {
        renderStr = `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
        _value = date;
      } else {
        const [year, month, day, hour, minute] = date.split(/[-|\s|:]/);
        renderStr = `${year}-${month}-${day} ${hour}:${minute}`;
        _value = new Date(`${year}-${month}-${day} ${hour}:${minute}:00`);
      }
    } else if (type === 'hour-minutes') {
      if (isDate) {
        renderStr = `${date.getHours()}:${date.getMinutes()}`;
        _value = date;
      } else {
        const [hour, minute] = date.split(/[:|]/);
        renderStr = `${hour}:${minute}`;
        _value = new Date(
          `${defaultValue.getFullYear()}-${defaultValue.getMonth() + 1}-${defaultValue.getDate()} ${hour}:${minute}:00`,
        );
      }
    }
  }
  return { renderStr, _value };
};

export const FairysTaroDatePickerBase = (props: FairysTaroDatePickerProps) => {
  const { placeholder = '请选择', value, className, style, onChange, type = 'date', ...rest } = props;
  const [visible, setVisible] = useState(false);

  const render = useMemo(() => {
    return renderDate(value, type);
  }, [value, type]);

  return (
    <View className={`fairys-taro-date-picker ${className || ''}`} style={style}>
      <FairysTaroTextClearBase
        warpClassName="fairys-taro-date-picker-text"
        isValue={!!render.renderStr}
        onTextClick={() => setVisible(true)}
        onClearClick={() => onChange?.(undefined)}
      >
        {render.renderStr || placeholder}
      </FairysTaroTextClearBase>

      <DatePicker
        type={type}
        showChinese
        {...rest}
        value={render._value}
        visible={visible}
        onClose={() => setVisible(false)}
        onConfirm={(_, selectedValue) => {
          if (Array.isArray(selectedValue) && selectedValue.length) {
            onChange?.(getDate(selectedValue, type));
          } else {
            onChange?.(undefined);
          }
          setVisible(false);
        }}
      />
    </View>
  );
};
