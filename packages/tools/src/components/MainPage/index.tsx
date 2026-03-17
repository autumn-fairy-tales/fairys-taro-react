import { ViewProps, View, ScrollView, ScrollViewProps } from '@tarojs/components';
import clsx from 'clsx';
import { Fragment, useMemo } from 'react';

export interface FairysTaroMainPageProps extends ViewProps {}

/**
 * 主页面（如果外部使用scroll-view组件，需要设置高度，否则内容会出现滚动）
 */
export const FairysTaroMainPage = (props: FairysTaroMainPageProps) => {
  const { className: itemClassName, children, ...rest } = props;

  const cls = useMemo(
    () =>
      clsx(
        'fairys_taro-ui-main-page fairystaro__box-border fairystaro__w-full fairystaro__h-full fairystaro__flex fairystaro__flex-col fairystaro__overflow-auto',
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

export interface FairysTaroMainPageScrollViewProps extends ScrollViewProps {
  /**下拉刷新状态*/
  refresherStatus?: boolean;
  /**是否还有更多数据*/
  hasMore?: boolean;
  /**加载更多文本*/
  loadMoreText?: React.ReactNode;
}

/**
 * 主页面滚动视图
 */
export const FairysTaroMainPageScrollView = (props: FairysTaroMainPageScrollViewProps) => {
  const {
    className: itemClassName,
    children,
    refresherStatus,
    hasMore = true,
    loadMoreText,
    onScrollToLower,
    ...rest
  } = props;

  const cls = useMemo(
    () =>
      clsx(
        'fairys_taro-ui-main-page-scroll-view fairystaro__box-border fairystaro__w-screen fairystaro__h-screen',
        itemClassName,
      ),
    [itemClassName],
  );

  return (
    <ScrollView
      scrollY
      refresherEnabled
      enhanced
      usingSticky
      refresherTriggered={refresherStatus}
      className={cls}
      {...rest}
      onScrollToLower={(...args) => {
        if (hasMore) {
          onScrollToLower?.(...args);
        }
      }}
    >
      {children}
      {loadMoreText ? (
        <View className="fairys_taro-ui-main-page-scroll-view-load-more">{loadMoreText}</View>
      ) : (
        <Fragment />
      )}
    </ScrollView>
  );
};
