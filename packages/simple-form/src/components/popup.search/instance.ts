import { useRef, createContext, useContext } from 'react';
import { proxy, useSnapshot, ref } from 'valtio';
import Taro from '@tarojs/taro';
import { TableColumnProps, TaroTableProps } from '@nutui/nutui-react-taro';

export class FairysTaroPopupSearchBaseInstanceMount<T = any> {
  /**选中项改变时触发*/
  onChange?: (value: T[] | T | undefined) => void;
  // 1. 直接传递值 ，2. 请求接口获取值
  onLoadData?: (params: any) => Promise<T[]>;
  /**其他请求参数*/
  otherRequestParams?: (params: any) => any;
  /**自定义输入框显示文本*/
  renderText?: (data: T | T[]) => React.ReactNode;
  /**自定义渲染列表项文本*/
  renderListItemText?: (data: T) => React.ReactNode;
  /**自定义渲染列表数据*/
  renderList?: (dataList: T[], type: 'select' | 'manage') => React.ReactNode;
  /**选择模式*/
  mode?: 'multiple' | 'single' = 'single';
  /**列表项的唯一键值*/
  rowKey?: string = 'value';
  /**提示框 显示字段*/
  displayField?: string = 'label';
  /**列表列配置*/
  columns?: TableColumnProps[] = [];
  /**最大弹窗宽度*/
  maxWidth?: number;
  /**最大弹窗高度*/
  maxHeight?: number;
  /**
   * 渲染类型
   * @default 'list'
   * */
  renderType?: 'list' | 'table' = 'list';
  /**表格属性*/
  tableProps?: Partial<TaroTableProps> = {};
  /**自定义表格属性*/
  useTableProps?: (
    tableProps: Partial<TaroTableProps>,
    instance: FairysTaroPopupSearchBaseInstanceMount<T>,
  ) => Partial<TaroTableProps>;
}

export interface FairysTaroPopupSearchBaseInstanceState<T = any> {
  /**无用默认值*/
  __defaultValue: string;
  // 弹窗是否显示
  visible: boolean;
  /**选中项*/
  value: T | T[] | undefined;
  // 列表数据
  dataList: T[];
  /**
   * 临时过滤数据列表
   * 使用 options 参数并且在 operationStatus = select 时使用，根据主键字段值和显示字段值进行过滤
   * 在 operationStatus = manage 时，过滤 _tempValue 中的值，根据主键字段值和显示字段值进行过滤
   */
  _tempFilterDataList: T[];
  // 搜索关键词
  search?: string;
  /**
   * 临时值(多选时使用)，用于临时存在，点击保存后赋值给 value
   */
  _tempValue: T | T[] | undefined;
  /**操作状态
   * @default 'select'
   */
  operationStatus: 'manage' | 'select';
  /**选中列表数据*/
  manageSelectedDataList: T[];
  /**全选按钮是否选中状态*/
  allChecked: boolean;
  /**选择模式
   * @default 'single'
   */
  mode?: 'multiple' | 'single';
  /**列表列配置*/
  columns?: TableColumnProps[];
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

