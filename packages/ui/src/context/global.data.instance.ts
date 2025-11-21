import { ReactNode } from 'react';
import { proxy, ref, useSnapshot } from 'valtio';
import { ToastOptions } from '@nutui/nutui-react-taro';

interface MessageDataType {
  /**用于唯一标识提示框(默认自动生成)*/
  __id: string | number;
  /**
   * 提示内容
   */
  title?: ReactNode;
  /**
   * 提示内容
   */
  content?: ReactNode;
  /**
   * 提示框是否可见
   * @default false
   */
  visible?: boolean;
}

export interface ToastDataType extends ToastOptions {}

export interface GlobalDataInstanceState {
  /**弹框提示框*/
  messageData?: MessageDataType[];
  /**提示框数据*/
  toastData?: ToastDataType;
  /**数据默认值不使用*/
  __defaultValue?: string;
}

export class GlobalDataInstance {
  state = proxy<GlobalDataInstanceState>({
    messageData: ref([]),
    toastData: undefined,
  });

  /**用于提示信息*/
  showMessage = (options: Omit<MessageDataType, '__id'> & { __id?: string }, timeout: number = 3000) => {
    const _that = this;
    let newItem = { ...options } as MessageDataType;
    if (!_that.state.messageData) {
      _that.state.messageData = ref([]);
    }
    newItem.visible = true;
    if (!newItem.__id) {
      newItem.__id = `${new Date().valueOf()}__${_that.state.messageData.length + 1}`;
    }
    _that.state.messageData = ref([..._that.state.messageData].concat([newItem]));
    if (timeout) {
      const timer = setTimeout(() => {
        newItem.visible = false;
        _that.state.messageData = ref((_that.state.messageData || []).filter((it) => it.__id !== newItem.__id));
        clearTimeout(timer);
      }, timeout);
    }
    return newItem.__id;
  };

  /**隐藏指定id的提示框*/
  hideMessage = (id: string | number) => {
    this.state.messageData = ref((this.state.messageData || []).filter((it) => it.__id !== id));
  };

  /**显示Toast */
  showToast = (config: Partial<ToastDataType> = {}) => {
    this.state.toastData = ref({ ...config });
  };

  /**隐藏Toast */
  hideToast = () => {
    this.state.toastData = undefined;
  };
}

export const globalDataInstance = new GlobalDataInstance();

export const useGlobalData = () => {
  const state = useSnapshot(globalDataInstance.state);
  return [state, globalDataInstance, state.__defaultValue] as const;
};
