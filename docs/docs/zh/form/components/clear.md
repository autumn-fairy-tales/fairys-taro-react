# 清除按钮

**引入**

```ts
import { FairysTaroTextClearBase } from '@fairys/taro-tools-simple-form';
```

## 组件参数

```ts
import { ITouchEvent } from '@tarojs/components';

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
```

## 使用

```ts
import { FairysTaroTextClearBase } from '@fairys/taro-tools-simple-form';
import { View, Text , Button } from '@tarojs/components';

const Page = ()=>{
  return <FairysTaroTextClearBase
        warpClassName="fairys-taro-cascader-text"
        isValue={true}
        onTextClick={() => console.log('点击了文本')}
        onClearClick={() => console.log('点击了清除按钮')}
      >
      内容
  </FairysTaroTextClearBase>
}

export default Page

```