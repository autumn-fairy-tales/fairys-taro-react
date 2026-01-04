# 日期选择器

**引入**

```ts
import { FairysTaroDatePickerBase } from '@fairys/taro-tools-simple-form';
```

## 组件参数

```ts
import type{ DatePickerProps } from '@nutui/nutui-react-taro';
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

```

## 使用

```ts
import { FairysTaroDatePickerBase } from '@fairys/taro-tools-simple-form';

const Page = ()=>{
  return <FairysTaroDatePickerBase 
      placeholder="请选择日期"
      type="date"
      value="2023-08-01"
      onChange={(value) => console.log(value)}
  />
}

export default Page

```
