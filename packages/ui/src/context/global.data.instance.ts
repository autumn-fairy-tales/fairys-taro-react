import { proxy, ref, useSnapshot } from 'valtio';
import type { TaroToastProps } from '@nutui/nutui-react-taro';
import navigate from 'utils/navigate';
import { createUseId } from 'utils/useId';
import React from 'react';
import type { FairysTaroMessageItemProps } from 'components/Mesage';
import { ProxyInstanceObjectBase } from 'utils/valtio/instance';
import { globalSettingDataInstance } from './global.setting.data.instance';
import Taro from '@tarojs/taro';

export interface MessageDataType extends FairysTaroMessageItemProps {
  /**用于唯一标识提示框(默认自动生成)*/
  __id: string | number;
  /**
   * 提示内容
   */
  content?: React.ReactNode;
  /**
   * 提示框是否可见
   * @default false
   */
  visible?: boolean;
}

export interface ToastDataType extends Partial<TaroToastProps> {}

export interface GlobalDataInstanceState {
  /**弹框提示框*/
  messageData?: MessageDataType[];
  /**提示框数据*/
  toastData?: ToastDataType;
  /**数据默认值不使用*/
  __defaultValue?: string;
}

export class GlobalDataInstance extends ProxyInstanceObjectBase<GlobalDataInstanceState> {
  store = proxy<GlobalDataInstanceState>({
    messageData: ref([]),
    toastData: undefined,
  });

  /**用于提示信息*/
  showMessage = (options: Omit<MessageDataType, '__id'> & { __id?: string }, timeout: number = 3000) => {
    const _that = this;
    let newItem = { ...options } as MessageDataType;
    if (!_that.store.messageData) {
      _that.store.messageData = ref([]);
    }
    newItem.visible = true;
    if (!newItem.__id) {
      newItem.__id = `${new Date().valueOf()}__${_that.store.messageData.length + 1}` + '__' + createUseId('message');
    }
    _that.store.messageData = ref([..._that.store.messageData].concat([newItem]));
    if (timeout) {
      const timer = setTimeout(() => {
        newItem.visible = false;
        _that.store.messageData = ref((_that.store.messageData || []).filter((it) => it.__id !== newItem.__id));
        clearTimeout(timer);
      }, timeout);
    }
    return newItem.__id;
  };

  /**隐藏指定id的提示框*/
  hideMessage = (id: string | number) => {
    this.store.messageData = ref((this.store.messageData || []).filter((it) => it.__id !== id));
  };

  /**显示Toast */
  showToast = (config: Partial<ToastDataType> = {}) => {
    this.store.toastData = ref({ visible: true, ...config });
  };

  /**隐藏Toast */
  hideToast = () => {
    this.store.toastData = ref({ ...this.store.toastData, visible: false });
  };

  /**
   * 跳转登录页面前执行
   */
  onBeforetToLoginPage?: () => boolean | void;
  /**跳转登录页面*/
  toLoginPage = () => {
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
    navigate.navigateTo({ url: `/${_loginPageRoute}` });
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
