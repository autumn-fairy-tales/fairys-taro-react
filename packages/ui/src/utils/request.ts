import Taro from '@tarojs/taro';
import { globalSettingDataInstance } from 'context/global.setting.data.instance';
import { globalDataInstance } from 'context/global.data.instance';

const codeMessage = {
  400: '发出的请求错误',
  401: '用户没有权限',
  403: '用户访问被禁止',
  404: '请求不存在，服务器没有进行操作',
  406: '请求的格式错误',
  410: '资源被永久删除',
  422: '验证错误',
  500: '服务器发生错误，请检查服务器',
  502: 'nginx异常',
  503: '服务不可用，服务器暂时过载或维护',
  504: 'nginx超时',
} as const;

export interface TaroRequestOption {
  /**模块名称*/
  module?: string;
  /**是否忽略token*/
  isIgnoreToken?: boolean;
  /**是否提示错误信息*/
  isShowErrorMessage?: boolean;
}

export interface RequestInstanceOptions extends Taro.request.Option<any, any>, TaroRequestOption {}
export interface DownloadFileOptions extends Taro.downloadFile.Option, TaroRequestOption {
  /**下载进度回调*/
  onProgress?: Taro.DownloadTask.OnProgressUpdateCallback;
}
export interface UploadFileOptions extends Taro.uploadFile.Option, TaroRequestOption {
  /**上传进度回调*/
  onProgress?: Taro.UploadTask.OnProgressUpdateCallback;
}
/**处理提示信息*/
const requestResponseHandle = (
  result:
    | Taro.request.SuccessCallbackResult<any>
    | Taro.downloadFile.FileSuccessCallbackResult
    | Taro.uploadFile.SuccessCallbackResult,
  options?: RequestInstanceOptions,
) => {
  let msg = '';
  try {
    const statusCode = result.statusCode;
    // @ts-ignore
    const code = result?.data?.code;
    if (statusCode === 401 || code === 401 || code === globalSettingDataInstance.store.tokenExpiredCode) {
      // 权限问题 ，重新登录
      msg = '请重新登录';
      /**重新跳转登录页面*/
      globalDataInstance.toLoginPage();
    } else if (![globalSettingDataInstance.store.requestSuccessCode, 200].includes(code)) {
      // 提示内容
      // @ts-ignore
      msg = result?.data?.message || codeMessage[code || result?.statusCode] || '接口异常';
    } else {
      msg = codeMessage[result?.statusCode];
    }
  } catch (error) {
    msg = codeMessage[result?.statusCode];
    console.log(error);
  }
  if (msg && options?.isShowErrorMessage !== false) {
    if (globalSettingDataInstance.store.isUseTaroToast) {
      Taro.showToast({
        title: msg || '请求发生错误',
        duration: 3000,
        icon: 'none',
      });
    } else {
      globalDataInstance.showMessage({
        content: msg || '请求发生错误',
        type: 'error',
      });
    }
  }
};

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
    dev: Record<string, string | { target: string; pathRewrite: Record<string, string> }>;
    pro: Record<string, string | { target: string; pathRewrite: Record<string, string> }>;
  };
}

export class RequestInstance {
  /**请求IP地址*/
  public IP?: string | ((url: string, module?: string, env?: string) => string);
  /**简单的代理配置*/
  public proxy?: RequestInstanceCreateOptions['proxy'];

  /**公共请求配置*/
  public commonOptions: Omit<Taro.request.Option<any, any>, 'url'> = {};

  constructor(options: RequestInstanceCreateOptions = {}) {
    this.extends(options);
  }

  /**创建实例*/
  static create(options: RequestInstanceCreateOptions = {}) {
    const request = new RequestInstance(options);
    return request;
  }

  /**扩展请求配置*/
  extends = (options: RequestInstanceCreateOptions = {}) => {
    this.IP = options.IP || this.IP;
    this.proxy = options.proxy || this.proxy;
    this.commonOptions = { ...this.commonOptions, ...options.commonOptions };
    return this;
  };

  /**获取请求地址*/
  public getHttpPath = (url: string, module?: string) => {
    if (typeof this.IP === 'function') {
      return this.IP(url, module, process.env.NODE_ENV) || '';
    }
    return this.IP || '';
  };