  state = proxy<FairysTaroPopupSearchBaseInstanceState<T>>({
    /**选择模式*/
    mode: 'single',
    /**列表列配置*/
    columns: [],
    /**无用默认值*/
    __defaultValue: '',
    // 弹窗是否显示
    visible: false,
    /**选中项*/
    value: undefined,
    // 列表数据
    dataList: [],
    /**临时过滤数据列表*/
    _tempFilterDataList: [],
    // 搜索关键词
    search: '',
    /**
     * 临时值(多选时使用)，用于临时存在，点击保存后赋值给 value
     */
    _tempValue: undefined,
    /**操作状态*/
    operationStatus: 'select',
    /**选中列表数据*/
    manageSelectedDataList: [],
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
  onSearch = async (keyword: string) => {
    this.state.search = keyword;
    const _keyword = `${keyword || ''}`.trim();
    try {
      if (this.onLoadData && this.state.operationStatus === 'select') {
        // 延时 0.5s 搜索，避免用户输入过快导致请求次数过多
        await new Promise((resolve) => setTimeout(resolve, 500));
        const search = { keyword: _keyword };
        const dataList = await this.onLoadData(this.otherRequestParams?.(search) || search);
        if (Array.isArray(dataList)) {
          this.updateState({ _tempFilterDataList: dataList || [], dataList: dataList || [] });
        } else {
          this.updateState({ _tempFilterDataList: [] });
        }
      } else {
        // 直接过滤数据
        if (this.state.operationStatus === 'select') {
          if (!_keyword) {
            this.updateState({ _tempFilterDataList: this.state.dataList || [] });
            return;
          }
          const filterData = (this.state.dataList || []).filter((item) => {
            const displayText = item[this.displayField]?.toString() || '';
            const valueText = item[this.rowKey]?.toString() || '';
            return displayText.includes(_keyword) || valueText.includes(_keyword);
          });
          this.updateState({ _tempFilterDataList: filterData });
        } else {
          if (this.mode === 'multiple') {
            const v = this.state._tempValue;
            if (Array.isArray(v)) {
              if (!_keyword) {
                this.updateState({ _tempFilterDataList: v || [] });
                return;
              }
              const filterData = v.filter((item) => {
                const displayText = item[this.displayField]?.toString() || '';
                const valueText = item[this.rowKey]?.toString() || '';
                return displayText.includes(_keyword) || valueText.includes(_keyword);
              });
              this.updateState({ _tempFilterDataList: filterData });
            }
          }
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
      // 管理状态按照另一个字段判断
      if (this.state.operationStatus === 'manage') {
        return (
          (this.state.manageSelectedDataList || []).findIndex((item) => item[this.rowKey] === data[this.rowKey]) !== -1
        );
      }
      if (Array.isArray(this.state._tempValue)) {
        const findx = this.state._tempValue.findIndex((item) => item[this.rowKey] === data[this.rowKey]);
        return findx !== -1;
      }
    } else if (this.state._tempValue) {
      return this.state._tempValue?.[this.rowKey] === data?.[this.rowKey];
    }
    return false;
  };

  /**单个选中数据*/
  onCheckedData = (data: T, checked: boolean) => {
    if (this.mode === 'multiple') {
      if (this.state.operationStatus === 'manage') {
        if (checked) {
          const newList = (this.state.manageSelectedDataList || []).filter(
            (item) => item[this.rowKey] !== data[this.rowKey],
          );
          this.updateState({ manageSelectedDataList: [...newList] });
        } else {
          const newList = [...(this.state.manageSelectedDataList || [])].concat([data]);
          this.updateState({ manageSelectedDataList: newList });
        }
        return;
      }
      const _tempValue = this.state._tempValue || [];
      if (Array.isArray(_tempValue)) {
        if (checked) {
          const newList = _tempValue.filter((item) => item[this.rowKey] !== data[this.rowKey]);
          this.updateState({ _tempValue: [...newList] });
        } else {
          const findx = _tempValue.find((item) => item[this.rowKey] === data[this.rowKey]);
          if (!findx) {
            const newList = [..._tempValue].concat([data]);
            this.updateState({ _tempValue: newList });
          }
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
        if (this.state.operationStatus === 'manage') {
          // 管理状态下全选按钮点击后，移除所有选中数据
          const _tempFilterDataList = this.state._tempFilterDataList || [];
          const manageSelectedDataList = (this.state.manageSelectedDataList || []) as T[];
          const selectedList = manageSelectedDataList.filter(
            (item) => !_tempFilterDataList.find((dataItem) => dataItem[this.rowKey] === item[this.rowKey]),
          );
          this.updateState({ manageSelectedDataList: [...selectedList], allChecked: false });
          return;
        }
        // 移除
        const _tempValue = (this.state._tempValue || []) as T[];
        const dataList = (this.state.dataList || []) as T[];
        const newList = _tempValue.filter(
          (item) => !dataList.find((dataItem) => dataItem[this.rowKey] === item[this.rowKey]),
        );
        this.updateState({ _tempValue: newList, allChecked: false });
      } else {
        if (this.state.operationStatus === 'manage') {
          console.log(this.state._tempFilterDataList);
          // 管理状态下全选按钮点击后，移除所有选中数据
          this.updateState({
            manageSelectedDataList: this.state._tempFilterDataList || [],
            allChecked: true,
          });
          return;
        }
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
      _tempValue: this.state.value,
      operationStatus: 'select',
      /**临时过滤数据列表*/
      _tempFilterDataList: this.state.dataList || [],
    });
  };

  /**更新操作状态*/
  updateOperationStatus = () => {
    // 只有多选模式才需要更新操作状态
    if (this.mode === 'multiple') {
      if (this.state.operationStatus === 'manage') {
        this.updateState({
          operationStatus: 'select',
          manageSelectedDataList: [],
          _tempFilterDataList: this.state.dataList || [],
          allChecked: false,
          search: '',
        });
      } else {
        this.updateState({
          operationStatus: 'manage',
          manageSelectedDataList: [],
          _tempFilterDataList: (this.state._tempValue || []) as T[],
          allChecked: false,
          search: '',
        });
      }
    }
  };

  /**删除选中数据*/
  onDeleteData = (data?: T) => {
    if (this.mode === 'multiple') {
      if (data) {
        // 直接单个删除
        const _newValue = (this.state._tempValue || []) as T[];
        const _tempFilterDataList = (this.state._tempFilterDataList || []) as T[];
        if (Array.isArray(_newValue)) {
          const newList = _newValue.filter((item) => item[this.rowKey] !== data[this.rowKey]);
          const newFilterList = _tempFilterDataList.filter((item) => item[this.rowKey] !== data[this.rowKey]);
          this.updateState({ _tempValue: newList, _tempFilterDataList: newFilterList });
        }
      } else {
        const manageSelectedDataList = (this.state.manageSelectedDataList || []) as T[];
        const _newValue = (this.state._tempValue || []) as T[];
        const _tempFilterDataList = (this.state._tempFilterDataList || []) as T[];
        if (Array.isArray(_newValue)) {
          const newList = _newValue.filter(
            (item) => !manageSelectedDataList.find((manageItem) => manageItem[this.rowKey] === item[this.rowKey]),
          );
          const newFilterList = _tempFilterDataList.filter(
            (item) => !manageSelectedDataList.find((manageItem) => manageItem[this.rowKey] === item[this.rowKey]),
          );
          this.updateState({ _tempValue: newList, _tempFilterDataList: newFilterList, manageSelectedDataList: [] });
        }
      }
    }
  };
}

export function useFairysTaroPopupSearchBaseInstance<T = any>() {
  const instanceRef = useRef<FairysTaroPopupSearchBaseInstance<T>>(new FairysTaroPopupSearchBaseInstance<T>());
  const state = useSnapshot(instanceRef.current.state);
  const __defaultValue = state.__defaultValue;
  return [state, instanceRef.current, __defaultValue] as const;
}
export const FairysTaroPopupSearchBaseInstanceContext = createContext<FairysTaroPopupSearchBaseInstance>(
  new FairysTaroPopupSearchBaseInstance(),
);

export function useFairysTaroPopupSearchBaseInstanceContext<T = any>(options?: { sync?: boolean }) {
  const instance = useContext(FairysTaroPopupSearchBaseInstanceContext) as FairysTaroPopupSearchBaseInstance<T>;
  const state = useSnapshot(instance.state, options);
  const __defaultValue = state.__defaultValue;
  return [state, instance, __defaultValue] as const;
}
