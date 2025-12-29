import Taro from '@tarojs/taro';
import { globalSettingDataInstance } from 'context/global.setting.data.instance';
import { globalDataInstance } from 'context/global.data.instance';

const codeMessage = {
  // 200: '服务器成功返回请求的数据',
  // 201: '新建或修改数据成功',
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

export interface RequestInstanceOptions extends Taro.request.Option<any, any> {
  /**模块名称*/
  module?: string;
  /**是否忽略token*/
  isIgnoreToken?: boolean;
  /**是否提示错误信息*/
  isShowErrorMessage?: boolean;
}

/**处理提示信息*/
const requestResponseHandle = (result: Taro.request.SuccessCallbackResult<any>, options?: RequestInstanceOptions) => {
  let msg = '';
  try {
    const statusCode = result.statusCode;
    const code = result?.data?.code;
    if (result?.data) {
      if (statusCode === 401 || code === 401) {
        // 权限问题 ，重新登录
        msg = '请重新登录';
        /**重新跳转登录页面*/
        globalDataInstance.toLoginPage();
      } else if (![globalSettingDataInstance.store.requestSuccessCode, 200].includes(code)) {
        // 提示内容
        msg = result?.data?.message || '接口异常';
      }
    } else {
      msg = codeMessage[result?.statusCode];
    }
  } catch (error) {
    msg = codeMessage[result?.statusCode];
    console.log(error);
  }
  if (msg && options?.isShowErrorMessage !== false) {
    globalDataInstance.showMessage({
      content: msg || '请求发生错误',
      type: 'error',
    });
  }
};

export interface RequestInstanceCreateOptions {
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
    dev: Record<string, string | { target: string; pathRewrite: Record<string, string> }>;
    pro: Record<string, string | { target: string; pathRewrite: Record<string, string> }>;
  };
}

export class RequestInstance {
  /**请求IP地址*/
  public IP?: string | ((url: string, module?: string, env?: string) => string);
  /**简单的代理配置*/
  public proxy?: RequestInstanceCreateOptions['proxy'];
  /**
   * 本地存储token字段名
   * @default token
   */
  public tokenFieldName = 'token';
  /**
   * 请求头token字段名
   * @default token
   */
  public headerTokenName = 'token';
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
    this.tokenFieldName = options.tokenFieldName || this.tokenFieldName;
    this.headerTokenName = options.headerTokenName || this.headerTokenName;
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
      host = this.getHttpPath(url, module);
    }
    return {
      host,
      url: _url,
    };
  };

  /**格式化地址*/
  formatUrl = (url: string, module?: string) => {
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

  /**发送请求，返回 Taro.RequestTask */
  requestBase = (options: RequestInstanceOptions) => {
    const { data, header = {}, module, isIgnoreToken, isShowErrorMessage, ...restOptions } = options;
    const token = Taro.getStorageSync(this.tokenFieldName || 'token');
    const newHeader = { ...header };
    if (token) {
      newHeader[this.headerTokenName || 'token'] = token;
    } else {
      if (isIgnoreToken !== true) {
        // 跳转登录页
        if (isShowErrorMessage !== false) {
          globalDataInstance.showMessage({
            content: '未登录',
            type: 'error',
          });
        }
        options?.fail?.({ errMsg: '未登录' });
        globalDataInstance.toLoginPage();
        return undefined;
      }
    }
    return Taro.request({
      ...this.commonOptions,
      ...restOptions,
      header: {
        ...newHeader,
        ...(options?.header || {}),
      },
      url: this.formatUrl(options.url, module),
      success: (result) => {
        /**处理提示
         * 使用 global 状态管理
         * */
        requestResponseHandle(result, options);
        options?.success?.(result);
      },
      fail: (result) => {
        if (isShowErrorMessage !== false) {
          globalDataInstance.showMessage({
            content: result.errMsg || '请求发生错误',
            type: 'error',
          });
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
}

/** 请求*/
export const request = new RequestInstance();
export default request;
