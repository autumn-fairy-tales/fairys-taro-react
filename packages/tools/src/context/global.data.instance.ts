import { proxy, useSnapshot } from 'valtio';
import navigate from 'utils/navigate';
import { ProxyInstanceObjectBase } from 'utils/valtio/instance';
import { globalSettingDataInstance } from './global.setting.data.instance';
import Taro from '@tarojs/taro';
import { authDataInstance } from './auth.data.instance';

export interface GlobalDataInstanceState {
  /**数据默认值不使用*/
  __defaultValue?: string;
}

/**
 * 全局数据实例
 */
export class GlobalDataInstance extends ProxyInstanceObjectBase<GlobalDataInstanceState> {
  store = proxy<GlobalDataInstanceState>({});
  /**
   * 跳转登录页面前执行
   */
  onBeforetToLoginPage?: () => boolean | void;
  /**跳转 redirect 路由*/
  toRedirect = () => {
    //  获取当前路由参数
    const currentPath = Taro.getCurrentInstance().router?.params?.redirect || '';
    if (currentPath) {
      // 跳转 redirect 路由
      navigate.navigateTo({ url: currentPath });
    }
  };

  /**跳转登录页面*/
  toLoginPage = () => {
    // 清除登录凭证（token）、权限列表、菜单权限列表、用户信息
    authDataInstance.clear();
    if (this.onBeforetToLoginPage) {
      const f = this.onBeforetToLoginPage();
      if (f === false) {
        // 如果返回false则不跳转登录页面
        return;
      }
    }
    const loginPageRoute = globalSettingDataInstance.store.loginPageRoute || '';
    const isLoginPage = navigate.isCurrentPage(loginPageRoute || '');
    const _loginPageRoute = `${loginPageRoute || ''}`.replace(/^\//, '');
    if (isLoginPage) {
      // 如果是登录页面不进行跳转
      return;
    }
    // 跳转登录页面
    Taro.navigateTo({ url: `/${_loginPageRoute}` });
  };
}
/**
 * 全局数据实例
 */
export const globalDataInstance = new GlobalDataInstance();

/**
 * 全局数据状态管理
 */
export const useGlobalData = () => {
  const store = useSnapshot(globalDataInstance.store);
  return [store, globalDataInstance, store.__defaultValue] as [
    GlobalDataInstanceState,
    GlobalDataInstance,
    string | undefined,
  ];
};
