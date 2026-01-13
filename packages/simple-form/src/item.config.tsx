/**
 * 表单配置
 */
import { View } from '@tarojs/components';

import { Fragment } from 'react';
import type { FormItemProps, FormListProps } from '@carefrees/form-utils-react-taro';
import { FormItem, FormHideItem, FormHideList, FormList } from '@carefrees/form-utils-react-taro';
import { FairysTaroRadioGroupBase, FairysTaroRadioGroupProps } from 'components/radio.group';
import { FairysTaroCalendarBase, FairysTaroCalendarProps } from 'components/calendar';
import { FairysTaroCascaderBase, FairysTaroCascaderProps } from 'components/cascader';
import { FairysTaroCheckboxGroupBase, FairysTaroCheckboxGroupProps } from 'components/checkbox.group';
import { FairysTaroDatePickerBase, FairysTaroDatePickerProps } from 'components/date.picker';
import { FairysTaroPickerBase, FairysTaroPickerProps } from 'components/picker';
import { FairysTaroPopupSearchBase, FairysTaroPopupSearchProps } from 'components/popup.search';

import {
  Input,
  TaroInputProps,
  InputNumber,
  TaroInputNumberProps,
  RadioGroup,
  RadioGroupProps,
  Radio,
  RadioProps,
  Range,
  RangeProps,
  Rate,
  RateProps,
  Signature,
  SignatureProps,
  Switch,
  SwitchProps,
  TextArea,
  TextAreaProps,
  Uploader,
  UploaderProps,
} from '@nutui/nutui-react-taro';

export type MObject<T> = { [K in keyof T]: T[K] };
export type MakeFieldRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * 表单项配置基础类型
 */
export interface FormItemRowConfingBaseType<T, M, K = undefined> {
  /**输入框类型*/
  type: T;
  /**输入框属性*/
  attrs?: Partial<T extends undefined ? TaroInputProps : M>;
  /**自定义渲染函数*/
  render?: K;
  /**是否添加隐藏组件*/
  isHide?: boolean;
  /**是否添加置空组件*/
  isEmpty?: boolean;
}

/**
 * 单个表单项配置类型
 */
interface FormItemRowConfing<T, M, K = undefined>
  extends FormItemRowConfingBaseType<T, M, K>,
    Omit<FormItemProps, 'attrs'> {}

/**
 * 表单项配置映射类型
 */
export type MappedType<T extends MObject<T>> = {
  [K in keyof T]: FormItemRowConfing<K, T[K]>;
}[keyof T];

/**
 * 表单项组件名对应组件类型
 */
export interface FormItemTypeConfing {
  /**输入框*/
  input: TaroInputProps;
  /**数字输入框*/
  inputNumber: TaroInputNumberProps;
  /**单选组*/
  fairysRadioGroup: FairysTaroRadioGroupProps;
  /**日历组件*/
  fairysCalendar: FairysTaroCalendarProps;
  /**级联选择器*/
  fairysCascader: FairysTaroCascaderProps;
  /**多选组*/
  fairysCheckboxGroup: FairysTaroCheckboxGroupProps;
  /**日期选择器*/
  fairysDatePicker: FairysTaroDatePickerProps;
  /**选择器*/
  fairysPicker: FairysTaroPickerProps;
  /**弹出搜索框*/
  fairysPopupSearch: FairysTaroPopupSearchProps;
  /**单选组*/
  radioGroup: RadioGroupProps;
  /**单选框*/
  radio: RadioProps;
  /**范围选择器*/
  range: RangeProps;
  /**评分组件*/
  rate: RateProps;
  /**签名组件*/
  signature: SignatureProps;
  /**开关组件*/
  switch: SwitchProps;
  /**多行文本输入框*/
  textarea: TextAreaProps;
  /**上传组件*/
  uploader: UploaderProps;
}

/**
 * 自定义表单列表项配置类型
 */
