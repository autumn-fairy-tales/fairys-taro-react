/**
 * 表单配置
 */
import { View } from '@tarojs/components';

import { Fragment, ReactNode } from 'react';
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

export interface ItemType<T, K = TaroInputProps> extends FormItemProps {
  /**输入框类型*/
  type?: T;
  /**输入框属性*/
  attr?: K;
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
  attr?: any;
  label?: ReactNode | { text?: string };
} & FormItemProps;
type CustomRenderType = {
  isEmpty?: boolean;
  type?: 'render';
  render?: React.ReactNode;
  isHide?: boolean;
  attr?: any;
  label?: ReactNode | { text?: string };
} & FormItemProps;
type CustomFormListType = {
  isEmpty?: boolean;
  type?: 'formList';
  isHide?: boolean;
  attr?: any;
  label?: ReactNode | { text?: string };
} & FormListProps;

export type InputConfigType =
  | ItemType<'input', TaroInputProps>
  | ItemType<'inputNumber', TaroInputNumberProps>
  | ItemType<'fairysRadioGroup', FairysTaroRadioGroupProps>
  | ItemType<'fairysCalendar', FairysTaroCalendarProps>
  | ItemType<'fairysCascader', FairysTaroCascaderProps>
  | ItemType<'fairysCheckboxGroup', FairysTaroCheckboxGroupProps>
  | ItemType<'fairysDatePicker', FairysTaroDatePickerProps>
  | ItemType<'fairysPicker', FairysTaroPickerProps>
  | ItemType<'fairysPopupSearch', FairysTaroPopupSearchProps>
  | ItemType<'radioGroup', RadioGroupProps>
  | ItemType<'radio', RadioProps>
  | ItemType<'range', RangeProps>
  | ItemType<'rate', RateProps>
  | ItemType<'signature', SignatureProps>
  | ItemType<'switch', SwitchProps>
  | ItemType<'textarea', TextAreaProps>
  | ItemType<'uploader', UploaderProps>
  | CustomType
  | CustomRenderType
  | CustomFormListType;

const create_itemConfig = (configList: InputConfigType[]) => {
  return (
    <Fragment>
      {configList.map((item, index) => {
        const { type, isHide, attr = {}, isEmpty, ...rest } = item;
        const newItem = { attr, ...rest } as any;
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
          newItem.children = <Input align="right" clearable {...attr} />;
        } else if (type === 'inputNumber') {
          newItem.children = <InputNumber align="right" clearable {...attr} />;
        } else if (type === 'fairysRadioGroup') {
          newItem.children = <FairysTaroRadioGroupBase {...attr} />;
        } else if (type === 'radioGroup') {
          newItem.children = <RadioGroup {...attr} />;
        } else if (type === 'radio') {
          newItem.children = <Radio {...attr} />;
        } else if (type === 'range') {
          newItem.children = <Range {...attr} />;
        } else if (type === 'rate') {
          newItem.children = <Rate {...attr} />;
        } else if (type === 'signature') {
          newItem.children = <Signature {...attr} />;
        } else if (type === 'switch') {
          newItem.children = <Switch {...attr} />;
        } else if (type === 'textarea') {
          newItem.children = <TextArea {...attr} />;
        } else if (type === 'uploader') {
          newItem.children = <Uploader {...attr} />;
        } else if (type === 'fairysCalendar') {
          newItem.children = <FairysTaroCalendarBase {...attr} />;
        } else if (type === 'fairysCascader') {
          const title = attr.title || (typeof item.label === 'string' ? item.label : '') || '请选择';
          newItem.children = <FairysTaroCascaderBase {...attr} title={title} />;
        } else if (type === 'fairysCheckboxGroup') {
          newItem.children = <FairysTaroCheckboxGroupBase {...attr} />;
        } else if (type === 'fairysDatePicker') {
          const title = attr.title || (typeof item.label === 'string' ? item.label : '') || '请选择';
          newItem.children = <FairysTaroDatePickerBase {...attr} title={title} />;
        } else if (type === 'fairysPicker') {
          const title = attr.title || (typeof item.label === 'string' ? item.label : '') || '请选择';
          newItem.children = <FairysTaroPickerBase {...attr} title={title} />;
        } else if (type === 'fairysPopupSearch') {
          const title = attr.title || (typeof item.label === 'string' ? item.label : '') || '请选择';
          newItem.children = <FairysTaroPopupSearchBase {...attr} title={title} />;
        }
        if (isEmpty) {
          return <View key={index} className="fairys-taro-simple-form-item-empty" />;
        }
        if (isHide) {
          return <FormHideItem sort={`${index}`} key={index} {...newItem} />;
        }
        return <FormItem sort={`${index}`} key={index} {...newItem} />;
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
