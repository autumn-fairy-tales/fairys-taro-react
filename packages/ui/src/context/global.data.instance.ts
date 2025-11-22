import { proxy, ref, useSnapshot } from 'valtio';
import { TaroToastProps } from '@nutui/nutui-react-taro';
import Taro from '@tarojs/taro';

export interface MessageDataType {
  /**用于唯一标识提示框(默认自动生成)*/
  __id: string | number;
  /**
   * 提示内容
   */
  title?: React.ReactNode;
  /**
   * 提示内容
   */
  content?: React.ReactNode;
  /**
   * 提示框是否可见
   * @default false
   */
  visible?: boolean;
  /**
   * 提示框类型
   * @default none
   */
  type?: 'none' | 'success' | 'error' | 'warning' | 'info';
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

export class GlobalDataInstance {
  /**
   * 设置登录页面路由(需要在入口文件中进行设置)
   * @param loginPageRoute 登录页面路由
   */
  public loginPageRoute = 'pages/login/index';

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
    this.state.toastData = ref({ visible: true, ...config });
  };

  /**隐藏Toast */
  hideToast = () => {
    this.state.toastData = ref({ ...this.state.toastData, visible: false });
  };

  /**跳转登录页面*/
  toLoginPage = () => {
    const _loginPageRoute = `${this.loginPageRoute || ''}`.replace(/^\//, '');
    // 获取当前页面
    // 如果是登录页面不进行跳转
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    if (currentPage.route === _loginPageRoute) {
      // 如果是登录页面不进行跳转
      return;
    }
    // 跳转登录页面
    Taro.navigateTo({ url: `/${_loginPageRoute}` });
  };
}

export const globalDataInstance = new GlobalDataInstance();

export const useGlobalData = () => {
  const state = useSnapshot(globalDataInstance.state);
  return [state, globalDataInstance, state.__defaultValue] as const;
};
