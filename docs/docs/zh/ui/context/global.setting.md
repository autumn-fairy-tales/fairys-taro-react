# 全局配置参数实例

**引入**

```ts
import { globalSettingDataInstance , useGlobalSettingData} from '@fairys/taro-tools-react';
```

## 参数

```ts
import { ProxyInstanceObjectBase } from '@fairys/taro-tools-react';
export interface GlobalSettingDataInstanceState {
    /**
     * 请求成功返回code
     * @default 200
     */
    requestSuccessCode?: number;
    /**数据默认值不使用*/
    __defaultValue?: string;
}
export declare class GlobalSettingDataInstance extends ProxyInstanceObjectBase<GlobalSettingDataInstanceState> {
    store: GlobalSettingDataInstanceState;
    /**
     * 扩展全局设置数据状态
     */
    extendStore: (state: Partial<GlobalSettingDataInstanceState>) => void;
}
/**
 * 全局设置数据实例
 */
export declare const globalSettingDataInstance: GlobalSettingDataInstance;
/**
 * 全局设置数据状态管理
 */
export declare const useGlobalSettingData: () => [GlobalSettingDataInstanceState, GlobalSettingDataInstance, string | undefined];

```

## 使用

```ts

```