  /**获取转换后地址*/
  public getProxyHost = (url: string, module?: string) => {
    let host = '';
    let _url = url;
    /**h5中不用代理*/
    if (process.env.TARO_ENV === 'h5') {
      return {
        host: '',
        url: _url,
      };
    }
    if (this.proxy) {
      const proxy = this.proxy[process.env.NODE_ENV === 'production' ? 'pro' : 'dev'];
      if (proxy)
        for (const key in proxy) {
          const rgx = new RegExp(key);
          const item = proxy[key];
          if (rgx.test(url) && item) {
            if (typeof item === 'string') {
              host = item;
            } else if (item?.target) {
              host = item.target;
              if (item.pathRewrite) {
                for (const key in item.pathRewrite) {
                  const rgx = new RegExp(key);
                  _url = url.replace(rgx, item.pathRewrite[key]);
                }
              }
            }
            break;
          }
        }
    }
    if (!host) {
      host = this.proxy?.default?.[process.env.NODE_ENV === 'production' ? 'pro' : 'dev'] || '';
    }
    if (!host) {
      host = this.getHttpPath(url, module);
    }
    return {
      host,
      url: _url,
    };
  };

  /**格式化地址*/
  formatUrl = (url: string, module?: string) => {
    if (!url) {
      throw new Error('请求的url必填');
    }
    /**如果是http或者https开头的，直接返回*/
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      return url;
    }

    let { host, url: _url } = this.getProxyHost(url, module);
    if (host) {
      host = host.replace(/\/$/, '');
    }
    const newUrl = `${_url}`.replace(/^\//, '').replace(/\/$/, '');
    if (module && process.env.NODE_ENV === 'production') {
      const m = `${module}`.replace(/^\//, '').replace(/\/$/, '');
      return `${host}/${m}/${newUrl}`;
    }
    return `${host}/${newUrl}`;
  };

  formatRequestOptions = (options: RequestInstanceOptions | DownloadFileOptions | UploadFileOptions) => {
    const { header = {}, module, isIgnoreToken, isShowErrorMessage, ...restOptions } = options;
    const token = Taro.getStorageSync(globalSettingDataInstance.store.tokenFieldName || 'token');
    const newHeader = { ...header };
    if (token) {
      newHeader[globalSettingDataInstance.store.headerTokenName || 'token'] = token;
    } else {
      if (isIgnoreToken !== true) {
        // 跳转登录页
        if (isShowErrorMessage !== false) {
          if (globalSettingDataInstance.store.isUseTaroToast) {
            Taro.showToast({
              title: '未登录',
              duration: 3000,
              icon: 'none',
            });
          } else {
            globalDataInstance.showMessage({
              content: '未登录',
              type: 'error',
            });
          }
        }
        options?.fail?.({ errMsg: '未登录' });
        globalDataInstance.toLoginPage();
        return undefined;
      }
    }

    return {
      header: newHeader,
      ...restOptions,
      url: this.formatUrl(options.url, module),
    };
  };

  /**发送请求，返回 Taro.RequestTask */
  requestBase = (options: RequestInstanceOptions) => {
    const { isShowErrorMessage } = options;
    const formattedOptions = this.formatRequestOptions(options);
    if (!formattedOptions) {
      return undefined;
    }
    const { header: newHeader, ...restOptions } = formattedOptions;
    return Taro.request({
      ...this.commonOptions,
      ...restOptions,
      header: {
        ...newHeader,
        ...(options?.header || {}),
      },
      success: (result) => {
        /**处理提示
         * 使用 global 状态管理
         * */
        requestResponseHandle(result, options);
        options?.success?.(result);
      },
      fail: (result) => {
        if (isShowErrorMessage !== false) {
          if (globalSettingDataInstance.store.isUseTaroToast) {
            Taro.showToast({
              title: result.errMsg || '请求发生错误',
              duration: 3000,
              icon: 'none',
            });
          } else {
            globalDataInstance.showMessage({
              content: result.errMsg || '请求发生错误',
              type: 'error',
            });
          }
        }
        options?.fail?.(result);
      },
    });
  };

  /**发送请求,返回 Promise */
  request = (options: RequestInstanceOptions): Promise<{ code?: number; data?: any; message?: string }> => {
    return new Promise((resolve, reject) => {
      this.requestBase({
        ...options,
        success: (result) => {
          options?.success?.(result);
          resolve(result?.data);
        },
        fail: (result) => {
          options?.fail?.(result);
          reject(result);
        },
      });
    });
  };

  /**GET请求*/
  GET = (options: RequestInstanceOptions) => {
    try {
      return this.request({
        ...options,
        method: 'GET',
      });
    } catch (error) {
      throw error;
    }
  };

  /**POST请求*/
  POST = (options: RequestInstanceOptions) => {
    try {
      return this.request({
        ...options,
        method: 'POST',
      });
    } catch (error) {
      throw error;
    }
  };

  /**发送formData格式数据*/
  formData = (options: RequestInstanceOptions) => {
    try {
      return this.request({
        ...options,
        method: 'POST',
        header: {
          'Content-Type': 'multipart/form-data',
          ...(options.header || {}),
        },
      });
    } catch (error) {
      throw error;
    }
  };

  /**发送x-www-form-urlencoded格式数据*/
  xFormUrlEncoded = (options: RequestInstanceOptions) => {
    try {
      return this.request({
        ...options,
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          ...(options.header || {}),
        },
      });
    } catch (error) {
      throw error;
    }
  };

