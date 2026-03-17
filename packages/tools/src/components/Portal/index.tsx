import { createPortal } from 'react-dom';
import { RootPortal } from '@tarojs/components';

export interface FairysTaroPortalProps {
  children: React.ReactNode;
  /**
   * 自定义容器(h5环境)
   */
  domContainer?: HTMLElement;
}

export const FairysTaroPortal = (props: FairysTaroPortalProps) => {
  const { children, domContainer } = props;
  if (process.env.TARO_ENV === 'weapp') {
    return <RootPortal>{children}</RootPortal>;
  }
  return createPortal(children, domContainer || document.body);
};
