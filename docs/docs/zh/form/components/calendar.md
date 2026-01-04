# 年月日选择器

**引入**

```ts
import { FairysTaroCalendarBase } from '@fairys/taro-tools-simple-form';
```

## 组件参数

```ts
import type { CalendarProps } from '@nutui/nutui-react-taro';

export interface FairysTaroCalendarProps extends Partial<CalendarProps> {
  placeholder?: string;
  value?: string;
  className?: string;
  style?: ViewProps['style'];
  onChange?: (value: string, date: string | string[]) => void;
}

```

## 使用

```ts
import { FairysTaroCalendarBase } from '@fairys/taro-tools-simple-form';
import { View, Text , Button } from '@tarojs/components';

const Page = ()=>{
  return <FairysTaroCalendarBase  />
}

export default Page

```
