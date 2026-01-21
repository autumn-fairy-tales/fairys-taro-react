/**表单项*/

import { MObject } from 'interface';
import React, { useMemo } from 'react';
import clsx from 'clsx';
import { useFairysValtioFormInstanceContextState, FairysValtioFormInstance } from './instance';
import { useFairysValtioFormLayoutContext, FairysValtioFormLayoutContextOptions } from './layout';

export interface FairysValtioFormItemAttrsProps<T extends MObject<T> = object> {
  /**表单项名称*/
  name: string;
  /**表单项标签*/
  label?: string;
  /**传递组件字段*/
  valuePropName?: string;
  /**自定义获取值*/
  getValueFromEvent?: (event: any, form: FairysValtioFormInstance<T>) => any;
  /**值格式化*/
  formatValue?: (value: any, form: FairysValtioFormInstance<T>, event: any) => any;
  /**触发数据更新之后触发（用于数据联动之类的）*/
  onAfterUpdate?: (value: any, form: FairysValtioFormInstance<T>, event: any) => void;
  /**事件名称*/
  trigger?: string;
  className?: string;
  style?: React.CSSProperties;
  labelClassName?: string;
  labelStyle?: React.CSSProperties;
  bodyClassName?: string;
  bodyStyle?: React.CSSProperties;
  children?: React.ReactNode;
  /**规则校验失败错误提示位置*/
  errorLayout?: 'left-bottom' | 'right-bottom' | 'top-right' | 'top-left';
  /**label显示模式*/
  labelMode?: 'left' | 'top' | 'between';
  /**额外内容*/
  extra?: React.ReactNode;
  /**底部提示内容*/
  helpText?: React.ReactNode;
  /**
   * 表单项占据列数
   * @default 1
   */
  colSpan?: number;
  /**
   * 表单项占据行数
   * @default 1
   */
  rowSpan?: number;
  /**是否必填*/
  isRequired?: boolean;
  /**是否显示冒号*/
  showColon?: boolean;
  /**底部显示边框*/
  itemBorderType?: FairysValtioFormLayoutContextOptions['itemBorderType'];
  /**边框颜色*/
  itemBorderColor?: React.CSSProperties['borderColor'];
  /**输入框属性*/
  attrs?: any;
}

