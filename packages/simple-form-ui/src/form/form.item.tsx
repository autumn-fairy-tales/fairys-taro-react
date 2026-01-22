/**表单项*/

import { MObject } from 'interface';
import { View } from '@tarojs/components';
import type { ViewProps } from '@tarojs/components';
import { Fragment } from 'react';
import type { FairysValtioFormItemAttrsProps } from '@fairys/valtio-form-basic';
import {
  useFairysValtioFormItemAttrs,
  useFairysValtioFormInstanceContextHideState,
  useFairysValtioFormItemNoStyleAttrs,
  FairysValtioFormParentAttrsContext,
} from '@fairys/valtio-form-basic';

export interface FairysTaroValtioFormItemProps<T extends MObject<T> = object>
  extends Omit<ViewProps, 'style'>,
    FairysValtioFormItemAttrsProps {
  /**是否使用控制隐藏的表单项*/
  isHide?: boolean;
  /**是否使用无样式表单项*/
  noStyle?: boolean;
}

/**普通表单项*/
export function FairysTaroValtioFormItem<T extends MObject<T> = object>(
  props: Omit<FairysTaroValtioFormItemProps<T>, 'isHide' | 'noStyle'>,
) {
  const { label, extra, helpText } = props;
  const {
    itemClassName,
    itemStyle,
    containerClassName,
    itemLabelClassName,
    itemLabelStyle,
    itemBodyClassName,
    itemBodyStyle,
    itemInputClassName,
    itemExtraClassName,
    errorClassName,
    helpClassName,
    isInvalid,
    itemBorderType,
    children,
    error,
    formAttrsNameInstance,
  } = useFairysValtioFormItemAttrs(props);

  return (
    <FairysValtioFormParentAttrsContext.Provider value={formAttrsNameInstance}>
      <View className={itemClassName} style={itemStyle}>
        <View className={containerClassName}>
          {label ? (
            <View className={itemLabelClassName} style={itemLabelStyle}>
              {label}
            </View>
          ) : (
            <Fragment />
          )}
          <View className={itemBodyClassName} style={itemBodyStyle}>
            <View className={itemInputClassName}>{children}</View>
            {extra ? <View className={itemExtraClassName}>{extra}</View> : <Fragment />}
            {itemBorderType === 'body' && isInvalid ? <View className={errorClassName}>{error}</View> : <Fragment />}
          </View>
        </View>
        {helpText ? <View className={helpClassName}>{helpText}</View> : <Fragment />}
        {isInvalid && itemBorderType !== 'body' ? <View className={errorClassName}>{error}</View> : <Fragment />}
      </View>
    </FairysValtioFormParentAttrsContext.Provider>
  );
}
/**控制隐藏的表单项*/
export function FairysTaroValtioFormHideItem<T extends MObject<T> = object>(
  props: Omit<FairysTaroValtioFormItemProps<T>, 'isHide' | 'noStyle'>,
) {
  const [state] = useFairysValtioFormInstanceContextHideState();
  const isHide = state[props.name];
  if (isHide) {
    return <Fragment />;
  }
  return <FairysTaroValtioFormItem<T> {...props} />;
}

/**无样式表单项*/
export function FairysTaroValtioFormItemNoStyle<T extends MObject<T> = object>(
  props: Omit<FairysTaroValtioFormItemProps<T>, 'isHide' | 'noStyle'>,
) {
  const { children, formAttrsNameInstance } = useFairysValtioFormItemNoStyleAttrs(props);
  return (
    <FairysValtioFormParentAttrsContext.Provider value={formAttrsNameInstance}>
      {children}
    </FairysValtioFormParentAttrsContext.Provider>
  );
}

/**表单项基础组件(根据isHide和noStyle判断是否使用控制隐藏的表单项和无样式表单项)*/
export function FairysTaroValtioFormItemBase<T extends MObject<T> = object>(props: FairysTaroValtioFormItemProps<T>) {
  const { isHide, noStyle, ...rest } = props;
  if (isHide) {
    return <FairysTaroValtioFormHideItem<T> {...rest} />;
  }
  if (noStyle) {
    return <FairysTaroValtioFormItemNoStyle<T> {...rest} />;
  }
  return <FairysTaroValtioFormItem<T> {...rest} />;
}
