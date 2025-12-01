import { proxy, useSnapshot } from 'valtio';
import { ProxyInstanceObjectBase } from 'utils/valtio/instance';

export interface GlobalSettingDataInstanceState {
  /**
   * 请求成功返回code
   * @default 200
   */
  requestSuccessCode?: number;
  /**数据默认值不使用*/
  __defaultValue?: string;
}

export class GlobalSettingDataInstance extends ProxyInstanceObjectBase<GlobalSettingDataInstanceState> {
  store = proxy<GlobalSettingDataInstanceState>({
    requestSuccessCode: 200,
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
  return [store, globalSettingDataInstance, store.__defaultValue] as const;
};