/**
 * 处理表单表单项属性
 * 
 * @example
 * 
 * ```tsx
import { Fragment } from 'react'
import { useFairysValtioFormItemAttrs } from "@fairys/valtio-form"
import type { FairysValtioFormItemAttrsProps } from "@fairys/valtio-form"
export interface FormItemProps extends FairysValtioFormItemAttrsProps{}

export const FormItem = (props: FormItemProps) => {
  const { label, extra, helpText } = props
  const {
    itemClassName, itemStyle, containerClassName, itemLabelClassName, itemLabelStyle,
    itemBodyClassName, itemBodyStyle, itemInputClassName, itemExtraClassName, errorClassName, helpClassName,
    isInvalid, itemBorderType, children, error
  } = useFairysValtioFormItemAttrs(props)

  return (
    <View className={itemClassName} style={itemStyle}>
      <View className={containerClassName}>
        <View className={itemLabelClassName} style={itemLabelStyle}>
          {label}
        </View>
        <View className={itemBodyClassName} style={itemBodyStyle}>
          <View className={itemInputClassName}>
            {children}
          </View>
          {extra ? <View className={itemExtraClassName}>{extra}</View> : <Fragment />}
          {itemBorderType === 'body' && isInvalid ? <View className={errorClassName}>{error}</View> : <Fragment />}
        </View>
      </View>
      {helpText ? <View className={helpClassName}>{helpText}</View> : <Fragment />}
      {isInvalid && itemBorderType !== 'body' ? <View className={errorClassName}>{error}</View> : <Fragment />}
    </View>
  );
}
 * ```
 * 
*/
export function useFairysValtioFormItemAttrs<T extends MObject<T> = object>(props: FairysValtioFormItemAttrsProps<T>) {
  const [layoutAttrs] = useFairysValtioFormLayoutContext();
  const colCount = layoutAttrs.colCount || 1;
  const parent_borderedType = layoutAttrs.itemBorderType || 'bottom';
  const parent_errorLayout = layoutAttrs.errorLayout || 'right-bottom';
  const parent_formItemClassName = layoutAttrs.formItemClassName;
  const parent_formItemLabelClassName = layoutAttrs.formItemLabelClassName;
  const parent_formItemLabelStyle = layoutAttrs.formItemLabelStyle;
  const parent_formItemStyle = layoutAttrs.formItemStyle;
  const parent_formItemBodyClassName = layoutAttrs.formItemBodyClassName;
  const parent_formItemBodyStyle = layoutAttrs.formItemBodyStyle;
  const parent_labelMode = layoutAttrs.labelMode || 'between';
  const parent_itemBorderColor = layoutAttrs.itemBorderColor;
  const {
    name,
    valuePropName = 'value',
    getValueFromEvent,
    formatValue,
    onAfterUpdate,
    trigger = 'onChange',
    className,
    style,
    labelClassName,
    labelStyle,
    bodyClassName,
    bodyStyle,
    children,
    labelMode = parent_labelMode,
    errorLayout = parent_errorLayout,
    colSpan = 1,
    rowSpan = 1,
    isRequired: _isRequired,
    itemBorderType = parent_borderedType,
    attrs = {},
    showColon = false,
    itemBorderColor = parent_itemBorderColor,
  } = props;
  const [state, errorState, formInstance] = useFairysValtioFormInstanceContextState<T>();
  const rules = formInstance.rules?.[name];
  const value = state[name];
  const error = errorState[name];

  const onValueChange = (event: any) => {
    let value = event;
    const target = event?.detail || event?.target;
    if (typeof getValueFromEvent === 'function') {
      value = getValueFromEvent(event, formInstance);
    } else if (event && target && typeof target === 'object' && valuePropName in target) {
      value = target.valuePropName;
    }
    if (typeof formatValue === 'function') {
      value = formatValue(value, formInstance, event);
    }
    formInstance.updated({ [name]: value });
    if (typeof onAfterUpdate === 'function') {
      onAfterUpdate(value, formInstance, event);
    }
  };

  /**基础组件参数*/
  const baseControl = {
    ...attrs,
    name,
    [valuePropName]: value,
    [trigger]: onValueChange,
  };

  /**判断是否必填*/
  const isRequired = useMemo(() => {
    if (_isRequired) {
      return _isRequired;
    } else if (Array.isArray(rules) && rules.length) {
      return rules.some((rule) => rule.required);
    }
    return false;
  }, [rules, formInstance]);

  /**校验是否存在错误信息*/
  const isInvalid = useMemo(() => {
    if (Array.isArray(error) && error.length) {
      return true;
    }
    return false;
  }, [error]);

  /**表单项类名*/
  const item_cls = useMemo(() => {
    return clsx(
      'fairys-valtio-form-item fairystaroform__p-[4px] fairystaroform__text-[12px] fairystaroform__relative fairystaroform__flex fairystaroform__flex-col fairystaroform__box-border fairystaroform__break-all',
      {
        'fairys-valtio-form-item-invalid': isInvalid,
        'fairystaroform__border-b fairystaroform__border-b-solid fairystaroform__border-b-gray-200':
          itemBorderType === 'bottom',
        [labelMode]: labelMode,
      },
      className,
      parent_formItemClassName,
    );
  }, [className, parent_formItemClassName, labelMode, itemBorderType, isInvalid]);

  /**表单项容器类名*/
  const itemContainer_cls = useMemo(() => {
    // 默认两端显示
    return clsx(
      'fairys-valtio-form-item-container fairystaroform__flex-1 fairystaroform__h-full fairystaroform__flex fairystaroform__box-border',
      {
        'fairystaroform__flex-row fairystaroform__items-center fairystaroform__justify-between fairystaroform__gap-[8px]':
          labelMode === 'between',
        'fairystaroform__flex-col fairystaroform__gap-[4px]': labelMode === 'top',
        'fairystaroform__flex-row fairystaroform__gap-[8px]': labelMode === 'left',
      },
      labelClassName,
    );
  }, [labelClassName, labelMode]);

  /**表单项标签类名*/
  const itemLabel_cls = useMemo(() => {
    // 默认两端显示
    return clsx(
      'fairys-valtio-form-item-label fairystaroform__text-gray-800 fairystaroform__flex fairystaroform__items-center fairystaroform__relative fairystaroform__box-border',
      {
        'fairystaroform__justify-start': labelMode !== 'left',
        'fairystaroform__justify-end': labelMode === 'left',
        required: isRequired,
        'show-colon': showColon,
      },
      labelClassName,
      parent_formItemLabelClassName,
    );
  }, [labelClassName, parent_formItemLabelClassName, labelMode, isRequired, showColon]);

  /**表单项主体类名*/
  const itemBody_cls = useMemo(() => {
    // 默认两端显示
    return clsx(
      'fairys-valtio-form-item-body fairystaroform__relative fairystaroform__flex-1 fairystaroform__flex fairystaroform__box-border',
      {
        'fairystaroform__flex-row fairystaroform__justify-start': labelMode === 'left',
        'fairystaroform__flex-row fairystaroform__justify-end': labelMode === 'between' || labelMode === 'top',
        'fairystaroform__flex-row': labelMode === 'top',
        'fairystaroform__border-b fairystaroform__border-b-solid fairystaroform__border-b-gray-200 ':
          itemBorderType === 'body',
      },
      bodyClassName,
      parent_formItemBodyClassName,
    );
  }, [bodyClassName, labelMode, itemBorderType, parent_formItemBodyClassName]);

  // 表单项输入类名
  const itemInput_cls = useMemo(() => {
    return clsx(
      'fairys-valtio-form-item-body fairystaroform__flex fairystaroform__flex-row fairystaroform__flex-1 fairystaroform__box-border',
      {
        'fairystaroform__justify-end fairystaroform__text-right': labelMode === 'between',
        'fairystaroform__justify-start fairystaroform__text-left fairystaroform__items-center': labelMode !== 'between',
      },
    );
  }, [labelMode]);

  /**表单项额外内容类名*/
  const itemExtra_cls = useMemo(() => {
    return clsx(
      'fairys-valtio-form-item-body-extra fairystaroform__box-border fairystaroform__flex fairystaroform__items-center fairystaroform__justify-center',
    );
  }, []);

  /**表单项底部提示内容类名*/
  const itemHelp_cls = useMemo(() => {
    return clsx(
      'fairys-valtio-form-item-body-help fairystaroform__text-[10px] fairystaroform__w-full fairystaroform__box-border',
    );
  }, []);

  /**表单项错误提示类名*/
  const itemError_cls = useMemo(() => {
    return clsx(
      'fairys-valtio-form-item-body-error fairystaroform__px-[4px] fairystaroform__w-full fairystaroform__flex fairystaroform__flex-row fairystaroform__box-border fairystaroform__text-red fairystaroform__absolute fairystaroform__text-[10px] fairystaroform__z-10',
      {
        'fairystaroform__bottom-[-14px] fairystaroform__left-0 fairystaroform__justify-start':
          errorLayout === 'left-bottom',
        'fairystaroform__bottom-[-14px] fairystaroform__right-0 fairystaroform__justify-end':
          errorLayout === 'right-bottom',
        'fairystaroform__top-[-14px]  fairystaroform__right-0 fairystaroform__justify-end': errorLayout === 'top-right',
        'fairystaroform__top-[-14px]  fairystaroform__left-0 fairystaroform__justify-start': errorLayout === 'top-left',
      },
    );
  }, [errorLayout]);

  const styleBase = useMemo(() => {
    const css: React.CSSProperties = {};
    if (colSpan) {
      const end = colCount > colSpan ? colSpan : colCount;
      css.gridColumnEnd = `span ${end}`;
    }
    if (rowSpan) {
      css.gridRowEnd = `span ${rowSpan}`;
    }
    return css;
  }, [colSpan, rowSpan, colCount]);

  return {
    value,
    isInvalid,
    itemBorderType,
    onValueChange,
    colSpan,
    rowSpan,
    colCount,
    labelMode,
    errorLayout,
    isRequired,
    state,
    errorState,
    formInstance,
    error,
    // ================================================================================
    itemClassName: item_cls,
    itemStyle: {
      ...(itemBorderColor && itemBorderType === 'bottom' ? { borderBottomColor: itemBorderColor } : {}),
      ...(parent_formItemStyle || {}),
      ...styleBase,
      ...(style || {}),
    },
    containerClassName: itemContainer_cls,
    itemLabelClassName: itemLabel_cls,
    itemLabelStyle: { ...(parent_formItemLabelStyle || {}), ...(labelStyle || {}) },
    itemBodyClassName: itemBody_cls,
    itemBodyStyle: {
      ...(itemBorderColor && itemBorderType === 'body' ? { borderBottomColor: itemBorderColor } : {}),
      ...(parent_formItemBodyStyle || {}),
      ...(bodyStyle || {}),
    },
    itemInputClassName: itemInput_cls,
    itemExtraClassName: itemExtra_cls,
    errorClassName: itemError_cls,
    helpClassName: itemHelp_cls,
    children: React.isValidElement(children) ? React.cloneElement(children, { ...baseControl }) : children,
  } as FairysValtioFormItemAttrsReturn<T>;
}

