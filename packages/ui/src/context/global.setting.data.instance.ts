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
  /**跳转忽略权限校验的路由*/
  ignoreAuthRoutes?: string[];
  /**路由跳转默认使用authDataInstance中的hasMenuPermission 判断是否有菜单权限*/
  useAuthHasMenuPermission?: boolean;
  /**是否开启权限校验*/
  isAuth?: boolean;
  /**数据默认值不使用*/
  __defaultValue?: string;
}

export class GlobalSettingDataInstance extends ProxyInstanceObjectBase<GlobalSettingDataInstanceState> {
  defaultStore: GlobalSettingDataInstanceState = {
    requestSuccessCode: 200,
    tokenFieldName: 'token',
    headerTokenName: 'token',
    tokenExpiredCode: 401,
    loginPageRoute: 'pages/login/index',
    ignoreAuthRoutes: [],
    useAuthHasMenuPermission: true,
    isAuth: true,
  };
  store = proxy<GlobalSettingDataInstanceState>({ ...this.defaultStore });
  /**
   * 扩展全局设置数据状态
   */
  extendStore = (state: Partial<GlobalSettingDataInstanceState>) => {
    this._setValues({
      ...this.defaultStore,
      ...state,
    });
  };
  /**
   * 判断是否跳转忽略权限校验的路由
   */
  isIgnoreAuthRoutes = (route: string): boolean => {
    /**处理路由前缀*/
    const _route = route.replace(/^\//, '');
    /**处理登录页面路由前缀*/
    const _loginPageRoute = this.store.loginPageRoute.replace(/^\//, '');
    if (_route === _loginPageRoute) {
      return true;
    }
    return (this.store.ignoreAuthRoutes || []).includes(_route) || (this.store.ignoreAuthRoutes || []).includes(route);
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
