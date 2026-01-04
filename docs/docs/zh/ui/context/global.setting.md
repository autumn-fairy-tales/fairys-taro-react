# 全局配置参数实例

**引入**

```ts
import { globalSettingDataInstance , useGlobalSettingData } from '@fairys/taro-tools-react';
```

## 参数

```ts
import { ProxyInstanceObjectBase } from '@fairys/taro-tools-react';
export interface GlobalSettingDataInstanceState {
    /**
     * 请求成功返回code
     * @default 200
     */
    requestSuccessCode?: number;
    /**
     * token过期返回code，跳转登录页面
     * @default 401
     */
    tokenExpiredCode?: number;
    /**
     * 本地存储token字段名
     * @default token
     */
    tokenFieldName?: string;
    /**
     * 请求头token字段名
     * @default token
     */
    headerTokenName?: string;
    /**
     * 设置登录页面路由(需要在入口文件中进行设置)
     * @default pages/login/index
     */
    loginPageRoute?: string;
    /**跳转忽略权限校验的路由*/
    ignoreAuthRoutes?: string[];
    /**路由跳转默认使用authDataInstance中的hasMenuPermission 判断是否有菜单权限*/
    useAuthHasMenuPermission?: boolean;
    /**是否开启权限校验*/
    isEnableAuth?: boolean;
    /**数据默认值不使用*/
    __defaultValue?: string;
}
export declare class GlobalSettingDataInstance extends ProxyInstanceObjectBase<GlobalSettingDataInstanceState> {
    defaultStore: GlobalSettingDataInstanceState;
    store: GlobalSettingDataInstanceState;
    /**
     * 扩展全局设置数据状态
     */
    extendStore: (state: Partial<GlobalSettingDataInstanceState>) => void;
    /**
     * 判断是否跳转忽略权限校验的路由
     */
    isIgnoreAuthRoutes: (route: string) => boolean;
}
/**
 * 全局设置数据实例
 */
export declare const globalSettingDataInstance: GlobalSettingDataInstance;
/**
 * 全局设置数据状态管理
 */
export declare const useGlobalSettingData: () => [GlobalSettingDataInstanceState, GlobalSettingDataInstance, string | undefined];

```
