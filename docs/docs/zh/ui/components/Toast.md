# Toast 组件

**引入**

```ts
import { FairysTaroToast } from '@fairys/taro-tools-react';
```

## 使用

:::warning

内置消息数据，使用`globalDataInstance`中的状态存储对象中的`toastData`数据进行渲染，当前组件已封装进`connectToastMessage`中

:::

```tsx
import { FairysTaroToast } from '@fairys/taro-tools-react';

const Page = ()=>{
  return <FairysTaroToast />
}

export default Page
```
