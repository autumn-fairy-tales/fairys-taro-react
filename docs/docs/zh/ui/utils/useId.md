# useId 工具

**引入**

```ts
import { useId } from '@fairys/taro-tools-react';
```

## 参数

```ts
export declare const createUseId: (suffix?: string) => string;
export declare const useId: (suffix?: string) => string;

```

## 使用

```tsx

import { useId } from '@fairys/taro-tools-react';
import { View, Button } from '@tarojs/components';

const Page = ()=> {
  const id = useId('btn');
  const id2 = useId();
  return (
    <View>
      <Button>点击「{id}」「{id2}」</Button>
    </View>
  )
}
export default Page
```