type CustomFormListType = FormItemRowConfingBaseType<'formList', any, React.ReactNode> & Omit<FormListProps, 'attrs'>;
/**
 * 表单项配置类型
 */
export type InputConfigType =
  | MappedType<FormItemTypeConfing>
  | FormItemRowConfing<'custom', any, React.ReactNode>
  | FormItemRowConfing<'render', any, React.ReactNode>
  | CustomFormListType;

const create_itemConfig = (configList: InputConfigType[]) => {
  return (
    <Fragment>
      {configList.map((item, index) => {
        const { type, isHide, attrs = {}, isEmpty, ...rest } = item;
        const newItem = { attrs, ...rest };
        /**自定义表单组件*/
        if (type === 'custom') {
          newItem.children = item.render || <Fragment />;
        } else if (type === 'render') {
          // 自定义渲染内容
          return <Fragment key={index}>{item.render}</Fragment>;
        } else if (type === 'formList') {
          if (typeof item.children === 'function') {
            if (isHide) {
              return <FormHideList sort={`${index}`} key={index} {...rest} children={item.children} name={item.name} />;
            }
            return <FormList sort={`${index}`} key={index} {...rest} children={item.children} name={item.name} />;
          }
          return <Fragment key={index} />;
        } else if (type === 'input') {
          newItem.children = <Input align="right" clearable {...attrs} />;
        } else if (type === 'inputNumber') {
          newItem.children = <InputNumber {...attrs} />;
        } else if (type === 'fairysRadioGroup') {
          newItem.children = <FairysTaroRadioGroupBase {...attrs} />;
        } else if (type === 'radioGroup') {
          newItem.children = <RadioGroup {...attrs} />;
        } else if (type === 'radio') {
          newItem.children = <Radio {...attrs} />;
        } else if (type === 'range') {
          newItem.children = <Range {...attrs} />;
        } else if (type === 'rate') {
          newItem.children = <Rate {...attrs} />;
        } else if (type === 'signature') {
          newItem.children = <Signature {...attrs} />;
        } else if (type === 'switch') {
          newItem.children = <Switch {...attrs} />;
        } else if (type === 'textarea') {
          newItem.children = <TextArea {...attrs} />;
        } else if (type === 'uploader') {
          newItem.children = <Uploader {...attrs} />;
        } else if (type === 'fairysCalendar') {
          newItem.children = <FairysTaroCalendarBase {...attrs} />;
        } else if (type === 'fairysCascader') {
          const title = attrs.title || (typeof item.label === 'string' ? item.label : '') || '请选择';
          newItem.children = <FairysTaroCascaderBase {...attrs} title={title} />;
        } else if (type === 'fairysCheckboxGroup') {
          newItem.children = <FairysTaroCheckboxGroupBase {...attrs} />;
        } else if (type === 'fairysDatePicker') {
          const title = attrs.title || (typeof item.label === 'string' ? item.label : '') || '请选择';
          newItem.children = <FairysTaroDatePickerBase {...attrs} title={title} />;
        } else if (type === 'fairysPicker') {
          const title = attrs.title || (typeof item.label === 'string' ? item.label : '') || '请选择';
          newItem.children = <FairysTaroPickerBase {...attrs} title={title} />;
        } else if (type === 'fairysPopupSearch') {
          const title = attrs.title || (typeof item.label === 'string' ? item.label : '') || '请选择';
          newItem.children = <FairysTaroPopupSearchBase {...attrs} title={title} />;
        }
        if (isEmpty) {
          return <View key={index} className="fairys-taro-simple-form-item-empty" />;
        }
        if (isHide) {
          return <FormHideItem sort={`${index}`} key={index} {...(newItem as FormItemProps)} />;
        }
        return <FormItem sort={`${index}`} key={index} {...(newItem as FormItemProps)} />;
      })}
    </Fragment>
  );
};

export const ConfigListItem = (props: { items: InputConfigType[] }) => {
  return create_itemConfig(props.items);
};

export const ConfigItem = (config: InputConfigType) => {
  return create_itemConfig([config]);
};
