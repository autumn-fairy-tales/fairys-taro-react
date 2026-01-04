# 页面详情数据状态实例

:::tip

用于管理详情页面数据状态, 包含详情查询, 详情保存, 详情查询是否成功等状态

:::

**引入**

```ts
import { usePageInfoData } from '@fairys/taro-tools-react';
```

## 参数

```ts
import { ProxyInstanceObjectBase } from '../utils/valtio/instance';
export interface PageDataInstanceState extends Object {
    /**loading存储*/
    loading?: Record<string, boolean>;
    /**当前页*/
    page?: number;
    /**分页数*/
    pageSize?: number;
    /**总数*/
    total?: number;
    /**是否最后一页*/
    hasLastPage?: boolean;
    /**查询条件*/
    search?: Object;
    /**表格数据*/
    dataList?: any[];
    /**选择行数据*/
    selectedRows?: any[];
    selectedRowKeys?: any[];
    /**数据默认值不使用*/
    __defaultValue?: string;
    [s: string]: any;
}
export declare class PageDataInstance<T extends PageDataInstanceState = PageDataInstanceState> extends ProxyInstanceObjectBase<T> {
    /**是否滚动加载分页*/
    is_scroll_page: boolean;
    /**默认值*/
    defaultInital: T;
    requestConfig?: {
        /**请求之前处理参数*/
        onBefore?: (payload: any, store: T) => Partial<T>;
        /**请求接口*/
        getList?: (payload: any) => Promise<{
            code?: number;
            data?: any;
            message?: string;
        }>;
        /**请求之后处理返回值进行存储*/
        onAfter?: (data: Record<string, any>) => Partial<T>;
        /** code!==1 时 触发*/
        onError?: (data: Record<string, any>) => void;
    };
    constructor(options?: PageDataOptions<T>);
    store: T;
    /**初始化状态值*/
    main_page_store: (initalValues?: Partial<T>, file?: string[]) => this;
    /**更新页面级的 pageLoading */
    updatedLoading: (loading?: boolean) => void;
    /**内置——查询列表*/
    main_getList: () => Promise<void>;
    /**内置——翻页*/
    main_onPageChange: (page: number) => void;
    /**内置——翻页切换*/
    main_onShowSizeChange: (_: number, pageSize: number) => void;
    /**内置——查询方法*/
    main_onSearch: () => void;
    /**加载更多*/
    main_onLoadMore: () => void;
}
export interface PageDataOptions<T extends PageDataInstanceState = PageDataInstanceState> {
    /**请求配置*/
    requestConfig?: PageDataInstance<T>['requestConfig'];
    /**初始值*/
    initialValues?: Partial<T>;
    /**是否滚动加载更多*/
    is_scroll_page?: boolean;
}
/**
 * 页面级数据状态管理
 */
export declare const usePageData: <T extends PageDataInstanceState = PageDataInstanceState>(options?: PageDataOptions<T>) => [T, PageDataInstance<T>, string | undefined];

```


## 使用

```tsx
import { usePageInfoData ，connectToastMessage} from '@fairys/taro-tools-react';
import { View, Button } from '@tarojs/components';

const Page = ()=> {
    const [state, instance] = usePageInfoData({
        /**详情查询请求配置*/
        requestInfoConfig:{
            getInfo:async (params) => {
                console.log(params);
                return {
                    code: 200,
                    data: {},
                    message: '获取成功',
                };
            },
        }
        /**详情保存请求配置*/
        requestSaveInfoConfig: {
            onSaveInfo: async (params) => {
                console.log(params);
                return {
                    code: 200,
                    data: {},
                    message: '保存成功',
                };
            },
        }
    })
  return (
    <View>
      <Button onClick={()=>instance.main_getInfo({ id: 1 })}>获取详情</Button>
      <Button onClick={()=>instance.main_saveInfo({ id: 1 })}>保存详情</Button>
    </View>
  )
}
export default connectToastMessage(Page)

```
