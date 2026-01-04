# 全局数据状态实例

**引入**

```ts
import { globalDataInstance , useGlobalData } from '@fairys/taro-tools-react';
```

## 参数

```ts
import type { TaroToastProps } from '@nutui/nutui-react-taro';
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
export interface GlobalDataInstanceState {
    /**弹框提示框*/
    messageData?: MessageDataType[];
    /**提示框数据*/
    toastData?: ToastDataType;
    /**数据默认值不使用*/
    __defaultValue?: string;
}
export declare class GlobalDataInstance extends ProxyInstanceObjectBase<GlobalDataInstanceState> {
    /**
     * 设置登录页面路由(需要在入口文件中进行设置)
     * @param loginPageRoute 登录页面路由(默认pages/login/index)
     */
    loginPageRoute: string;
    store: GlobalDataInstanceState;
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
export declare const globalDataInstance: GlobalDataInstance;
/**
 * 全局数据状态管理
 */
export declare const useGlobalData: () => [GlobalDataInstanceState, GlobalDataInstance, string | undefined];
```

## 使用

```ts
import { globalDataInstance , useGlobalData ，connectToastMessage} from '@fairys/taro-tools-react';
import { View, Text , Button } from '@tarojs/components';

const Page = ()=> {
    const [state, instance] = useGlobalData()
  return (
    <View>
      <Button onClick={()=>globalDataInstance.showToast({ content:'Hello World' })}>World</Button>
      <Button onClick={()=>instance.showToast({ content:'Hello World' })}>Hello</Button>
    </View>
  )
}
export default connectToastMessage(Page)

```
