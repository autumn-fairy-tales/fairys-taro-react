import { proxy, ref, useSnapshot } from 'valtio';
import { ProxyInstanceObjectBase } from 'utils/valtio/instance';
import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { globalSettingDataInstance } from './global.setting.data.instance';
import Taro, { useDidShow } from '@tarojs/taro';

export interface PageDataInstanceState extends Object {
  /**loading存储*/
  loading?: Record<string, boolean>;
  /**当前页*/
  page?: number;
  /**分页数*/
  pageSize?: number;
  /**默认分页数*/
  defaultPageSize?: number;
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
  /**一下是tab多页签使用*/
  tabKey?: string;
  /**tab多页签配置*/
  tabItems?: {
    /**tab页签key*/
    key: string;
    /**tab页签显示名称*/
    label: string;
    /**tab页签接口*/
    api?: (
      payload: any,
      tabKey: string,
      instance: PageDataInstance,
    ) => Promise<{ code?: number; data?: any; message?: string }>;
    /**tab页签默认查询参数*/
    query?: Record<string, any>;
    [s: string]: any;
  }[];
  /**是否是tab多页签*/
  isTabs?: boolean;
  /**是否展开查询条件*/
  expandSearch?: boolean;
  /**数据默认值不使用*/
  __defaultValue?: string;
  [s: string]: any;
}

export class PageDataInstance<
  T extends PageDataInstanceState = PageDataInstanceState,
