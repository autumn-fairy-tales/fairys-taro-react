# 搜索选择器

**引入**

```ts
import { FairysTaroPopupSearchBase } from '@fairys/taro-tools-simple-form';
```


## 组件参数

```ts
import { TableColumnProps, TaroTableProps } from '@nutui/nutui-react-taro';
export declare class FairysTaroPopupSearchBaseInstanceMount<T = any> {
    /**选中项改变时触发*/
    onChange?: (value: T[] | T | undefined) => void;
    onLoadData?: (params: any, instance: FairysTaroPopupSearchBaseInstanceMount<T>) => Promise<T[]>;
    /**其他请求参数*/
    otherRequestParams?: (params: any, instance: FairysTaroPopupSearchBaseInstanceMount<T>) => any;
    /**自定义输入框显示文本*/
    renderText?: (data: T | T[], instance: FairysTaroPopupSearchBaseInstanceMount<T>) => React.ReactNode;
    /**自定义渲染列表项文本*/
    renderListItemText?: (data: T, instance: FairysTaroPopupSearchBaseInstanceMount<T>) => React.ReactNode;
    /**自定义渲染列表数据*/
    renderList?: (dataList: T[], type: 'select' | 'manage', instance: FairysTaroPopupSearchBaseInstanceMount<T>) => React.ReactNode;
    /**选择模式*/
    mode?: 'multiple' | 'single';
    /**列表项的唯一键值*/
    rowKey?: string;
    /**提示框 显示字段*/
    displayField?: string;
    /**列表列配置*/
    columns?: TableColumnProps[];
    /**最大弹窗宽度*/
    maxWidth?: number;
    /**最大弹窗高度*/
    maxHeight?: number;
    /**是否需要管理已选择的数据*/
    isNeedManage?: boolean;
    /**是否选中状态，在使用 options 参数渲染固定列数据的时候是否需要选中状态*/
    isUseOptionsChecked?: boolean;
    /**
     * 渲染类型
     * @default 'list'
     * */
    renderType?: 'list' | 'table' | 'custom';
    /**表格属性*/
    tableProps?: Partial<TaroTableProps>;
    /**自定义表格属性*/
    useTableProps?: (tableProps: Partial<TaroTableProps>, instance: FairysTaroPopupSearchBaseInstanceMount<T>) => Partial<TaroTableProps>;
    /**是否显示删除按钮*/
    showRowDeleteButton?: boolean;
    /**是否显示搜索框*/
    showSearch?: boolean;
    /**选中项*/
    value?: T | T[];
    /**选择数据*/
    options?: ({
        label?: string;
        value?: string | number;
        [x: string]: any;
    } & T)[];
    /**
     * 最大渲染个数数量
     */
    maxTagCount?: number;
}
export interface FairysTaroPopupSearchBaseInstanceState<T = any> {
    /**无用默认值*/
    __defaultValue: string;
    visible: boolean;
    /**选中项*/
    value: T | T[] | undefined;
    dataList: T[];
    /**
     * 临时过滤数据列表
     * 使用 options 参数并且在 operationStatus = select 时使用，根据主键字段值和显示字段值进行过滤
     * 在 operationStatus = manage 时，过滤 _tempValue 中的值，根据主键字段值和显示字段值进行过滤
     */
    _tempFilterDataList: T[];
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
export declare class FairysTaroPopupSearchBaseInstance<T = any> extends FairysTaroPopupSearchBaseInstanceMount<T> {
    /**窗口高度*/
    windowHeight: number;
    /**窗口宽度*/
    windowWidth: number;
    /**弹窗宽度*/
    popupWidth: number;
    /**弹窗高度*/
    popupHeight: number;
    state: FairysTaroPopupSearchBaseInstanceState<T>;
    ctor(): void;
    /**更新状态*/
    updateState: (state: Partial<typeof this.state>) => void;
    /**判断是否使用 options 参数,并且不是管理模式*/
    isUseOptions: () => boolean;
    /**搜索*/
    onSearch: (keyword: string) => Promise<void>;
    /**保存数据*/
    onSave: () => void;
    /**清空数据*/
    onClear: () => void;
    /**是否选中数据*/
    isCheckedData: (data: T) => boolean;
    /**单个选中数据*/
    onCheckedData: (data: T, checked: boolean) => void;
    /**全选按钮*/
    onAllChecked: () => void;
    /**关闭弹窗*/
    onClose: () => void;
    /**更新操作状态*/
    updateOperationStatus: () => void;
    /**删除选中数据*/
    onDeleteData: (data?: T) => void;
}
export declare function useFairysTaroPopupSearchBaseInstance<T = any>(): readonly [FairysTaroPopupSearchBaseInstanceState<T>, FairysTaroPopupSearchBaseInstance<T>, string];
export declare const FairysTaroPopupSearchBaseInstanceContext: import("react").Context<FairysTaroPopupSearchBaseInstance<any>>;
export declare function useFairysTaroPopupSearchBaseInstanceContext<T = any>(options?: {
    sync?: boolean;
}): readonly [FairysTaroPopupSearchBaseInstanceState<T>, FairysTaroPopupSearchBaseInstance<T>, string];

export interface FairysTaroPopupSearchProps<T = any>
  extends Partial<TaroPopupProps>,
    FairysTaroPopupSearchBaseInstanceMount<T> {
  placeholder?: string;
}

```

