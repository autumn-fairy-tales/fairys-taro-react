import { ViewProps, View } from '@tarojs/components';
import clsx from 'clsx';
import { useMemo } from 'react';

export interface FairysTaroMainPageProps extends ViewProps {}

export const FairysTaroMainPage = (props: FairysTaroMainPageProps) => {
  const { className: itemClassName, children, ...rest } = props;

  const cls = useMemo(
    () =>
      clsx(
        'fairys_taro-ui-main-page fairystaro__text-red-100 fairystaro__box-border fairystaro__w-full fairystaro__h-full fairystaro__flex fairystaro__flex-col fairystaro__overflow-auto',
        itemClassName,
      ),
    [itemClassName],
  );

  return (
    <View className={cls} {...rest}>
      {children}
    </View>
  );
};

/**查询*/
export const FairysTaroMainPageSearch = (props: FairysTaroMainPageProps) => {
  const { className: itemClassName, children, ...rest } = props;
  const cls = useMemo(
    () => clsx('fairys_taro-ui-main-page-search fairystaro__box-border fairystaro__w-full', itemClassName),
    [itemClassName],
  );

  return (
    <View className={cls} {...rest}>
      {children}
    </View>
  );
};

/**内容*/
export const FairysTaroMainPageBody = (props: FairysTaroMainPageProps) => {
  const { className: itemClassName, children, ...rest } = props;
  const cls = useMemo(
    () =>
      clsx(
        'fairys_taro-ui-main-page-body fairystaro__box-border fairystaro__w-full fairystaro__flex-1 fairystaro__overflow-auto',
        itemClassName,
      ),
    [itemClassName],
  );
  return (
    <View className={cls} {...rest}>
      {children}
    </View>
  );
};

/**底部*/
export const FairysTaroMainPageFooter = (props: FairysTaroMainPageProps) => {
  const { className: itemClassName, children, ...rest } = props;
  const cls = useMemo(
    () => clsx('fairys_taro-ui-main-page-footer fairystaro__box-border fairystaro__w-full', itemClassName),
    [itemClassName],
  );

  return (
    <View className={cls} {...rest}>
      {children}
    </View>
  );
};