  /**下载文件(返回 Taro.DownloadTask.DownloadTaskPromise ，可显示下载进度)*/
  downloadFileTask = (options: DownloadFileOptions): Taro.DownloadTask.DownloadTaskPromise | undefined => {
    const { isShowErrorMessage } = options;
    const formattedOptions = this.formatRequestOptions(options);
    if (!formattedOptions) {
      return undefined;
    }
    const { header: newHeader, onProgress, ...restOptions } = formattedOptions as DownloadFileOptions;
    const downloadTask = Taro.downloadFile({
      ...this.commonOptions,
      ...restOptions,
      header: {
        ...newHeader,
        ...(options?.header || {}),
      },
      success: (result) => {
        if (result.statusCode === 200) {
          options?.success?.(result);
        } else {
          requestResponseHandle(result, options as any);
          options?.fail?.(result);
        }
      },
      fail: (result) => {
        if (isShowErrorMessage !== false) {
          if (globalSettingDataInstance.store.isUseTaroToast) {
            Taro.showToast({
              title: result.errMsg || '请求发生错误',
              duration: 3000,
              icon: 'none',
            });
          } else {
            globalDataInstance.showMessage({
              content: result.errMsg || '请求发生错误',
              type: 'error',
            });
          }
        }
        options?.fail?.(result);
      },
    });
    /**监听下载进度*/
    if (typeof onProgress === 'function' && downloadTask) {
      downloadTask.onProgressUpdate(onProgress);
    }
    return downloadTask;
  };

  /**下载文件*/
  downloadFile = (options: DownloadFileOptions): Promise<Taro.downloadFile.FileSuccessCallbackResult> => {
    try {
      return new Promise((resolve, reject) => {
        this.downloadFileTask({
          ...options,
          success: (result) => {
            options?.success?.(result);
            resolve(result);
          },
          fail: (result) => {
            options?.fail?.(result);
            reject(result);
          },
        });
      });
    } catch (error) {
      throw error;
    }
  };

  /**上传文件(返回 Taro.UploadTask.UploadTaskPromise ，可显示上传进度)*/
  uploadFileTask = (options: UploadFileOptions) => {
    const { isShowErrorMessage } = options;
    const formattedOptions = this.formatRequestOptions(options);
    if (!formattedOptions) {
      return undefined;
    }
    const { header: newHeader, onProgress, ...restOptions } = formattedOptions as UploadFileOptions;
    const uploadTask = Taro.uploadFile({
      ...this.commonOptions,
      ...restOptions,
      header: {
        ...newHeader,
        ...(options?.header || {}),
      },
      success: (result) => {
        requestResponseHandle(result, options);
        options?.success?.(result);
      },
      fail: (result) => {
        if (isShowErrorMessage !== false) {
          if (globalSettingDataInstance.store.isUseTaroToast) {
            Taro.showToast({
              title: result.errMsg || '请求发生错误',
              duration: 3000,
              icon: 'none',
            });
          } else {
            globalDataInstance.showMessage({
              content: result.errMsg || '请求发生错误',
              type: 'error',
            });
          }
        }
        options?.fail?.(result);
      },
    });
    /**监听上传进度*/
    if (typeof onProgress === 'function' && uploadTask) {
      uploadTask.onProgressUpdate(onProgress);
    }
    return uploadTask;
  };
  /**上传文件*/
  uploadFile = (options: UploadFileOptions): Promise<Taro.uploadFile.SuccessCallbackResult> => {
    return new Promise((resolve, reject) => {
      this.uploadFileTask({
        ...options,
        success: (result) => {
          options?.success?.(result);
          resolve(result);
        },
        fail: (result) => {
          options?.fail?.(result);
          reject(result);
        },
      });
    });
  };
}

/** 请求*/
export const request = new RequestInstance();
export default request;