## 单选

```ts
import { FairysTaroPopupSearchBase } from '@fairys/taro-tools-simple-form';

const attrs ={
  placeholder: '请选择',
  mode: 'single',
  options: [
    { value: 'A0', label: 'A0_1' },
    { value: 'B0', label: 'B0_1' },
    { value: 'C0', label: 'C0_1' },
    { value: 'D0', label: 'D0_1' },
    { value: 'E0', label: 'E0_1' },
    { value: 'F0', label: 'F0_1' },
    { value: 'G0', label: 'G0_1' },
    { value: 'H0', label: 'H0_1' },
    { value: 'I0', label: 'I0_1' },
    { value: 'J0', label: 'J0_1' },
    { value: 'K0', label: 'K0_1' },
    { value: 'L0', label: 'L0_1' },
    { value: 'M0', label: 'M0_1' },
  ],
}

const Page = ()=>{
  return <FairysTaroPopupSearchBase {...attrs} />
}

export default Page

```

## 单选表格渲染

```ts
import { FairysTaroPopupSearchBase } from '@fairys/taro-tools-simple-form';

const attrs ={
  placeholder: '请选择',
  mode: 'single',
  renderType: 'table',
  columns: [
    { title: '选项值', key: 'value' },
    { title: '选项标签', key: 'label' },
  ],
  options: [
    { value: 'A0', label: 'A0_1' },
    { value: 'B0', label: 'B0_1' },
    { value: 'C0', label: 'C0_1' },
    { value: 'D0', label: 'D0_1' },
    { value: 'E0', label: 'E0_1' },
    { value: 'F0', label: 'F0_1' },
    { value: 'G0', label: 'G0_1' },
    { value: 'H0', label: 'H0_1' },
    { value: 'I0', label: 'I0_1' },
    { value: 'J0', label: 'J0_1' },
    { value: 'K0', label: 'K0_1' },
    { value: 'L0', label: 'L0_1' },
    { value: 'M0', label: 'M0_1' },
  ],
}

const Page = ()=>{
  return <FairysTaroPopupSearchBase {...attrs} />
}

export default Page

```

## 多选

```ts
import { FairysTaroPopupSearchBase } from '@fairys/taro-tools-simple-form';

const attrs ={
  placeholder: '请选择',
  mode: 'multiple',
  options: [
    { value: 'A0', label: 'A0_1' },
    { value: 'B0', label: 'B0_1' },
    { value: 'C0', label: 'C0_1' },
    { value: 'D0', label: 'D0_1' },
    { value: 'E0', label: 'E0_1' },
    { value: 'F0', label: 'F0_1' },
    { value: 'G0', label: 'G0_1' },
    { value: 'H0', label: 'H0_1' },
    { value: 'I0', label: 'I0_1' },
    { value: 'J0', label: 'J0_1' },
    { value: 'K0', label: 'K0_1' },
    { value: 'L0', label: 'L0_1' },
    { value: 'M0', label: 'M0_1' },
  ],
}

const Page = ()=>{
  return <FairysTaroPopupSearchBase {...attrs} />
}

export default Page

```

## 多选表格渲染

```ts
import { FairysTaroPopupSearchBase } from '@fairys/taro-tools-simple-form';

const attrs ={
  placeholder: '请选择',
  mode: 'multiple',
  renderType: 'table',
  columns: [
    { title: '选项值', key: 'value' },
    { title: '选项标签', key: 'label' },
  ],
  options: [
    { value: 'A0', label: 'A0_1' },
    { value: 'B0', label: 'B0_1' },
    { value: 'C0', label: 'C0_1' },
    { value: 'D0', label: 'D0_1' },
    { value: 'E0', label: 'E0_1' },
    { value: 'F0', label: 'F0_1' },
    { value: 'G0', label: 'G0_1' },
    { value: 'H0', label: 'H0_1' },
    { value: 'I0', label: 'I0_1' },
    { value: 'J0', label: 'J0_1' },
    { value: 'K0', label: 'K0_1' },
    { value: 'L0', label: 'L0_1' },
    { value: 'M0', label: 'M0_1' },
  ],
}

const Page = ()=>{
  return <FairysTaroPopupSearchBase {...attrs} />
}

export default Page

```

## 异步加载

```ts
import { FairysTaroPopupSearchBase } from '@fairys/taro-tools-simple-form';

const attrs ={
  placeholder: '请选择',
  mode: 'multiple',
  onLoadData: async (params: { keyword: string }) => {
    return Promise.resolve([
      { value: 'A0', label: 'A0_1' },
      { value: 'B0', label: 'B0_1' },
      { value: 'C0', label: 'C0_1' },
      { value: 'D0', label: 'D0_1' },
      { value: 'E0', label: 'E0_1' },
      { value: 'F0', label: 'F0_1' },
      { value: 'G0', label: 'G0_1' },
      { value: 'H0', label: 'H0_1' },
      { value: 'I0', label: 'I0_1' },
      { value: 'J0', label: 'J0_1' },
      { value: 'K0', label: 'K0_1' },
      { value: 'L0', label: 'L0_1' },
      { value: 'M0', label: 'M0_1' },
    ])
  },
}

const Page = ()=>{
  return <FairysTaroPopupSearchBase {...attrs} />
}

export default Page

```
