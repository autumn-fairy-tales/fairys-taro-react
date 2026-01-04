# 选择器

**引入**

```ts
import { FairysTaroPickerBase } from '@fairys/taro-tools-simple-form';
```


## 组件参数

```ts
import { TaroPickerProps, PickerOptions } from '@nutui/nutui-react-taro';

export interface FairysTaroPickerProps extends Omit<Partial<TaroPickerProps>, 'value' | 'onChange'> {
  placeholder?: string;
  value?: PickerOptions;
  onChange?: (value: PickerOptions) => void;
  bodyClassName?: string;
  bodyStyle?: React.CSSProperties;
}

```

## 使用

```ts
import { FairysTaroPickerBase } from '@fairys/taro-tools-simple-form';

const Page = ()=>{
  return <FairysTaroPickerBase 
      options={[
        // 第一列
        [
          { label: '周一', value: 'Monday' },
          { label: '周二', value: 'Tuesday' },
          { label: '周三', value: 'Wednesday' },
          { label: '周四', value: 'Thursday' },
          { label: '周五', value: 'Friday' },
        ],
        // 第二列
        [
          { label: '上午', value: 'Morning' },
          { label: '下午', value: 'Afternoon' },
          { label: '晚上', value: 'Evening' },
        ],
      ]}
  />
}

export default Page

```
