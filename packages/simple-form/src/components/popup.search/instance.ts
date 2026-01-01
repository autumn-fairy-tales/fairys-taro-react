import { useRef } from 'react';
import { proxy, useSnapshot, ref } from 'valtio';
import Taro from '@tarojs/taro';

export class FairysTaroPopupSearchBaseInstanceMount<T = any> {
  /**选中项改变时触发*/
  onChange?: (value: T[] | T | undefined) => void;
  // 1. 直接传递值 ，2. 请求接口获取值
  onLoadData?: (params: any) => Promise<T[]>;
  /**其他请求参数*/
  otherRequestParams?: (params: any) => any;
  /**自定义渲染选中项文本*/
  renderText?: (data: T | T[]) => React.ReactNode;
  /**选择模式*/
  mode?: 'multiple' | 'single' = 'single';
  /**列表项的唯一键值*/
  rowKey?: string = 'value';
  /**提示框 显示字段*/
  displayField?: string = 'label';
  /**列表列配置*/
  column?: {
    /**列标题*/
    title: string;
    /**列数据字段*/
    dataIndex: string;
    /**自定义渲染列内容*/
    render?: (value: any, rowData: T) => React.ReactNode;
  }[] = [];
  /**最大弹窗宽度*/
  maxWidth?: number;
  /**最大弹窗高度*/
  maxHeight?: number;
}

export class FairysTaroPopupSearchBaseInstance<T = any> extends FairysTaroPopupSearchBaseInstanceMount<T> {
  /**窗口高度*/
  windowHeight: number = 0;
  /**窗口宽度*/
  windowWidth: number = 0;
  /**弹窗宽度*/
  popupWidth: number = 0;
  /**弹窗高度*/
  popupHeight: number = 0;

  state = proxy({
    visible: false,
    value: undefined as T | T[] | undefined,
    dataList: [] as T[],
    search: '',
    /**
     * 临时值(多选时使用)，用于临时存在，点击保存后赋值给 value
     */
    _tempValue: undefined as T | T[] | undefined,
    /**操作状态*/
    operationStatus: 'manage' as 'manage' | 'select',
    /**选中列表数据*/
    manageSelectedDataList: [] as T[],
    /**全选按钮是否选中状态*/
    allChecked: false,
  });

  ctor() {
    const isWeb = Taro.getEnv() === Taro.ENV_TYPE.WEB;
    if (isWeb) {
      this.windowHeight = window.document.documentElement.clientHeight;
      this.windowWidth = window.document.documentElement.clientWidth;
    } else {
      const windowInfo = Taro.getWindowInfo();
      this.windowHeight = windowInfo.windowHeight;
      this.windowWidth = windowInfo.windowWidth;
    }
    this.popupHeight = this.windowHeight * 0.6;
    if (this.maxHeight) {
      this.popupHeight = Math.min(this.popupHeight, this.maxHeight);
    }
    this.popupWidth = this.windowWidth * 0.8;
    if (this.maxWidth) {
      this.popupWidth = Math.min(this.popupWidth, this.maxWidth);
    }
  }

  /**更新状态*/
  updateState = (state: Partial<typeof this.state>) => {
    for (const key in state) {
      const value = state[key];
      if (Array.isArray(value) || Object.prototype.toString.call(value) === '[object Object]') {
        this.state[key] = ref(value);
      } else {
        this.state[key] = value;
      }
    }
  };

