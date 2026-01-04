# 全局配置参数实例

**引入**

```ts
import { globalSettingDataInstance , useGlobalSettingData } from '@fairys/taro-tools-react';
```

## 参数

```ts
/**用户信息，权限判断等*/
export interface AuthDataInstanceState<T = any> {
    /**用户信息*/
    userInfo?: T;
    /**登录凭证（token）*/
    token?: string;
    /**权限列表*/
    permissions?: string[];
    /**数据默认值不使用*/
    __defaultValue?: string;
}
export declare class AuthDataInstance<T = any> {
    store: AuthDataInstanceState<T>;
    /**
     * 设置用户信息
     * @param userInfo 用户信息
     */
    set userInfo(userInfo: T);
    /**
     * 获取用户信息
     * @returns 用户信息
     */
    get userInfo(): T;
    /**
     * 设置登录凭证（token）
     * @param token 登录凭证（token）
     */
    set token(token: string);
    /**
     * 获取登录凭证（token）
     * @returns 登录凭证（token）
     */
    get token(): string;
    /**
     * 设置权限列表
     * @param permissions 权限列表
     */
    set permissions(permissions: string[]);
    /**
     * 获取权限列表
     * @returns 权限列表
     */
    get permissions(): string[];
    /**
     * 判断是否有指定权限
     * @param permission 权限
     * @returns 是否有指定权限
     */
    hasPermission(permission: string): boolean;
}
export declare const authDataInstance: AuthDataInstance<any>;
/**
 * 全局数据状态管理
 */
export declare function useAuthData<T = any>(): [AuthDataInstanceState<T>, AuthDataInstance<T>, string | undefined];

```
