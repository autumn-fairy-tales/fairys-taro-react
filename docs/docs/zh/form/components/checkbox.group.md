# 复选框组

**引入**

```ts
import { FairysTaroCheckboxGroupBase } from '@fairys/taro-tools-simple-form';
```

## 组件参数

```ts
import type { CheckboxGroupProps, CheckboxProps } from '@nutui/nutui-react-taro';

export interface FairysTaroCheckboxGroupProps extends Partial<CheckboxGroupProps> {
  items?: Partial<CheckboxProps>[];
}
```

## 使用

```ts
import { FairysTaroCheckboxGroupBase } from '@fairys/taro-tools-simple-form';
import { View, Text , Button } from '@tarojs/components';

const Page = ()=>{
  return <FairysTaroCheckboxGroupBase 
     items={[
        { value: 'A0', label: 'A0_1' },
        { value: 'B0', label: 'B0_1' },
        { value: 'C0', label: 'C0_1' },
    ]}
  />
}

export default Page

```
