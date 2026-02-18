import { FairysTaroPortalMessage } from 'components/Mesage';
import { FairysTaroToast } from 'components/Toast';
import React, { Fragment, memo } from 'react';

export interface ConnectToastMessageOptions {
  /**
   * 是否是根页面,
   * 在 h5 中，只有入口文件才需要展示 message 组件 和 toast 组件
   * 在微信中，所有页面都需要展示 message 组件 和 toast 组件, 入口文件不展示
   */
  isRoot?: boolean;
}

export const connectToastMessage = (Component: React.FC, options: ConnectToastMessageOptions = {}) => {
  const { isRoot = false } = options;
  return memo((props: any) => {
    // 在 h5 中，只有根页面才需要展示 message 组件 和 toast 组件，其他页面只是渲染组件就好

    // 微信中，根目录不显示 message 组件 和 toast 组件，因为会遮挡页面内容
    if (process.env.TARO_ENV === 'weapp') {
      return (
        <Fragment>
          <Component {...props} />
          {/* toast */}
          {!isRoot ? <FairysTaroToast /> : <Fragment />}
          {/* message */}
          {!isRoot ? <FairysTaroPortalMessage /> : <Fragment />}
        </Fragment>
      );
    }
    return (
      <Fragment>
        <Component {...props} />
        {/* toast */}
        {isRoot ? <FairysTaroToast /> : <Fragment />}
        {/* message */}
        {isRoot ? <FairysTaroPortalMessage /> : <Fragment />}
      </Fragment>
    );
  });
};
