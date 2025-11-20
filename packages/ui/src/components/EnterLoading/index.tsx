import clsx from 'clsx';
import { View, Text } from '@tarojs/components';
import { ViewProps } from '@tarojs/components';
import { forwardRef, Fragment, Ref, useMemo } from 'react';

export interface FairysTaroEnterLoadingProps extends ViewProps {
  title?: string;
  tips?: string;
  loading?: boolean;
  className?: string;
}

export const FairysTaroEnterLoading = forwardRef((props: FairysTaroEnterLoadingProps, ref: Ref<HTMLDivElement>) => {
  const { title = '', tips = '载入中', className, loading = false, ...rest } = props;
  const classNames = useMemo(() => clsx('fairys_taro_enter_loading fairystaro--bg-white/75', className), [className]);
  return loading ? (
    <View {...rest} ref={ref} className={classNames}>
      <View className="fairys_taro_enter_loading-main">
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
  ) : (
    <Fragment />
  );
});

export default FairysTaroEnterLoading;
