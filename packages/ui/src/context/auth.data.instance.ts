import Taro from '@tarojs/taro';
import { proxy, useSnapshot } from 'valtio';
import { globalSettingDataInstance } from 'context/global.setting.data.instance';

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

export class AuthDataInstance<T = any> {
  store = proxy<AuthDataInstanceState<T>>({
    userInfo: undefined,
    token: undefined,
    permissions: undefined,
  });

  /**
   * 设置用户信息
   * @param userInfo 用户信息
   */
  set userInfo(userInfo: T) {
    this.store.userInfo = userInfo;
    if (userInfo) {
      Taro.setStorageSync('userInfo', JSON.stringify(userInfo));
    } else {
      Taro.removeStorageSync('userInfo');
    }
  }

  /**
   * 获取用户信息
   * @returns 用户信息
   */
  get userInfo(): T {
    if (!this.store.userInfo) {
      const userInfo = Taro.getStorageSync('userInfo');
      if (userInfo) {
        try {
          this.store.userInfo = JSON.parse(userInfo);
        } catch (error) {
          console.error('解析用户信息失败', error);
        }
      }
    }
    return (this.store.userInfo || {}) as T;
  }

  /**
   * 设置登录凭证（token）
   * @param token 登录凭证（token）
   */
  set token(token: string) {
    this.store.token = token;
    if (token) {
      Taro.setStorageSync(globalSettingDataInstance.store.tokenFieldName || 'token', token);
    } else {
      Taro.removeStorageSync(globalSettingDataInstance.store.tokenFieldName || 'token');
    }
  }
  /**
   * 获取登录凭证（token）
   * @returns 登录凭证（token）
   */
  get token(): string {
    if (!this.store.token) {
      const token = Taro.getStorageSync(globalSettingDataInstance.store.tokenFieldName || 'token');
      if (token) {
        this.store.token = token;
      }
    }
    return this.store.token || '';
  }

  /**
   * 设置权限列表
   * @param permissions 权限列表
   */
  set permissions(permissions: string[]) {
    this.store.permissions = permissions;
    if (permissions) {
      Taro.setStorageSync('permissions', JSON.stringify(permissions));
    } else {
      Taro.removeStorageSync('permissions');
    }
  }
  /**
   * 获取权限列表
   * @returns 权限列表
   */
  get permissions(): string[] {
    if (!this.store.permissions) {
      const permissions = Taro.getStorageSync('permissions');
      if (permissions) {
        try {
          this.store.permissions = JSON.parse(permissions);
        } catch (error) {
          console.error('解析权限列表失败', error);
        }
      }
    }
    return this.store.permissions || [];
  }

  /**
   * 判断是否有指定权限
   * @param permission 权限
   * @returns 是否有指定权限
   */
  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }
}

export const authDataInstance = new AuthDataInstance();

/**
 * 全局数据状态管理
 */
export function useAuthData<T = any>() {
  const store = useSnapshot(authDataInstance.store);
  return [store, authDataInstance, store.__defaultValue] as [
    AuthDataInstanceState<T>,
    AuthDataInstance<T>,
    string | undefined,
  ];
}
