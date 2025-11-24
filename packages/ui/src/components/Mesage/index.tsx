import { View, ViewProps } from '@tarojs/components';
import { Fragment, useMemo } from 'react';
import { useGlobalData } from 'context/global.data.instance';
import { FairysTaroPortal } from 'components/Portal';
import clsx from 'clsx';
import type { MessageDataType } from 'context/global.data.instance';

export interface FairysTaroMessageItemProps extends Omit<ViewProps, 'style'> {
  /**
   * 提示内容
   */
  title?: React.ReactNode;
  /**
   * 提示框类型
   * @default none
   */
  type?: 'none' | 'success' | 'error' | 'warning' | 'info';
  /**
   * 自定义图标
   */
  icon?: React.ReactNode;
  /**消息项是否显示边框*/
  bordered?: boolean;
  /**图标 className*/
  iconClassName?: string;
  /**图标 style*/
  iconStyle?: React.CSSProperties;
  /**标题 className*/
  titleClassName?: string;
  /**标题 style*/
  titleStyle?: React.CSSProperties;
  /**内容 className*/
  bodyClassName?: string;
  /**内容 style*/
  bodyStyle?: React.CSSProperties;
  /**样式*/
  style?: React.CSSProperties;
  /**图标颜色*/
  iconColor?: string;
  /**边框颜色*/
  borderColor?: string;
  /**背景颜色*/
  backgroundColor?: string;
  /**文本颜色*/
  color?: string;
  /**是否显示图标*/
  showIcon?: boolean;
}

export const FairysTaroMessageItem = (props: FairysTaroMessageItemProps) => {
  const {
    title,
    children,
    type = 'info',
    className: itemClassName,
    bordered = true,
    iconClassName,
    iconStyle = {},
    titleClassName,
    titleStyle,
    bodyClassName,
    bodyStyle,
    icon,
    iconColor,
    borderColor,
    backgroundColor,
    style = {},
    color,
    showIcon = true,
    ...rest
  } = props;
  const isIcon = !!icon;
  const isIconString = typeof icon === 'string';

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
        'ant-design--close-circle-outlined': type === 'error' && !isIcon,
        'ant-design--exclamation-circle-outlined': type === 'warning' && !isIcon,
        'ant-design--check-circle-outlined': type === 'success' && !isIcon,
        'ant-design--info-circle-outlined': type === 'info' && !isIcon,
        'fairystaro__text-color-[red]': type === 'error',
        'fairystaro__text-color-[orange]': type === 'warning',
        'fairystaro__text-color-[green]': type === 'success',
        'fairystaro__text-color-[blue]': type === 'info',
      }),
    [type, iconClassName, isIcon],
  );

  const lastIconClassName = useMemo(
    () => clsx(classIconName, isIconString ? icon : ''),
    [classIconName, isIconString, icon],
  );

  const titleClassNames = useMemo(
    () => clsx('fairys_taro-ui-message-item-title fairystaro__font-bold', titleClassName),
    [titleClassName],
  );

  // 图标颜色
  const _iconStyle = { ...iconStyle };
  if (iconColor) {
    _iconStyle.color = iconColor;
  }

  const _style = { ...style };
  if (borderColor) {
    _style.borderColor = borderColor;
  }

  if (backgroundColor) {
    _style.backgroundColor = backgroundColor;
  }
  if (color) {
    _style.color = color;
  }

  return (
    <View className={className} {...rest} style={_style}>
      {showIcon ? (
        <View className="fairystaro__flex fairystaro__flex-row fairystaro__justify-center fairystaro__p-t-[0.15rem]">
          {/* 图标 */}
          {!isIcon ? <View className={classIconName} style={_iconStyle} /> : <Fragment />}
          {isIcon && !isIconString ? (
            <View className={classIconName} style={_iconStyle}>
              {icon}
            </View>
          ) : (
            <Fragment />
          )}
          {isIcon && isIconString ? <View className={lastIconClassName} style={_iconStyle} /> : <Fragment />}
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
          const { content, visible, __id, ...rest } = item as MessageDataType;
          if (visible)
            return (
              <FairysTaroMessageItem {...rest} key={__id}>
                {content}
              </FairysTaroMessageItem>
            );
          return <Fragment key={`${__id}_hidden`} />;
        })}
      </FairysTaroMessage>
    </FairysTaroPortal>
  );
};