> extends ProxyInstanceObjectBase<T> {
  /**不使用ref存储的字段*/
  notRefFields: string[] = ['search', 'loading'];
  // ======================================挂载方法或参数======================================
  /**请求之前处理参数*/
  onBefore?: (payload: any, store: T, instance: PageDataInstance<T>) => Partial<T>;
  /**请求接口*/
  getList?: (payload: any, instance: PageDataInstance<T>) => Promise<{ code?: number; data?: any; message?: string }>;
  /**请求之后处理返回值进行存储*/
  onAfter?: (data: Record<string, any>, instance: PageDataInstance<T>) => Partial<T>;
  /**额外数据处理*/
  onExtraData?: (data: Record<string, any>, instance: PageDataInstance<T>) => Record<string, any>;
  /** code!==1 时 触发*/
  onError?: (data: Record<string, any>, instance: PageDataInstance<T>) => void;
  /**重置获取值的方法*/
  getResetValues?: (instance: PageDataInstance<T>) => Record<string, any>;
  /**默认查询参数*/
  defaultQuery?: Record<string, any> = {};
  /**那些字段取值对象 code值*/
  codeFields?: string[] = [];
  /**那些字段取值对象的 value 值 */
  valueFields?: string[] = [];
  // ======================================挂载方法或参数======================================
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
    search: {},
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
  store = proxy<T>({ ...this.defaultInital } as T);

  ctor = (options?: PageDataOptions<T>) => {
    if (options?.initialValues) {
      this.main_page_store(options.initialValues);
    }
    if (options.defaultPageSize) {
      this.store.defaultPageSize = options.defaultPageSize;
    }
    if (options?.is_scroll_page !== undefined) {
      this.is_scroll_page = options?.is_scroll_page;
    }
    if (options?.defaultTabKey) {
      this.store.tabKey = options.defaultTabKey;
    }
    if (options?.tabItems) {
      this.store.tabItems = ref(options.tabItems);
      this.store.isTabs = Array.isArray(options.tabItems) && options.tabItems.length > 0;
    }
  };
  /**初始化状态值*/
  main_page_store = (initalValues: Partial<T> = {}, file?: string[]) => {
    const newStore = { ...this.defaultInital, ...initalValues } as unknown as T;
    return this._ctor(newStore, [...(file || []), 'loading']);
  };
  /**格式化请求参数*/
  formateParams = (params: Record<string, any>) => {
    const _query = {};
    const keys = Object.keys(params);
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      if ((this.valueFields || []).includes(key)) {
        _query[key] = params[key]?.value;
      } else if ((this.codeFields || []).includes(key)) {
        _query[key] = params[key]?.code;
      } else {
        _query[key] = params[key];
      }
    }
    return { ..._query };
  };
  /**更新查询条件*/
  updatedSearch = (value: Record<string, any> = {}) => {
    const keys = Object.keys(value);
    if (!this.store.search) {
      this.store.search = {};
    }
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      this.store.search[key] = value[key];
    }
  };

  /**更新页面级的 pageLoading */
  updatedPageLoading = (loading: boolean = true) => {
    if (typeof this.store?.loading === 'object') {
      this.store.loading.pageLoading = loading;
    } else {
      this.store.loading = { pageLoading: loading };
    }
  };
  /**更新页面级的 loadMore */
  updatedLoading = (value: Record<string, boolean>) => {
    if (typeof this.store?.loading === 'object') {
      this.store.loading = { ...this.store.loading, ...value };
    } else {
      this.store.loading = { ...value };
    }
  };
  /**内置——查询列表*/
  main_getList = async () => {
    let pageField = 'page';
    let pageSizeField = 'pageSize';
    let dataListField = 'dataList';
    let totalField = 'total';
    let selectedRowsField = 'selectedRows';
    let selectedRowKeysField = 'selectedRowKeys';
    let _request: Function | undefined = this.getList;
    /**默认请求参数*/
    let defaultQuery = {};
    if (this.store.isTabs) {
      const tabKey = this.store.tabKey;
      const findTab = this.store.tabItems?.find((item) => item.key === tabKey);
      if (findTab?.api) {
        _request = findTab.api;
      }
      defaultQuery = findTab?.query || {};
      pageField = `${tabKey}Page`;
      pageSizeField = `${tabKey}PageSize`;
      dataListField = `${tabKey}DataList`;
      totalField = `${tabKey}Total`;
      selectedRowsField = `${tabKey}SelectedRows`;
      selectedRowKeysField = `${tabKey}SelectedRowKeys`;
    }
    if (!_request) {
      console.error('未配置 getList 请求方法,请检查是否配置了 getList 方法');
      return;
    }
    Taro.showLoading({
      title: '加载中...',
    });
    try {
      this.updatedPageLoading(true);
      const payload = {
        ...this.defaultQuery,
        ...defaultQuery,
        ...this.store.search,
        page: this.store[pageField] || 1,
        pageSize: this.store[pageSizeField] || this.store.defaultPageSize || 20,
      };
      let newParams = this.formateParams({ ...payload }) as any;
      if (this.onBefore) {
        newParams = this.onBefore(payload, this.store, this);
      }
      const result = await this.getList?.(newParams, this);
      this.updatedPageLoading(false);
      this.store.loading.loadMore = false;
      if (result && result.code === globalSettingDataInstance.store.requestSuccessCode) {
        let saveData = {};
        if (this.onAfter) {
          saveData = this.onAfter(result, this);
        } else {
          const dataList = result?.data?.list || result?.data?.rows || result?.data?.records || [];
          /**如果是第一页则直接返回数据，否则进行拼接数据*/
          let newDataList = [];
          if (this.store[pageField] === 1) {
            newDataList = dataList;
          } else if (this.is_scroll_page) {
            newDataList = [...(this.store[dataListField] || []), ...dataList];
          }
          saveData = {
            [dataListField]: newDataList,
            [totalField]: result?.data?.total || 0,
          };
          // 第一页清理
          if (this.store[pageField] === 1 || !this.is_scroll_page) {
            saveData[selectedRowsField] = ref([]);
            saveData[selectedRowKeysField] = ref([]);
          }
        }
        if (this.onExtraData) {
          const _temps = this.onExtraData(result, this);
          saveData = { ...saveData, ...(_temps || {}) };
        }
        if (saveData) this._setValues(saveData);
      } else if (this.onError) {
        this.onError(result, this);
      }
    } catch (error) {
      console.log(error);
      this.store.loading.loadMore = false;
      this.updatedPageLoading(false);
    }
    Taro.hideLoading();
  };
  /**内置——翻页*/
  main_onPageChange = (page: number) => {
    if (this.store.isTabs) {
      const tabKey = this.store.tabKey;
      this._setValues({
        [`${tabKey}Page`]: 1,
      });
    } else {
      this._setValues({ page });
    }
    this.main_getList();
  };
  /**内置——翻页切换*/
  main_onShowSizeChange = (_: number, pageSize: number) => {
    if (this.store.isTabs) {
      const tabKey = this.store.tabKey;
      this._setValues({
        [`${tabKey}Page`]: 1,
        [`${tabKey}PageSize`]: pageSize,
      });
    } else {
      this._setValues({ page: 1, pageSize });
    }
    this.main_getList();
  };
  /**弹框内字段重置，如果没有获取字段值的方法，则直接清理所有字段值*/
  main_onReset = () => {
    if (this.getResetValues) {
      const values = this.getResetValues(this);
      if (values) {
        this.updatedSearch({ ...values });
      }
    } else {
      // 清理所有字段值
      const keys = Object.keys(this.store.search || {});
      for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        this.store.search[key] = undefined;
      }
    }
  };
  /**内置——查询方法*/
  main_onSearch = () => {
    this.main_onPageChange(1);
    /**点击查询的时候关闭弹框*/
    this.store.expandSearch = false;
  };
  /**加载更多*/
  main_onLoadMore = () => {
    if (this.store.loading?.pageLoading) {
      // 加载中，不进行请求
      return;
    }
    const isTabs = this.store.isTabs;
    if (isTabs) {
      const tabKey = this.store.tabKey;
      const total = this.store[`${tabKey}Total`] || 0;
      const page = this.store[`${tabKey}Page`] || 1;
      const pageSize = this.store[`${tabKey}PageSize`] || this.store.defaultPageSize || 20;
      const count = Math.ceil(total / pageSize);
      let hasLastPage = false;
      if (page >= count && total) {
        // 已经最后一页数据了
        hasLastPage = true;
        this._setValues({ [`${tabKey}HasLastPage`]: hasLastPage });
        return;
      }
      const nextPage = page + 1;
      if (nextPage >= count && total) {
        // 当前是最后一页数据
        hasLastPage = true;
      }
      this.updatedLoading({ [`${tabKey}LoadMore`]: true });
      // 判断是否最后一页数据
      this._setValues({
        [`${tabKey}Page`]: nextPage,
        [`${tabKey}HasLastPage`]: hasLastPage,
      });
      this.main_getList();
      return;
    }
    const total = this.store.total || 0;
    const page = this.store.page || 1;
    const pageSize = this.store.pageSize || this.store.defaultPageSize || 20;
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
  /**初始值*/
  initialValues?: Partial<T>;
  /**是否滚动加载更多*/
  is_scroll_page?: boolean;
  /**默认tab key*/
  defaultTabKey?: string;
  /**tab多页签配置*/
  tabItems?: PageDataInstanceState['tabItems'];
  /**默认分页数*/
  defaultPageSize?: number;
}

