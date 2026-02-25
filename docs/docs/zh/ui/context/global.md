# 全局消息数据状态实例

**引入**

```ts
import { globalMessageDataInstance , useGlobalMessageData } from '@fairys/taro-tools-react';
```

## 参数

```ts
import type { TaroToastProps } from '@nutui/nutui-react-taro';
import React from 'react';
import type { FairysTaroMessageItemProps } from '@fairys/taro-tools-react';
import { ProxyInstanceObjectBase } from '@fairys/taro-tools-react';
export interface MessageDataType extends FairysTaroMessageItemProps {
    /**用于唯一标识提示框(默认自动生成)*/
    __id: string | number;
    /**
     * 提示内容
     */
    content?: React.ReactNode;
    /**
     * 提示框是否可见
     * @default false
     */
    visible?: boolean;
}
export interface ToastDataType extends Partial<TaroToastProps> {
}
export interface GlobalMessageDataInstanceState {
    /**弹框提示框*/
    messageData?: MessageDataType[];
    /**提示框数据*/
    toastData?: ToastDataType;
    /**数据默认值不使用*/
    __defaultValue?: string;
}
export declare class GlobalMessageDataInstance extends ProxyInstanceObjectBase<GlobalMessageDataInstanceState> {
    store: GlobalMessageDataInstanceState;
    /**用于提示信息*/
    showMessage: (options: Omit<MessageDataType, "__id"> & {
        __id?: string;
    }, timeout?: number) => string | number;
    /**隐藏指定id的提示框*/
    hideMessage: (id: string | number) => void;
    /**显示Toast */
    showToast: (config?: Partial<ToastDataType>) => void;
    /**隐藏Toast */
    hideToast: () => void;
    /**跳转登录页面*/
    toLoginPage: () => void;
}
/**
 * 全局数据实例
 */
export declare const globalMessageDataInstance: GlobalMessageDataInstance;
/**
 * 全局数据状态管理
 */
export declare const useGlobalMessageData: () => [GlobalMessageDataInstanceState, GlobalMessageDataInstance, string | undefined];

```

## 使用

```ts
import { globalMessageDataInstance , useGlobalMessageData ，connectToastMessage} from '@fairys/taro-tools-react';
import { View, Text , Button } from '@tarojs/components';

const Page = ()=> {
    const [state, instance] = useGlobalMessageData()
  return (
    <View>
      <Button onClick={()=>globalMessageDataInstance.showToast({ content:'Hello World' })}>World</Button>
      <Button onClick={()=>instance.showToast({ content:'Hello World' })}>Hello</Button>
    </View>
  )
}
export default connectToastMessage(Page)

```
