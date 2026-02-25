# 表单使用

:::tip

快捷使用表单组件，无需引入其他组件，直接使用即可。

:::

**引入**

```ts
import { FairysTaroSimpleForm } from '@fairys/taro-tools-simple-form';
```


## 组件参数

```ts
import { ReactNode } from 'react';
import type { FormItemProps, FormListProps } from '@carefrees/form-utils-react-taro';
import { FairysTaroRadioGroupProps } from './components/radio.group';
import { FairysTaroCalendarProps } from './components/calendar';
import { FairysTaroCascaderProps } from './components/cascader';
import { FairysTaroCheckboxGroupProps } from './components/checkbox.group';
import { FairysTaroDatePickerProps } from './components/date.picker';
import { FairysTaroPickerProps } from './components/picker';
import { FairysTaroPopupSearchProps } from './components/popup.search';
import { TaroInputProps, TaroInputNumberProps, RadioGroupProps, RadioProps, RangeProps, RateProps, SignatureProps, SwitchProps, TextAreaProps, UploaderProps } from '@nutui/nutui-react-taro';
export interface ItemType<T, K = TaroInputProps> extends FormItemProps {
    /**输入框类型*/
    type?: T;
    /**输入框属性*/
    attrs?: K;
    /**自定义渲染函数*/
    render?: undefined;
    /**是否添加隐藏组件*/
    isHide?: boolean;
    /**是否添加置空组件*/
    isEmpty?: boolean;
}
type CustomType = {
    isEmpty?: boolean;
    type?: 'custom';
    render?: any;
    isHide?: boolean;
    attrs?: any;
    label?: ReactNode | {
        text?: string;
    };
} & FormItemProps;
type CustomRenderType = {
    isEmpty?: boolean;
    type?: 'render';
    render?: React.ReactNode;
    isHide?: boolean;
    attrs?: any;
    label?: ReactNode | {
        text?: string;
    };
} & FormItemProps;
type CustomFormListType = {
    isEmpty?: boolean;
    type?: 'formList';
    isHide?: boolean;
    attrs?: any;
    label?: ReactNode | {
        text?: string;
    };
} & FormListProps;
export type InputConfigType = ItemType<'input', TaroInputProps> | ItemType<'inputNumber', TaroInputNumberProps> | ItemType<'fairysRadioGroup', FairysTaroRadioGroupProps> | ItemType<'fairysCalendar', FairysTaroCalendarProps> | ItemType<'fairysCascader', FairysTaroCascaderProps> | ItemType<'fairysCheckboxGroup', FairysTaroCheckboxGroupProps> | ItemType<'fairysDatePicker', FairysTaroDatePickerProps> | ItemType<'fairysPicker', FairysTaroPickerProps> | ItemType<'fairysPopupSearch', FairysTaroPopupSearchProps> | ItemType<'radioGroup', RadioGroupProps> | ItemType<'radio', RadioProps> | ItemType<'range', RangeProps> | ItemType<'rate', RateProps> | ItemType<'signature', SignatureProps> | ItemType<'switch', SwitchProps> | ItemType<'textarea', TextAreaProps> | ItemType<'uploader', UploaderProps> | CustomType | CustomRenderType | CustomFormListType;
export declare const ConfigListItem: (props: {
    items: InputConfigType[];
}) => import("react/jsx-runtime").JSX.Element;
export declare const ConfigItem: (config: InputConfigType) => import("react/jsx-runtime").JSX.Element;
/**
 * 简版表单
 * 用于快速创建表单，支持文本输入、选择框、单选框、复选框等常用表单元素。
 * */
import { useForm } from '@carefrees/form-utils-react-taro';
import { FormProps } from '@carefrees/form-utils-react-taro';
export interface FairysTaroSimpleFormProps extends FormProps {
}
export declare const FairysTaroSimpleForm: {
    (props: FairysTaroSimpleFormProps): import("react/jsx-runtime").JSX.Element;
    Item: (config: InputConfigType) => import("react/jsx-runtime").JSX.Element;
    ListItem: (props: {
        items: InputConfigType[];
    }) => import("react/jsx-runtime").JSX.Element;
    useForm: typeof useForm;
    useWatch: (name: string, form?: import("@carefrees/form-utils").FormInstanceBase, callBack?: (value: any, form: import("@carefrees/form-utils").FormInstanceBase) => void) => [any, import("@carefrees/form-utils").FormInstanceBase, import("@carefrees/form-utils-react-taro").WatchInstanceBase];
};

```

