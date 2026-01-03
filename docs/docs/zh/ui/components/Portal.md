# Portal 组件

**引入**

```ts
import { FairysTaroPortal } from '@fairys/taro-tools-react';
```

## 组件参数

```ts

export interface FairysTaroPortalProps {
  children: React.ReactNode;
  /**
   * 自定义容器(h5环境)
   */
  domContainer?: HTMLElement;
}

```
## 使用

:::tip

用于创建`Portal`容器，用于在页面上展示弹窗等组件

:::


```tsx
import { FairysTaroPortal } from '@fairys/taro-tools-react';
import { Text  } from '@tarojs/components';

const Page = ()=>{
  return (
   <FairysTaroPortal>
      <Text>这是一条内容</Text>
    </FairysTaroPortal>
  )
}

export default Page
```
