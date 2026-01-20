/**表单项*/

import { MObject } from 'interface';
import { View, Text } from '@tarojs/components';
import type { ViewProps } from '@tarojs/components';
import React, { Fragment, useMemo } from 'react';
import clsx from 'clsx';
import {
  useFairysTaroValtioFormInstanceContextState,
  FairysTaroValtioFormInstance,
  useFairysTaroValtioFormInstanceContextHideState,
} from './instance';
import { useFairysTaroValtioFormLayoutContext } from './layout';

export interface FairysTaroValtioFormItemProps<T extends MObject<T> = object> extends ViewProps {
  /**表单项名称*/
  name: string;
  /**表单项标签*/
  label?: string;
  /**是否使用样式*/
  noStyle?: boolean;
  /**传递组件字段*/
  valuePropName?: string;
  /**自定义获取值*/
  getValueFromEvent?: (event: any, form: FairysTaroValtioFormInstance<T>) => any;
  /**值格式化*/
  formatValue?: (value: any, form: FairysTaroValtioFormInstance<T>, event: any) => any;
  /**触发数据更新之后触发（用于数据联动之类的）*/
  onAfterUpdate?: (value: any, form: FairysTaroValtioFormInstance<T>, event: any) => void;
  /**事件名称*/
  trigger?: string;
  style?: React.CSSProperties;
  labelClassName?: string;
  labelStyle?: React.CSSProperties;
  bodyClassName?: string;
  bodyStyle?: React.CSSProperties;
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
  bottomBordered?: boolean;
  /**输入框属性*/
  attrs?: any;
}

export function FairysTaroValtioFormItem<T extends MObject<T> = object>(props: FairysTaroValtioFormItemProps<T>) {
  const [layoutAttrs] = useFairysTaroValtioFormLayoutContext();
  const colCount = layoutAttrs.colCount || 1;
  const parent_bottomBordered = layoutAttrs.bottomBordered || true;
  const parent_errorLayout = layoutAttrs.errorLayout || 'right-bottom';
  const parent_formItemClassName = layoutAttrs.formItemClassName;
  const parent_formItemLabelClassName = layoutAttrs.formItemLabelClassName;
  const parent_formItemLabelStyle = layoutAttrs.formItemLabelStyle;
  const parent_formItemStyle = layoutAttrs.formItemStyle;
  const parent_labelMode = layoutAttrs.labelMode || 'between';
  const {
    name,
    label,
    noStyle,
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
    extra,
    helpText,
    colSpan = 1,
    rowSpan = 1,
    isRequired: _isRequired,
    bottomBordered = parent_bottomBordered,
    attrs = {},
    showColon = false,
    ...rest
  } = props;
  const [state, errorState, formInstance] = useFairysTaroValtioFormInstanceContextState<T>();
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
      'fairys-taro-valtio-form-item fairystaroform__p-[4px] fairystaroform__text-[12px] fairystaroform__relative fairystaroform__flex fairystaroform__flex-col fairystaroform__box-border fairystaroform__break-all',
      {
        'fairystaroform__border-b fairystaroform__border-b-solid fairystaroform__border-b-gray-100 ': bottomBordered,
        [labelMode]: labelMode,
      },
      className,
      parent_formItemClassName,
    );
  }, [className, parent_formItemClassName, labelMode, bottomBordered]);

  /**表单项容器类名*/
  const itemContainer_cls = useMemo(() => {
    // 默认两端显示
    return clsx(
      'fairys-taro-valtio-form-item-container fairystaroform__flex-1 fairystaroform__h-full fairystaroform__flex fairystaroform__box-border',
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
      'fairys-taro-valtio-form-item-label fairystaroform__text-gray-800 fairystaroform__flex fairystaroform__items-center fairystaroform__relative fairystaroform__box-border',
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
      'fairys-taro-valtio-form-item-body fairystaroform__flex-1 fairystaroform__flex fairystaroform__box-border',
      {
        'fairystaroform__flex-row fairystaroform__justify-start': labelMode === 'left',
        'fairystaroform__flex-row fairystaroform__justify-end': labelMode === 'between' || labelMode === 'top',
        'fairystaroform__flex-row': labelMode === 'top',
      },
      bodyClassName,
    );
  }, [bodyClassName, labelMode]);

  // 表单项输入类名
  const itemInput_cls = useMemo(() => {
    return clsx(
      'fairys-taro-valtio-form-item-body fairystaroform__flex fairystaroform__flex-row fairystaroform__flex-1 fairystaroform__box-border',
      {
        'fairystaroform__justify-end fairystaroform__text-right': labelMode === 'between',
        'fairystaroform__justify-start fairystaroform__text-left fairystaroform__items-center': labelMode !== 'between',
      },
    );
  }, [labelMode]);

  /**表单项额外内容类名*/
  const itemExtra_cls = useMemo(() => {
    return clsx(
      'fairys-taro-valtio-form-item-body-extra fairystaroform__box-border fairystaroform__flex fairystaroform__items-center fairystaroform__justify-center',
    );
  }, []);

  /**表单项底部提示内容类名*/
  const itemHelp_cls = useMemo(() => {
    return clsx(
      'fairys-taro-valtio-form-item-body-help fairystaroform__text-[10px] fairystaroform__w-full fairystaroform__box-border',
    );
  }, []);

  /**表单项错误提示类名*/
  const itemError_cls = useMemo(() => {
    return clsx(
      'fairys-taro-valtio-form-item-body-error fairystaroform__px-[4px] fairystaroform__w-full fairystaroform__flex fairystaroform__flex-row fairystaroform__box-border fairystaroform__text-red fairystaroform__absolute fairystaroform__text-[10px] fairystaroform__z-10',
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

  return (
    <View {...rest} className={item_cls} style={{ ...(parent_formItemStyle || {}), ...styleBase, ...(style || {}) }}>
      <View className={itemContainer_cls}>
        <View className={itemLabel_cls} style={{ ...(parent_formItemLabelStyle || {}), ...(labelStyle || {}) }}>
          {label}
        </View>
        <View className={itemBody_cls} style={bodyStyle}>
          <View className={itemInput_cls}>
            {React.isValidElement(children) ? React.cloneElement(children, { ...baseControl }) : children}
          </View>
          {extra ? <View className={itemExtra_cls}>{extra}</View> : <Fragment />}
        </View>
      </View>
      {helpText ? <View className={itemHelp_cls}>{helpText}</View> : <Fragment />}
      {isInvalid ? <View className={itemError_cls}>{error}</View> : <Fragment />}
    </View>
  );
}

export function FairysTaroValtioFormHideItem<T extends MObject<T> = object>(props: FairysTaroValtioFormItemProps<T>) {
  const [state] = useFairysTaroValtioFormInstanceContextHideState();
  const isHide = state[props.name];
  if (isHide) {
    return <Fragment />;
  }
  return <FairysTaroValtioFormItem<T> {...props} />;
}