export interface FairysValtioFormItemAttrsReturn<T extends MObject<T> = object> {
  /**表单项值*/
  value?: any;
  /**是否校验错误*/
  isInvalid?: boolean;
  /**边框类型*/
  itemBorderType?: FairysValtioFormLayoutContextOptions['itemBorderType'];
  /**值改变事件*/
  onValueChange?: (event: any) => void;
  /**当前表单项占据列数*/
  colSpan?: number;
  /**当前表单项占据行数*/
  rowSpan?: number;
  /**列数*/
  colCount?: number;
  /**标签显示模式*/
  labelMode?: FairysValtioFormLayoutContextOptions['labelMode'];
  /**错误提示位置*/
  errorLayout?: FairysValtioFormLayoutContextOptions['errorLayout'];
  /**是否必填*/
  isRequired?: boolean;
  /**表单状态*/
  state?: T;
  /**错误状态*/
  errorState?: Record<PropertyKey, string[]>;
  /**表单实例*/
  formInstance?: FairysValtioFormInstance<T>;
  /**错误信息*/
  error?: string[];
  // =========================================
  /**表单项类名*/
  itemClassName: string;
  /**表单项样式*/
  itemStyle: React.CSSProperties;
  /**容器类名*/
  containerClassName: string;
  /**标签类名*/
  itemLabelClassName: string;
  /**标签样式*/
  itemLabelStyle: React.CSSProperties;
  /**体类名*/
  itemBodyClassName: string;
  /**体样式*/
  itemBodyStyle: React.CSSProperties;
  /**输入框类名*/
  itemInputClassName: string;
  /**额外内容类名*/
  itemExtraClassName: string;
  /**错误提示类名*/
  errorClassName: string;
  /**帮助提示类名*/
  helpClassName: string;
  /**子元素*/
  children?: React.ReactNode;
}

