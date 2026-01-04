import { proxy, useSnapshot } from 'valtio';
import { ProxyInstanceObjectBase } from 'utils/valtio/instance';

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
  /**数据默认值不使用*/
  __defaultValue?: string;
}

export class GlobalSettingDataInstance extends ProxyInstanceObjectBase<GlobalSettingDataInstanceState> {
  store = proxy<GlobalSettingDataInstanceState>({
    requestSuccessCode: 200,
    tokenFieldName: 'token',
    headerTokenName: 'token',
    tokenExpiredCode: 401,
    loginPageRoute: 'pages/login/index',
  });
  /**
   * 扩展全局设置数据状态
   */
  extendStore = (state: Partial<GlobalSettingDataInstanceState>) => {
    this._setValues(state);
  };
}
/**
 * 全局设置数据实例
 */
export const globalSettingDataInstance = new GlobalSettingDataInstance();

/**
 * 全局设置数据状态管理
 */
export const useGlobalSettingData = () => {
  const store = useSnapshot(globalSettingDataInstance.store);
  return [store, globalSettingDataInstance, store.__defaultValue] as [
    GlobalSettingDataInstanceState,
    GlobalSettingDataInstance,
    string | undefined,
  ];
};
