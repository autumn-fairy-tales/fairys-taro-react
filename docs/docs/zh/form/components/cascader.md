# 级联选择器

**引入**

```ts
import { FairysTaroCascaderBase } from '@fairys/taro-tools-simple-form';
```

## 组件参数

```ts
import type {  CascaderProps, CascaderOption } from '@nutui/nutui-react-taro';

export interface FairysTaroCascaderProps
  extends Omit<Partial<CascaderProps>, 'visible' | 'onClose' | 'onChange' | 'value'> {
  placeholder?: string;
  labelInValue?: boolean;
  value?: (string | number | CascaderOption)[];
  onChange?: (value: (string | number | CascaderOption)[], pathNodes: CascaderOption[]) => void;
  bodyClassName?: string;
  bodyStyle?: React.CSSProperties;
}

```

## 使用

```ts
import { FairysTaroCascaderBase } from '@fairys/taro-tools-simple-form';
import { View, Text , Button } from '@tarojs/components';

const Page = ()=>{
  return <FairysTaroCascaderBase 
     options={[
        { value: 'A0', text: 'A0_1' },
        {
          value: 'B0',
          text: 'B0_1',
          children: [
            { value: 'B11', text: 'B11_1', leaf: true },
            { value: 'B12', text: 'B12_1' },
          ],
        },
        { value: 'C0', text: 'C0_1' },
     ]}
  />
}

export default Page

```
