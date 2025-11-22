import clsx from 'clsx';
import { View, Text } from '@tarojs/components';
import { ViewProps } from '@tarojs/components';
import { forwardRef, Fragment, ReactNode, Ref, useMemo } from 'react';
import { FairysTaroPortal } from '../Portal';

export interface FairysTaroLoadingProps extends ViewProps {
  /**加载标题*/
  title?: ReactNode;
  /**加载提示*/
  tips?: ReactNode;
  /**是否显示加载动画*/
  loading?: boolean;
  /**是否显示在 Portal 中*/
  isPortal?: boolean;
}

export const FairysTaroLoadingMain = forwardRef(
  (props: Omit<FairysTaroLoadingProps, 'loading' | 'isPortal'>, ref: Ref<ViewProps>) => {
    const { title = '', tips = '载入中', className, ...rest } = props;
    const classNames = useMemo(() => clsx('fairys_taro_loading fairystaro__bg-white/75', className), [className]);
    return (
      <Fragment>
        <View {...rest} ref={ref} className={classNames}>
          <View className="fairys_taro_loading-main">
            <View className="square"></View>
            <View className="square"></View>
            <View className="square"></View>
            <View className="square"></View>
          </View>
          <View className="name">{title}</View>
          <View className="tips">
            <Text>{tips}</Text>
            <Text className="loading-dots" />
          </View>
        </View>
      </Fragment>
    );
  },
);

export const FairysTaroLoading = forwardRef((props: FairysTaroLoadingProps, ref: Ref<ViewProps>) => {
  const { loading = false, isPortal = true, ...rest } = props;
  return loading ? (
    isPortal ? (
      <FairysTaroPortal>
        <FairysTaroLoadingMain {...rest} ref={ref} />
      </FairysTaroPortal>
    ) : (
      <FairysTaroLoadingMain {...rest} ref={ref} />
    )
  ) : (
    <Fragment />
  );
});
