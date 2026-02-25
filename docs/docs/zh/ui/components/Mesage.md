# 消息组件

**引入**

```ts
import { FairysTaroPortalMessage, FairysTaroMessage, FairysTaroMessageItem } from '@fairys/taro-tools-react';
```

## 组件参数

```ts
import type { ViewProps } from '@tarojs/components';
import type { MessageDataType } from 'context/global.data.instance';

export interface FairysTaroMessageItemProps extends Omit<ViewProps, 'style'> {
  /**
   * 提示内容
   */
  title?: React.ReactNode;
  /**
   * 提示框类型
   * @default none
   */
  type?: 'none' | 'success' | 'error' | 'warning' | 'info';
  /**
   * 自定义图标
   */
  icon?: React.ReactNode;
  /**消息项是否显示边框*/
  bordered?: boolean;
  /**图标 className*/
  iconClassName?: string;
  /**图标 style*/
  iconStyle?: React.CSSProperties;
  /**标题 className*/
  titleClassName?: string;
  /**标题 style*/
  titleStyle?: React.CSSProperties;
  /**内容 className*/
  bodyClassName?: string;
  /**内容 style*/
  bodyStyle?: React.CSSProperties;
  /**样式*/
  style?: React.CSSProperties;
  /**图标颜色*/
  iconColor?: string;
  /**边框颜色*/
  borderColor?: string;
  /**背景颜色*/
  backgroundColor?: string;
  /**文本颜色*/
  color?: string;
  /**是否显示图标*/
  showIcon?: boolean;
}

export interface FairysTaroMessageProps extends ViewProps {}

```

## 使用

```tsx
import { FairysTaroMessage, FairysTaroMessageItem } from '@fairys/taro-tools-react';
import { Text  } from '@tarojs/components';

const Page = ()=>{
  return (
   <FairysTaroMessage>
      <FairysTaroMessageItem icon="ant-design--account-book-filled" type="success">
        这是一条提示信息这
      </FairysTaroMessageItem>
      <FairysTaroMessageItem iconColor="red" icon="ant-design--account-book-filled" type="success">
        这是一条提示信息这
      </FairysTaroMessageItem>
      <FairysTaroMessageItem
        iconColor="red"
        borderColor="red"
        icon="ant-design--account-book-filled"
        type="success"
      >
        这是一条提示信息这
      </FairysTaroMessageItem>
      <FairysTaroMessageItem
        iconColor="red"
        borderColor="red"
        backgroundColor="gray"
        icon="ant-design--account-book-filled"
        type="success"
      >
        这是一条提示信息这
      </FairysTaroMessageItem>
      <FairysTaroMessageItem
        iconColor="red"
        borderColor="red"
        backgroundColor="gray"
        color="white"
        icon="ant-design--account-book-filled"
        type="success"
      >
        这是一条提示信息这
      </FairysTaroMessageItem>
      <FairysTaroMessageItem showIcon={false}>这是一条提示信息这</FairysTaroMessageItem>
      <FairysTaroMessageItem title="提示信息">这是一条提示信息这</FairysTaroMessageItem>
      <FairysTaroMessageItem type="success" title="成功信息">
        这是一条成功信息这是一条成功信息这是一条成功信息这是一条成功信息这是一条成功信息
      </FairysTaroMessageItem>
      <FairysTaroMessageItem type="error">
        这是一条错误信息这是一条错误信息这是一条错误信息这是一条错误信息这是一条错误信息
      </FairysTaroMessageItem>
      <FairysTaroMessageItem type="warning">
        这是一条警告信息这是一条警告信息这是一条警告信息这是一条警告信息这是一条警告信息
      </FairysTaroMessageItem>
      <FairysTaroMessageItem>
        这是一条提示信息这是一条提示信息这是一条提示信息这是一条提示信息这是一条提示信息
      </FairysTaroMessageItem>
      <FairysTaroMessageItem type="success">
        这是一条成功信息这是一条成功信息这是一条成功信息这是一条成功信息这是一条成功信息
      </FairysTaroMessageItem>
    </FairysTaroMessage>
  )
}

export default Page
```

## 使用2

:::warning

内置消息数据，使用`globalMessageDataInstance`中的状态存储对象中的`messageData`数据进行渲染，当前组件已封装进`connectToastMessage`中

:::

```tsx
import { FairysTaroPortalMessage } from '@fairys/taro-tools-react';
import { Text  } from '@tarojs/components';

const Page = ()=>{
  return <FairysTaroPortalMessage />
}

export default Page
```
