/**表单项*/

import { MObject } from 'interface';
import { View } from '@tarojs/components';
import type { ViewProps } from '@tarojs/components';
import { Fragment } from 'react';
import type { FairysValtioFormItemAttrsProps } from '@fairys/valtio-form-basic';
import { useFairysValtioFormItemAttrs, useFairysValtioFormInstanceContextHideState } from '@fairys/valtio-form-basic';

export interface FairysTaroValtioFormItemProps<T extends MObject<T> = object>
  extends Omit<ViewProps, 'style'>,
    FairysValtioFormItemAttrsProps {}

export function FairysTaroValtioFormItem<T extends MObject<T> = object>(props: FairysTaroValtioFormItemProps<T>) {
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
    borderedType,
    children,
    error,
  } = useFairysValtioFormItemAttrs(props);

  return (
    <View className={itemClassName} style={itemStyle}>
      <View className={containerClassName}>
        <View className={itemLabelClassName} style={itemLabelStyle}>
          {label}
        </View>
        <View className={itemBodyClassName} style={itemBodyStyle}>
          <View className={itemInputClassName}>{children}</View>
          {extra ? <View className={itemExtraClassName}>{extra}</View> : <Fragment />}
          {borderedType === 'body' && isInvalid ? <View className={errorClassName}>{error}</View> : <Fragment />}
        </View>
      </View>
      {helpText ? <View className={helpClassName}>{helpText}</View> : <Fragment />}
      {isInvalid && borderedType !== 'body' ? <View className={errorClassName}>{error}</View> : <Fragment />}
    </View>
  );
}

export function FairysTaroValtioFormHideItem<T extends MObject<T> = object>(props: FairysTaroValtioFormItemProps<T>) {
  const [state] = useFairysValtioFormInstanceContextHideState();
  const isHide = state[props.name];
  if (isHide) {
    return <Fragment />;
  }
  return <FairysTaroValtioFormItem<T> {...props} />;
}
