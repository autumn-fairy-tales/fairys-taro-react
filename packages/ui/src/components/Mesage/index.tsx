import { View, ViewProps } from '@tarojs/components';
import { MessageDataType } from 'context/global.data.instance';
import { Fragment, useMemo } from 'react';
import { useGlobalData } from 'context/global.data.instance';
import { FairysTaroPortal } from 'components/Portal';
import clsx from 'clsx';

export interface FairysTaroMessageItemProps extends Omit<MessageDataType, 'visible' | 'content' | '__id'>, ViewProps {
  /**消息项是否显示边框*/
  bordered?: boolean;
  /**图标 className*/
  iconClassName?: string;
  /**图标 style*/
  iconStyle?: ViewProps['style'];
  /**标题 className*/
  titleClassName?: string;
  /**标题 style*/
  titleStyle?: ViewProps['style'];
  /**内容 className*/
  bodyClassName?: string;
  /**内容 style*/
  bodyStyle?: ViewProps['style'];
}

export const FairysTaroMessageItem = (props: FairysTaroMessageItemProps) => {
  const {
    title,
    children,
    type = 'info',
    className: itemClassName,
    bordered = true,
    iconClassName,
    iconStyle,
    titleClassName,
    titleStyle,
    bodyClassName,
    bodyStyle,
    ...rest
  } = props;
  const className = useMemo(
    () =>
      clsx(
        'fairys_taro-ui-message-item',
        `fairys_taro-ui-message-icon-${type}`,
        'fairystaro__box-border fairystaro__flex fairystaro__flex-row fairystaro__gap-[0.4rem] fairystaro__p-y-[0.4rem] fairystaro__p-x-[0.4rem]  fairystaro__rounded-md fairystaro__text-[0.8rem]',
        {
          'fairystaro__border fairystaro__border-solid': bordered,
        },
        itemClassName,
      ),
    [type, itemClassName, bordered],
  );

  const classIconName = useMemo(
    () =>
      clsx('fairys_taro-ui-message-icon fairystaro__box-border ', iconClassName, {
        'ant-design--close-circle-outlined': type === 'error',
        'ant-design--exclamation-circle-outlined': type === 'warning',
        'ant-design--check-circle-outlined': type === 'success',
        'ant-design--info-circle-outlined': type === 'info',
        'fairystaro__text-color-[red]': type === 'error',
        'fairystaro__text-color-[orange]': type === 'warning',
        'fairystaro__text-color-[green]': type === 'success',
        'fairystaro__text-color-[blue]': type === 'info',
      }),
    [type, iconClassName],
  );

  const titleClassNames = useMemo(
    () => clsx('fairys_taro-ui-message-item-title fairystaro__font-bold', titleClassName),
    [titleClassName],
  );

  return (
    <View className={className} {...rest}>
      {type ? (
        <View className="fairystaro__flex fairystaro__flex-row fairystaro__justify-center">
          {/* 图标 */}
          <View className={classIconName} style={iconStyle} />
        </View>
      ) : (
        <Fragment />
      )}
      <View>
        {/* 内容 */}
        {title ? (
          <View className={titleClassNames} style={titleStyle}>
            {title}
          </View>
        ) : (
          <Fragment />
        )}
        {children ? (
          <View className={clsx('fairys_taro-ui-message-item-body', bodyClassName)} style={bodyStyle}>
            {children}
          </View>
        ) : (
          <Fragment />
        )}
      </View>
    </View>
  );
};

export interface FairysTaroMessageProps extends ViewProps {}

export const FairysTaroMessage = (props: FairysTaroMessageProps) => {
  const { className: messageClassName, ...rest } = props;
  const classNames = useMemo(
    () =>
      clsx(
        'fairys_taro-ui-message fairystaro__box-border fairystaro__p-2 fairystaro__flex fairystaro__flex-col fairystaro__items-center fairystaro__gap-2 fairystaro__max-w-full fairystaro__max-h-full',
        messageClassName,
      ),
    [messageClassName],
  );
  return <View {...rest} className={classNames} />;
};

/**消息组件(用于全局消息提示)*/
export const FairysTaroPortalMessage = (props: FairysTaroMessageProps) => {
  const { className: messageClassName, ...rest } = props;

  const [state] = useGlobalData();
  const messageData = state.messageData;
  const classNames = useMemo(
    () =>
      clsx(
        'fairys_taro-ui-portal-message fairystaro__pointer-events-none fairystaro__position-fixed  fairystaro__top-0  fairystaro__right-0  fairystaro__bottom-0  fairystaro__left-0',
        messageClassName,
      ),
    [messageClassName],
  );

  return (
    <FairysTaroPortal>
      <FairysTaroMessage {...rest} className={classNames}>
        {messageData.map((item) => {
          const { content, visible, ...rest } = item as any;
          if (item.visible)
            return (
              <FairysTaroMessageItem {...rest} key={item.__id}>
                {content}
              </FairysTaroMessageItem>
            );
          return <Fragment key={`${item.__id}_hidden`} />;
        })}
      </FairysTaroMessage>
    </FairysTaroPortal>
  );
};
