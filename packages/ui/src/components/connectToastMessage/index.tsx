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

/**
 * 高阶组件，用于为 React 组件连接 Toast 和 Message 功能
 *
 * 根据不同的运行环境（H5/微信小程序）和组件层级（根页面/子页面），
 * 决定是否渲染 Toast 和 Message 组件，以避免功能冲突和界面遮挡
 *
 * @param Component - 需要被包装的 React 组件
 * @param options - 配置选项
 * @param options.isRoot - 是否为根页面组件，默认为 false
 * @returns 返回一个经过优化的 React 组件，根据环境条件选择性渲染 Toast 和 Message
 */
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
