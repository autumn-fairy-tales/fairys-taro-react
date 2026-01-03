import { Close2 } from '@nutui/icons-react-taro';
import { View, Text, ITouchEvent } from '@tarojs/components';
import clsx from 'clsx';
import { Fragment, useMemo } from 'react';

export interface SVG_IconProps {
  className?: string;
  style?: React.CSSProperties;
  viewBox?: string;
  name?: string;
  color?: string;
  width?: string | number;
  height?: string | number;
  size?: string | number;
  svg64?: string;
  svgSrc?: string;
  children?: React.ReactNode;
  fallback?: boolean;
  isValue?: boolean;
  warpClassName?: string;
  warpStyle?: React.CSSProperties;
  onTextClick?: (event: ITouchEvent) => void;
  onClearClick?: (event: React.MouseEvent) => void;
}

export const CustomTextClear = (props: SVG_IconProps) => {
  const { isValue = true, children, warpClassName, warpStyle, onTextClick, onClearClick, ...rest } = props;

  const clsx_text = useMemo(() => {
    return clsx('fairys-taro-text', {
      'fairys-taro-text-placeholder fairystaroform__text-gray-600 fairystaroform__font-normal': !isValue,
      'fairys-taro-text-value fairystaroform__text-black': isValue,
    });
  }, [isValue]);

  return (
    <View
      className={`fairys-taro-clear fairystaroform__flex fairystaroform__items-center fairystaroform__gap-1 ${
        warpClassName || ''
      }`}
      style={warpStyle}
    >
      <Text onClick={onTextClick} className={clsx_text}>
        {children}
      </Text>
      {isValue ? <Close2 color="#c2c4cc" onClick={onClearClick} {...rest} /> : <Fragment />}
    </View>
  );
};