/**
 * 没有样式的表单项属性，仅返回基础输入组件参数
 * 
 * @example
 * 
 *```tsx 
import { Fragment } from 'react'
import { useFairysValtioFormItemAttrs } from "@fairys/valtio-form"
import type { FairysValtioFormItemAttrsProps } from "@fairys/valtio-form"
export interface FormItemProps extends FairysValtioFormItemAttrsProps{}

export const FormItem = (props: FormItemProps) => {
  const { children } = useFairysValtioFormItemNoStyleAttrs(props)
  return children
}
 * ```
*/
export function useFairysValtioFormItemNoStyleAttrs<T extends MObject<T> = object>(
  props: FairysValtioFormItemAttrsProps<T>,
) {
  const {
    name,
    valuePropName = 'value',
    getValueFromEvent,
    formatValue,
    onAfterUpdate,
    trigger = 'onChange',
    children,
    attrs = {},
  } = props;
  const [state, errorState, formInstance] = useFairysValtioFormInstanceContextState<T>();
  const value = state[name];
  const error = errorState[name];

  const onValueChange = (event: any) => {
    let value = event;
    const target = event?.detail || event?.target;
    if (typeof getValueFromEvent === 'function') {
      value = getValueFromEvent(event, formInstance);
    } else if (event && target && typeof target === 'object' && valuePropName in target) {
      value = target.valuePropName;
    }
    if (typeof formatValue === 'function') {
      value = formatValue(value, formInstance, event);
    }
    formInstance.updated({ [name]: value });
    if (typeof onAfterUpdate === 'function') {
      onAfterUpdate(value, formInstance, event);
    }
  };
  /**基础组件参数*/
  const baseControl = {
    ...attrs,
    name,
    [valuePropName]: value,
    [trigger]: onValueChange,
  };
  return {
    value,
    error,
    onValueChange,
    state,
    errorState,
    formInstance,
    children: React.isValidElement(children) ? React.cloneElement(children, { ...baseControl }) : children,
  };
}
