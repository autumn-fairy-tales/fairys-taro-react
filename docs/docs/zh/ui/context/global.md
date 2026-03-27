# 全局实例

**引入**

```ts
import { globalDataInstance , useGlobalData } from '@fairys/taro-tools-react';
```

## 参数

```ts
import { ProxyInstanceObjectBase } from '../utils/valtio/instance';
export interface GlobalDataInstanceState {
    /**数据默认值不使用*/
    __defaultValue?: string;
}
/**
 * 全局数据实例
 */
export declare class GlobalDataInstance extends ProxyInstanceObjectBase<GlobalDataInstanceState> {
    store: GlobalDataInstanceState;
    /**
     * 跳转登录页面前执行(这个函数为前端页面挂载)
     */
    onBeforetToLoginPage?: () => boolean | void;
    /**跳转 redirect 路由*/
    toRedirect: () => void;
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