/**初始化实例*/
export function usePageDataInstance<T extends PageDataInstanceState = PageDataInstanceState>(
  instance?: PageDataInstance<T>,
) {
  const ref = useRef<PageDataInstance<T>>();
  if (!ref.current) {
    ref.current = instance || new PageDataInstance<T>();
  }
  return ref.current;
}

/**页面级数据状态管理上下文*/
export const PageDataInstanceContext = createContext<PageDataInstance>(new PageDataInstance());

/**获取上下文实例*/
export const usePageDataInstanceContext = <T extends PageDataInstanceState = PageDataInstanceState>() => {
  const PageDataInstance = useContext(PageDataInstanceContext) as PageDataInstance<T>;
  return PageDataInstance;
};

export interface PageDataInstanceContextProviderProps<T extends PageDataInstanceState = PageDataInstanceState>
  extends PageDataOptions<T> {
  instance?: PageDataInstance<T>;
  children: React.ReactNode;
  /**请求之前处理参数*/
  onBefore?: PageDataInstance<T>['onBefore'];
  /**请求接口*/
  getList?: PageDataInstance<T>['getList'];
  /**请求之后处理返回值进行存储*/
  onAfter?: PageDataInstance<T>['onAfter'];
  /** 额外数据处理*/
  onExtraData?: PageDataInstance<T>['onExtraData'];
  /** code!== 200 时 触发*/
  onError?: PageDataInstance<T>['onError'];
  /**获取弹框内重置参数*/
  getResetValues?: PageDataInstance<T>['getResetValues'];
  /**默认查询参数*/
  defaultQuery?: PageDataInstance<T>['defaultQuery'];
  /**那些字段取值对象 code值*/
  codeFields?: PageDataInstance<T>['codeFields'];
  /**那些字段取值对象的 value 值 */
  valueFields?: PageDataInstance<T>['valueFields'];
  /**是否是第一次加载*/
  isMountLoad?: boolean;
  /**页面标题*/
  title?: string;
}

/**页面级数据状态管理上下文提供者*/
export function PageDataInstanceContextProvider<T extends PageDataInstanceState = PageDataInstanceState>(
  props: PageDataInstanceContextProviderProps<T>,
) {
  const {
    instance,
    children,
    initialValues,
    is_scroll_page,
    defaultTabKey,
    tabItems,
    defaultPageSize,
    onBefore,
    getList,
    onAfter,
    onExtraData,
    onError,
    getResetValues,
    defaultQuery,
    codeFields,
    valueFields,
    isMountLoad,
    title,
  } = props;
  const pageInstance = usePageDataInstance(instance);

  instance.onBefore = onBefore;
  instance.getList = getList;
  instance.onAfter = onAfter;
  instance.onExtraData = onExtraData;
  instance.onError = onError;
  instance.getResetValues = getResetValues;
  instance.codeFields = codeFields;
  instance.valueFields = valueFields;
  instance.defaultQuery = defaultQuery;

  useMemo(
    () => pageInstance.ctor({ initialValues, is_scroll_page, defaultTabKey, tabItems, defaultPageSize }),
    [pageInstance],
  );

  useEffect(() => {
    if (isMountLoad) {
      pageInstance.main_onSearch();
    }
  }, []);

  useDidShow(() => {
    if (title) {
      // 列表查询才调用
      Taro.setNavigationBarTitle({ title });
    }
  });

  return <PageDataInstanceContext.Provider value={pageInstance}>{children}</PageDataInstanceContext.Provider>;
}

/**
 * 页面级数据状态管理
 */
export const usePageDataInstanceState = <T extends PageDataInstanceState = PageDataInstanceState>() => {
  const PageMainDataInstance = usePageDataInstanceContext<T>();
  const store = useSnapshot(PageMainDataInstance.store, { sync: true }) as T;
  return [store, PageMainDataInstance, store.__defaultValue] as [T, PageDataInstance<T>, string | undefined];
};