  /**搜索*/
  onSearch = async () => {
    try {
      if (this.onLoadData) {
        const search = { keyword: this.state.search };
        const dataList = await this.onLoadData(this.otherRequestParams?.(search) || search);
        if (Array.isArray(dataList)) {
          this.updateState({ dataList });
        } else {
          this.updateState({ dataList: [] });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**保存数据*/
  onSave = () => {
    // 选中的进行保存
    if (this.mode === 'multiple') {
      const dataList = (this.state._tempValue || []) as T[];
      this.updateState({ value: dataList, _tempValue: dataList, allChecked: false });
      this.onChange?.(dataList);
      this.onClose();
    }
  };

  /**清空数据*/
  onClear = () => {
    this.state.value = undefined;
    this.state._tempValue = undefined;
    this.state.allChecked = false;
    this.onChange?.(undefined);
  };

  /**是否选中数据*/
  isCheckedData = (data: T) => {
    if (this.mode === 'multiple') {
      if (Array.isArray(this.state.value)) {
        const findx = this.state.value.findIndex((item) => item[this.rowKey] === data[this.rowKey]);
        return findx !== -1;
      }
    } else if (this.state.value) {
      return this.state.value?.[this.rowKey] === data?.[this.rowKey];
    }
    return false;
  };

  /**单个选中数据*/
  onCheckedData = (data: T) => {
    if (this.mode === 'multiple') {
      const _tempValue = this.state._tempValue || [];
      if (Array.isArray(_tempValue)) {
        const findx = _tempValue.find((item) => item[this.rowKey] === data[this.rowKey]);
        if (!findx) {
          const newList = [..._tempValue].concat([data]);
          this.updateState({ _tempValue: newList });
        }
      }
    } else {
      this.updateState({ value: data, _tempValue: data });
      this.onChange?.(data);
      this.onClose();
    }
  };

  /**全选按钮*/
  onAllChecked = () => {
    if (this.mode === 'multiple') {
      if (this.state.allChecked) {
        // 移除
        const _tempValue = (this.state._tempValue || []) as T[];
        const dataList = (this.state.dataList || []) as T[];
        const newList = _tempValue.filter(
          (item) => !dataList.find((dataItem) => dataItem[this.rowKey] === item[this.rowKey]),
        );
        this.updateState({ _tempValue: newList, allChecked: false });
      } else {
        const _tempValue = (this.state._tempValue || []) as T[];
        const dataList = (this.state.dataList || []) as T[];
        const newList = [..._tempValue].concat(dataList);
        this.updateState({ _tempValue: newList, allChecked: true });
      }
    }
  };

  /**关闭弹窗*/
  onClose = () => {
    this.updateState({
      visible: false,
      allChecked: false,
      manageSelectedDataList: [],
      search: '',
      dataList: [],
      _tempValue: this.state.value,
    });
  };

  /**更新操作状态*/
  updateOperationStatus = () => {
    if (this.state.operationStatus === 'manage') {
      this.updateState({ operationStatus: 'select', manageSelectedDataList: [] });
    } else {
      this.updateState({ operationStatus: 'manage', manageSelectedDataList: [] });
    }
  };

  /**删除选中数据*/
  onDeleteData = (data?: T) => {
    if (this.mode === 'multiple') {
      if (data) {
        // 直接单个删除
        const _newValue = (this.state._tempValue || []) as T[];
        if (Array.isArray(_newValue)) {
          const newList = _newValue.filter((item) => item[this.rowKey] !== data[this.rowKey]);
          this.updateState({ _tempValue: newList });
        }
      } else {
        const manageSelectedDataList = (this.state.manageSelectedDataList || []) as T[];
        const _newValue = (this.state._tempValue || []) as T[];
        if (Array.isArray(_newValue)) {
          const newList = _newValue.filter(
            (item) => !manageSelectedDataList.find((manageItem) => manageItem[this.rowKey] === item[this.rowKey]),
          );
          this.updateState({ _tempValue: newList, manageSelectedDataList: [] });
        }
      }
    }
  };
}

export function useFairysTaroPopupSearchBaseInstance<T = any>() {
  const instanceRef = useRef<FairysTaroPopupSearchBaseInstance<T>>(new FairysTaroPopupSearchBaseInstance<T>());
  const state = useSnapshot(instanceRef.current.state);
  return [state, instanceRef.current] as const;
}
