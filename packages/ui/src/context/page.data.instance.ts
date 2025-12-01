import { proxy, ref, useSnapshot } from 'valtio';
import { ProxyInstanceObjectBase } from 'utils/valtio/instance';
import { useRef } from 'react';
import { globalSettingDataInstance } from './global.setting.data.instance';

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

export class PageDataInstance<
  T extends PageDataInstanceState = PageDataInstanceState,
> extends ProxyInstanceObjectBase<T> {
  /**是否滚动加载分页*/
  is_scroll_page = true;
  /**默认值*/
  defaultInital = {
    /**当前页*/
    page: 1,
    /**分页数*/
    pageSize: 10,
    /**总数*/
    total: 0,
    /**查询条件*/
    search: ref({}),
    /**表格数据*/
    dataList: ref([]),
    /**选择行数据*/
    selectedRows: ref([]),
    selectedRowKeys: ref([]),
    /**加载状态*/
    loading: { pageLoading: false },
    /**是否最后一页*/
    hasLastPage: false,
  } as unknown as T;

  requestConfig?: {
    /**请求之前处理参数*/
    onBefore?: (payload: any, store: T) => Partial<T>;
    /**请求接口*/
    getList?: (payload: any) => Promise<{ code?: number; data?: any; message?: string }>;
    /**请求之后处理返回值进行存储*/
    onAfter?: (data: Record<string, any>) => Partial<T>;
    /** code!==1 时 触发*/
    onError?: (data: Record<string, any>) => void;
  } = {};

  constructor(options?: PageDataOptions<T>) {
    super();
    if (options?.initialValues) {
      this.main_page_store(options.initialValues);
    }
    if (options.requestConfig) {
      this.requestConfig = options.requestConfig || {};
    }
    if (options?.is_scroll_page !== undefined) {
      this.is_scroll_page = options?.is_scroll_page;
    }
  }

  store = proxy<T>({ ...this.defaultInital } as T);

  /**初始化状态值*/
  main_page_store = (initalValues: Partial<T> = {}, file?: string[]) => {
    const newStore = { ...this.defaultInital, ...initalValues } as unknown as T;
    return this._ctor(newStore, [...(file || []), 'loading']);
  };

  /**更新页面级的 pageLoading */
  updatedLoading = (loading: boolean = true) => {
    if (typeof this.store?.loading === 'object') {
      this.store.loading.pageLoading = loading;
    } else {
      this.store.loading = { pageLoading: loading };
    }
  };

  /**内置——查询列表*/
  main_getList = async () => {
    if (!this.requestConfig?.getList) {
      console.error('未配置 requestConfig.getList 请求方法');
      return;
    }
    try {
      this.updatedLoading(true);
      const payload = {
        ...this.store.search,
        page: this.store.page,
        pageSize: this.store.pageSize,
      };
      let newParams = { ...payload } as any;
      if (this.requestConfig?.onBefore) {
        newParams = this.requestConfig.onBefore(payload, this.store);
      }
      const result = await this.requestConfig.getList?.(newParams);
      this.updatedLoading(false);
      this.store.loading.loadMore = false;

      if (result && result.code === globalSettingDataInstance.store.requestSuccessCode) {
        let saveData: Partial<T> = {};
        if (this.requestConfig?.onAfter) {
          saveData = this.requestConfig.onAfter(result);
        } else {
          const dataList = result?.data?.list || result?.data?.records || [];
          /**如果是第一页则直接返回数据，否则进行拼接数据*/
          let newDataList = [];
          if (this.store.page === 1) {
            newDataList = dataList;
          } else if (this.is_scroll_page) {
            newDataList = [...this.store.dataList, ...dataList];
          }
          saveData = {
            dataList: newDataList,
            total: result?.data?.total || 0,
          } as Partial<T>;
          // 第一页清理
          if (this.store.page === 1) {
            saveData.selectedRows = ref([]);
            saveData.selectedRowKeys = ref([]);
          }
        }
        if (saveData) this._setValues(saveData);
      } else if (this.requestConfig?.onError) {
        this.requestConfig.onError(result);
      }
    } catch (error) {
      console.log(error);
      this.store.loading.loadMore = false;
      this.updatedLoading(false);
    }
  };

  /**内置——翻页*/
  main_onPageChange = (page: number) => {
    this._setValues({ page });
    this.main_getList();
  };

  /**内置——翻页切换*/
  main_onShowSizeChange = (_: number, pageSize: number) => {
    this._setValues({ page: 1, pageSize });
    this.main_getList();
  };

  /**内置——查询方法*/
  main_onSearch = () => {
    this.main_onPageChange(1);
  };

  /**加载更多*/
  main_onLoadMore = () => {
    if (this.store.loading?.pageLoading) {
      // 加载中，不进行请求
      return;
    }
    const total = this.store.total || 0;
    const page = this.store.page || 1;
    const pageSize = this.store.pageSize || 20;
    const count = Math.ceil(total / pageSize);
    let hasLastPage = false;
    if (page >= count && total) {
      // 已经最后一页数据了
      hasLastPage = true;
      this._setValues({ hasLastPage });
      return;
    }
    const nextPage = page + 1;
    if (nextPage >= count && total) {
      // 当前是最后一页数据
      hasLastPage = true;
    }
    this.store.loading.loadMore = true;
    // 判断是否最后一页数据
    this._setValues({ page: nextPage, hasLastPage });
    this.main_getList();
  };
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
export const usePageData = <T extends PageDataInstanceState = PageDataInstanceState>(
  options: PageDataOptions<T> = {},
) => {
  const pageDataInstance = useRef(new PageDataInstance<T>(options)).current;
  const store = useSnapshot(pageDataInstance.store) as T;
  return [store, pageDataInstance, store.__defaultValue] as const;
};
