# 页面数据状态实例

:::tip

用于管理列表页面数据状态, 包含列表查询, 列表分页, 列表总数, 列表数据等状态

:::

**引入**

```ts
import { usePageData } from '@fairys/taro-tools-react';
```

## 参数

```ts
import { ProxyInstanceObjectBase } from '@fairys/taro-tools-react';

export interface PageInfoDataInstanceState extends Object {
    /**loading存储*/
    loading?: Record<string, boolean>;
    /**编辑表单数据*/
    editFormData?: Record<string, any>;
    /**编辑类型*/
    editType?: 'add' | 'edit' | 'info';
    /**查询详情是否成功*/
    isInfoSuccess?: boolean;
    /**数据默认值不使用*/
    __defaultValue?: string;
    [s: string]: any;
}
export declare class PageInfoDataInstance<T extends PageInfoDataInstanceState = PageInfoDataInstanceState> extends ProxyInstanceObjectBase<T> {
    /**默认值*/
    defaultInital: T;
    requestInfoConfig?: {
        /**详情查询-请求之前处理参数*/
        onBefore?: (store: T) => Promise<Partial<T>> | Partial<T>;
        /**详情查询-请求接口*/
        getInfo?: (payload: any) => Promise<{
            code?: number;
            data?: any;
            message?: string;
        }>;
        /**详情查询-请求之后处理返回值进行存储*/
        onAfter?: (data: Record<string, any>) => Partial<T>;
        /**详情查询-code!==1 时 触发*/
        onError?: (data: Record<string, any>) => void;
    };
    requestSaveInfoConfig?: {
        /**详情保存-请求之前处理参数*/
        onSaveBefore?: (store: T) => Promise<Record<string, any>> | Record<string, any>;
        /**详情保存接口*/
        onSaveInfo?: (payload: any) => Promise<{
            code?: number;
            data?: any;
            message?: string;
        }>;
        /**详情保存-请求之后处理返回值进行存储*/
        onSaveAfter?: (data: Record<string, any>) => void;
        /**详情查询-code!==1 时 触发*/
        onSaveError?: (data: Record<string, any>) => void;
        /**保存成功-跳转页面*/
        saveSuccessNavigate?: string | 'navigateBack' | number | ((data: any) => void);
        /**是否显示成功提示*/
        isShowSuccessMessage?: boolean;
    };
    constructor(options?: PageInfoDataOptions<T>);
    store: T;
    /**初始化状态值*/
    main_page_store: (initalValues?: Partial<T>, file?: string[]) => this;
    /**更新页面级的 pageLoading */
    updatedLoading: (loading?: boolean) => void;
    /**内置——查询详细信息*/
    main_getInfo: () => Promise<void>;
    /**保存数据*/
    main_saveInfo: () => Promise<void>;
}
export interface PageInfoDataOptions<T extends PageInfoDataInstanceState = PageInfoDataInstanceState> {
    /**详情查询请求配置*/
    requestInfoConfig?: PageInfoDataInstance<T>['requestInfoConfig'];
    /**详情保存请求配置*/
    requestSaveInfoConfig?: PageInfoDataInstance<T>['requestSaveInfoConfig'];
    /**初始值*/
    initialValues?: Partial<T>;
}
/**
 * 页面级数据状态管理
 */
export declare const usePageInfoData: <T extends PageInfoDataInstanceState = PageInfoDataInstanceState>(options?: PageInfoDataOptions<T>) => [T, PageInfoDataInstance<T>, string | undefined];

```

## 使用

```tsx

import { usePageInfoData ，connectToastMessage} from '@fairys/taro-tools-react';
import { View, Button } from '@tarojs/components';

const Page = ()=> {
    const [state, instance] = usePageData({
        /**详情查询请求配置*/
        requestConfig:{
            getList: async (params) => {
                console.log(params);
                return {
                    code: 200,
                    data: {
                        list: [],
                        total: 0,
                    },
                    message: '获取成功',
                };
            },
        }
    })
  return (
    <View>
      <Button onClick={()=>instance.main_getInfo({ id: 1 })}>获取列表</Button>
    </View>
  )
}
export default connectToastMessage(Page)

```
