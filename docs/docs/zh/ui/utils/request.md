# 请求工具

**引入**

```ts
import { request } from '@fairys/taro-tools-react';
```

## 参数

```ts
import Taro from '@tarojs/taro';
export interface RequestInstanceOptions extends Taro.request.Option<any, any> {
    /**模块名称*/
    module?: string;
    /**是否忽略token*/
    isIgnoreToken?: boolean;
    /**是否提示错误信息*/
    isShowErrorMessage?: boolean;
}
export interface RequestInstanceCreateOptions {
    /**
     * 公共请求配置
     * @default {}
     */
    commonOptions?: Omit<Taro.request.Option<any, any>, 'url'>;
    /**
     * 请求IP地址
     * @default ''
     */
    IP?: string | ((url: string, module?: string, env?: string) => string);
    /**
     * 简单的代理配置
     * @default {}
     */
    proxy?: {
        default?: {
            dev?: string;
            pro?: string;
        };
        dev: Record<string, string | {
            target: string;
            pathRewrite: Record<string, string>;
        }>;
        pro: Record<string, string | {
            target: string;
            pathRewrite: Record<string, string>;
        }>;
    };
}
export declare class RequestInstance {
    /**请求IP地址*/
    IP?: string | ((url: string, module?: string, env?: string) => string);
    /**简单的代理配置*/
    proxy?: RequestInstanceCreateOptions['proxy'];
    /**公共请求配置*/
    commonOptions: Omit<Taro.request.Option<any, any>, 'url'>;
    constructor(options?: RequestInstanceCreateOptions);
    /**创建实例*/
    static create(options?: RequestInstanceCreateOptions): RequestInstance;
    /**扩展请求配置*/
    extends: (options?: RequestInstanceCreateOptions) => this;
    /**获取请求地址*/
    getHttpPath: (url: string, module?: string) => string;
    /**获取转换后地址*/
    getProxyHost: (url: string, module?: string) => {
        host: string;
        url: string;
    };
    /**格式化地址*/
    formatUrl: (url: string, module?: string) => string;
    /**发送请求，返回 Taro.RequestTask */
    requestBase: (options: RequestInstanceOptions) => Taro.RequestTask<any>;
    /**发送请求,返回 Promise */
    request: (options: RequestInstanceOptions) => Promise<{
        code?: number;
        data?: any;
        message?: string;
    }>;
    /**GET请求*/
    GET: (options: RequestInstanceOptions) => Promise<{
        code?: number;
        data?: any;
        message?: string;
    }>;
    /**POST请求*/
    POST: (options: RequestInstanceOptions) => Promise<{
        code?: number;
        data?: any;
        message?: string;
    }>;
    /**发送formData格式数据*/
    formData: (options: RequestInstanceOptions) => Promise<{
        code?: number;
        data?: any;
        message?: string;
    }>;
    /**发送x-www-form-urlencoded格式数据*/
    xFormUrlEncoded: (options: RequestInstanceOptions) => Promise<{
        code?: number;
        data?: any;
        message?: string;
    }>;
}
/** 请求*/
export declare const request: RequestInstance;

```

## 使用

```tsx

import { request } from '@fairys/taro-tools-react';
import { View, Button } from '@tarojs/components';

const Page = ()=> {

  const handleClick = async ()=>{
    try {
      const res = await request.POST({ url: '/api/page/select', data: { id: 1 } });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View>
      <Button onClick={handleClick}>点击</Button>
    </View>
  )
}
export default Page
```