其他请参考[@carefrees/form-utils-react-taro](https://sunlxy.github.io/carefrees-form-utils/react/taro.html)

## 案例

```tsx
import { View, Text } from '@tarojs/components';
import {
  connectToastMessage,
  FairysTaroMainPage,
  FairysTaroMainPageSearch,
  FairysTaroMainPageBody,
  FairysTaroMainPageFooter,
  globalMessageDataInstance,
} from '@fairys/taro-tools-react';
import { Button } from '@nutui/nutui-react-taro';
import { FairysTaroSimpleForm } from '@fairys/taro-tools-simple-form';

function Index() {
  const form = FairysTaroSimpleForm.useForm();

  const onSubmit = () => {
    form
      .validate()
      .then((values) => {
        console.log(values);
        globalMessageDataInstance.showMessage({
          type: 'success',
          content: '表单成功',
        });
      })
      .catch((error) => {
        globalMessageDataInstance.showMessage({
          type: 'error',
          content: error.message || '表单校验失败',
        });
      });
  };

  return (
    <FairysTaroMainPage>
      <FairysTaroMainPageSearch>
        <FairysTaroSimpleForm form={form}>
          <FairysTaroSimpleForm.Item label="用户名" name="username" type="fairysCalendar" />
          <FairysTaroSimpleForm.Item
            label="级联选择器"
            name="cascader"
            type="fairysCascader"
            rules={[{ required: true, message: '请选择级联选择器' }]}
            attrs={{
              options: [
                { value: 'A0', text: 'A0_1' },
                {
                  value: 'B0',
                  text: 'B0_1',
                  children: [
                    { value: 'B11', text: 'B11_1', leaf: true },
                    { value: 'B12', text: 'B12_1' },
                  ],
                },
                { value: 'C0', text: 'C0_1' },
              ],
            }}
          />
          <FairysTaroSimpleForm.Item
            label="复选框组"
            name="checkboxGroup"
            type="fairysCheckboxGroup"
            rules={[{ required: true, message: '请选择复选框组' }]}
            attrs={{
              items: [
                { value: 'A0', label: 'A0_1' },
                { value: 'B0', label: 'B0_1' },
                { value: 'C0', label: 'C0_1' },
              ],
            }}
          />
          <FairysTaroSimpleForm.Item
            label="日期选择器"
            name="datePicker"
            type="fairysDatePicker"
            rules={[{ required: true, message: '请选择日期选择器' }]}
            attrs={{
              type: 'datetime',
            }}
          />
          <FairysTaroSimpleForm.Item
            label="选择器"
            name="picker"
            type="fairysPicker"
            attrs={{
              options: [
                // 第一列
                [
                  { label: '周一', value: 'Monday' },
                  { label: '周二', value: 'Tuesday' },
                  { label: '周三', value: 'Wednesday' },
                  { label: '周四', value: 'Thursday' },
                  { label: '周五', value: 'Friday' },
                ],
                // 第二列
                [
                  { label: '上午', value: 'Morning' },
                  { label: '下午', value: 'Afternoon' },
                  { label: '晚上', value: 'Evening' },
                ],
              ],
            }}
          />
          <FairysTaroSimpleForm.Item
            label="搜索选择器"
            name="popupSearch"
            type="fairysPopupSearch"
            attrs={{
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
            }}
          />
          <FairysTaroSimpleForm.Item
            label="搜索选择器(表格)"
            name="popupSearch-table"
            type="fairysPopupSearch"
            attrs={{
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
            }}
          />

          <FairysTaroSimpleForm.Item
            label="多选搜索选择器"
            name="m-popupSearch"
            type="fairysPopupSearch"
            attrs={{
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
            }}
          />
          <FairysTaroSimpleForm.Item
            label="多选搜索选择器(表格)"
            name="m-popupSearch-table"
            type="fairysPopupSearch"
            attrs={{
              placeholder: '请选择',
              mode: 'multiple',
              renderType: 'table',
              isNeedManage: true,
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
            }}
          />
        </FairysTaroSimpleForm>
      </FairysTaroMainPageSearch>
      <FairysTaroMainPageBody>
       
      </FairysTaroMainPageBody>
      <FairysTaroMainPageFooter
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0.3rem 0.5rem' }}
      >
        <Button block type="primary" onClick={onSubmit}>
          提交
        </Button>
      </FairysTaroMainPageFooter>
    </FairysTaroMainPage>
  );
}
export default connectToastMessage(Index);
```