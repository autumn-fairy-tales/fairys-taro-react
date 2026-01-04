# valtio 工具

**引入**

```ts
import { useValtioState, useValtioInstaceState } from '@fairys/taro-tools-react';
```

## 参数

```ts
/**
 * 单个proxy对象数据基础实例封装
 */
export declare class ProxyInstanceObjectBase<T extends Object = any> {
    /**proxy 可状态更新字段 */
    store: T;
    /**初始化存储值*/
    _ctor: (inital?: Partial<T>, fields?: string[]) => this;
    /**更新store数据 循环对象进行存储，当值是对象的时候存储为ref*/
    _setValues: <K = T>(values: Partial<K>, fields?: string[]) => this;
    /**删除字段值*/
    _deleteValue: (names: string | string[]) => this;
    /**创建 ref 对象 (ref对象不做监听更新)*/
    _createRef: <K extends Object = any>(inital?: K) => K;
}
/**创建简单的状态管理*/
export declare const useValtioState: <T extends object>(inital?: T) =>  [T, ProxyInstanceObjectBase<T>, any];
export declare const useValtioInstaceState: <T extends object = any, K extends ProxyInstanceObjectBase<T> = ProxyInstanceObjectBase<T>, M extends {
    new (...args: any[]): K;
} = {
    new (...args: any[]): K;
}>(Instance: M) =>  [T, K, any];

```

## 使用

```tsx

import { ProxyInstanceObjectBase , useValtioInstaceState } from '@fairys/taro-tools-react';
import { View, Button } from '@tarojs/components';
import { proxy } from 'valtio';

class ProxyInstanceObject extends ProxyInstanceObjectBase {
   /**proxy 可状态更新字段 */
  store = proxy({ value:0 });

}

const Page = ()=> {
  const [instanceState, instanceProxyInstance] = useValtioInstaceState(ProxyInstanceObject);

  const handleClick = async ()=>{
    instanceProxyInstance.store.value++;
    instanceProxyInstance._setValues({ value: instanceProxyInstance.store.value++ });
  }

  return (
    <View>
      <Button onClick={handleClick}>点击</Button>
    </View>
  )
}
export default Page
```


## 使用

```tsx

import { useValtioState } from '@fairys/taro-tools-react';
import { View, Button } from '@tarojs/components';

const Page = ()=> {
  const [state, valtioProxyInstance] = useValtioState({ value: 0 })

  const handleClick = async ()=>{
    valtioProxyInstance.store.value++;
    valtioProxyInstance._setValues({ value: valtioProxyInstance.store.value++ });
  }

  return (
    <View>
      <Button onClick={handleClick}>点击</Button>
    </View>
  )
}
export default Page
```

