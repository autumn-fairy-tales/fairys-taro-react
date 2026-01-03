# 页面布局组件

**引入**

```ts
import { FairysTaroMainPage, FairysTaroMainPageSearch, FairysTaroMainPageBody, FairysTaroMainPageFooter } from '@fairys/taro-tools-react';
```

## 组件参数

```ts
import type { ViewProps } from '@tarojs/components';
export interface FairysTaroMainPageProps extends ViewProps {}

```

## 使用

```tsx
import { FairysTaroMainPage, FairysTaroMainPageSearch, FairysTaroMainPageBody, FairysTaroMainPageFooter } from '@fairys/taro-tools-react';
import { Text  } from '@tarojs/components';

const Page = ()=>{
  return (
    <FairysTaroMainPage>
      <FairysTaroMainPageSearch>
        <Text>搜索</Text>
      </FairysTaroMainPageSearch>
      <FairysTaroMainPageBody>
        <Text>内容</Text>
      </FairysTaroMainPageBody>
      <FairysTaroMainPageFooter>
        <Text>页脚</Text>
      </FairysTaroMainPageFooter>
    </FairysTaroMainPage>
  )
}

export default Page
```