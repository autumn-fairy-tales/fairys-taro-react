import { Fragment } from 'react';
import { View } from '@tarojs/components';
import type { FairysValtioFormLayoutAttrsProps } from '@fairys/valtio-form';
import { FairysValtioFormLayoutContext, useFairysValtioFormLayoutAttrs } from '@fairys/valtio-form';
export interface FairysTaroValtioFormLayoutProps extends FairysValtioFormLayoutAttrsProps {}

export function FairysTaroValtioFormLayout(props: FairysTaroValtioFormLayoutProps) {
  const { children, title, extra } = props;

  const {
    formLayoutInstance,
    layoutName,
    layoutStyle,
    headerName,
    headerStyle,
    headerTitleName,
    headerExtraName,
    bodyName,
    bodyStyle,
  } = useFairysValtioFormLayoutAttrs(props);

  return (
    <FairysValtioFormLayoutContext.Provider value={formLayoutInstance}>
      <View className={layoutName} style={layoutStyle}>
        <View>
          {title || extra ? (
            <View style={headerStyle} className={headerName}>
              <View className={headerTitleName}>{title}</View>
              <View className={headerExtraName}>{extra}</View>
            </View>
          ) : (
            <Fragment />
          )}
        </View>
        <View className={bodyName} style={bodyStyle}>
          {children}
        </View>
      </View>
    </FairysValtioFormLayoutContext.Provider>
  );
}
