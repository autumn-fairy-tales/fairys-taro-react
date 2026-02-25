# 组装 Toast/Message  消息

**引入**

```ts
import { connectToastMessage } from '@fairys/taro-tools-react';
```

## 组件参数

```ts
export interface ConnectToastMessageOptions {
  /**
   * 是否是根页面,
   * 在 h5 中，只有入口文件才需要展示 message 组件 和 toast 组件
   * 在微信中，所有页面都需要展示 message 组件 和 toast 组件, 入口文件不展示
   */
  isRoot?: boolean;
}
```

## 使用

```tsx
import { connectToastMessage , globalMessageDataInstance } from '@fairys/taro-tools-react';
import { View, Text , Button } from '@tarojs/components';

const Page = ()=>{

  return (
    <View>
      <Text>Hello World</Text>
      <Button onClick={()=> globalMessageDataInstance.showMessage({ content: '这是一条提示信息', }) }>show Message</Button>
      <Button onClick={()=> globalMessageDataInstance.showToast({ content: '这是一条提示信息', }) }>show Toast</Button>
    </View>
  )

}

export default connectToastMessage(Page);

```