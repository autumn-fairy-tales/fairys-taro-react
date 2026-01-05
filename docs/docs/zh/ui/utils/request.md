# 请求工具

**引入**

```ts
import { request } from '@fairys/taro-tools-react';
```

## 参数

```ts
import Taro from '@tarojs/taro';
export interface TaroRequestOption {
    /**模块名称*/
    module?: string;
    /**是否忽略token*/
    isIgnoreToken?: boolean;
    /**是否提示错误信息*/
    isShowErrorMessage?: boolean;
}
export interface RequestInstanceOptions extends Taro.request.Option<any, any>, TaroRequestOption {
}
export interface DownloadFileOptions extends Taro.downloadFile.Option, TaroRequestOption {
    /**下载进度回调*/
    onProgress?: Taro.DownloadTask.OnProgressUpdateCallback;
}
export interface UploadFileOptions extends Taro.uploadFile.Option, TaroRequestOption {
    /**上传进度回调*/
    onProgress?: Taro.UploadTask.OnProgressUpdateCallback;
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
    formatRequestOptions: (options: RequestInstanceOptions | DownloadFileOptions | UploadFileOptions) => {
        url: string;
        data?: any;
        timeout?: number;
        method?: keyof Taro.request.Method;
        dataType?: keyof Taro.request.DataType | string;
        responseType?: keyof Taro.request.ResponseType;
        enableHttp2?: boolean;
        enableQuic?: boolean;
        enableCache?: boolean;
        enableHttpDNS?: boolean;
        httpDNSServiceId?: string;
        enableChunked?: boolean;
        forceCellularNetwork?: boolean;
        enableCookie?: boolean;
        referrerStrategy?: keyof Taro.request.ReferrerStrategy;
        success?: (result: Taro.request.SuccessCallbackResult<any>) => void;
        fail?: (res: TaroGeneral.CallbackResult) => void;
        complete?: (res: Partial<Taro.request.SuccessCallbackResult> & TaroGeneral.CallbackResult) => void;
        jsonp?: boolean | string;
        jsonpCache?: RequestCache;
        mode?: keyof Taro.request.CorsMode;
        credentials?: keyof Taro.request.Credentials;
        cache?: keyof Taro.request.Cache;
        retryTimes?: number;
        backup?: string | string[];
        signal?: AbortSignal;
        dataCheck?(): boolean;
        useStore?: boolean;
        storeCheckKey?: string;
        storeSign?: string;
        storeCheck?(): boolean;
        header: {
            [x: string]: any;
        };
    } | {
        url: string;
        /**下载进度回调*/
        onProgress?: Taro.DownloadTask.OnProgressUpdateCallback;
        filePath?: string;
        timeout?: number;
        withCredentials?: boolean;
        complete?: (res: TaroGeneral.CallbackResult) => void;
        fail?: (res: TaroGeneral.CallbackResult) => void;
        success?: (result: Taro.downloadFile.FileSuccessCallbackResult) => void;
        header: {
            [x: string]: any;
        };
    } | {
        url: string;
        /**上传进度回调*/
        onProgress?: Taro.UploadTask.OnProgressUpdateCallback;
        filePath: string;
        name: string;
        formData?: TaroGeneral.IAnyObject;
        timeout?: number;
        fileName?: string;
        withCredentials?: boolean;
        complete?: (res: TaroGeneral.CallbackResult) => void;
        fail?: (res: TaroGeneral.CallbackResult) => void;
        success?: (result: Taro.uploadFile.SuccessCallbackResult) => void;
        header: {
            [x: string]: any;
        };
    };
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
    /**下载文件(返回 Taro.DownloadTask.DownloadTaskPromise ，可显示下载进度)*/
    downloadFileTask: (options: DownloadFileOptions) => Taro.DownloadTask.DownloadTaskPromise | undefined;
    /**下载文件*/
    downloadFile: (options: DownloadFileOptions) => Promise<Taro.downloadFile.FileSuccessCallbackResult>;
    /**上传文件(返回 Taro.UploadTask.UploadTaskPromise ，可显示上传进度)*/
    uploadFileTask: (options: UploadFileOptions) => Taro.UploadTask.UploadTaskPromise;
    /**上传文件*/
    uploadFile: (options: UploadFileOptions) => Promise<Taro.uploadFile.SuccessCallbackResult>;
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
