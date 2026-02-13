import { proxy, ref, useSnapshot } from 'valtio';
import { ProxyInstanceObjectBase } from 'utils/valtio/instance';
import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import navigate from '../utils/navigate';
import { globalDataInstance } from './global.data.instance';
import { globalSettingDataInstance } from './global.setting.data.instance';
import { useDidShow } from '@tarojs/taro';
import Taro from '@tarojs/taro';

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

export class PageInfoDataInstance<
  T extends PageInfoDataInstanceState = PageInfoDataInstanceState,
> extends ProxyInstanceObjectBase<T> {
  notRefFields = ['loading'];
  /**默认值*/
  defaultInital = {
    /**编辑类型*/
    editType: 'add',
    /**编辑表单数据*/
    editFormData: ref({}),
    /**查询详情是否成功*/
    isInfoSuccess: false,
    /**加载状态*/
    loading: { pageLoading: false },
  } as unknown as T;

  requestInfoConfig?: {
    /**详情查询-请求之前处理参数*/
    onBefore?: (store: T, instance: PageInfoDataInstance<T>) => Promise<Partial<T>> | Partial<T>;
    /**详情查询-请求接口*/
    getInfo?: (
      payload: any,
      instance: PageInfoDataInstance<T>,
    ) => Promise<{ code?: number; data?: any; message?: string }>;
    /**详情查询-请求之后处理返回值进行存储*/
    onAfter?: (data: Record<string, any>, instance: PageInfoDataInstance<T>) => Partial<T>;
    /**详情查询-code!==1 时 触发*/
    onError?: (data: Record<string, any>, instance: PageInfoDataInstance<T>) => void;
  };

  requestSaveInfoConfig?: {
    /**详情保存-请求之前处理参数*/
    onSaveBefore?: (store: T, instance: PageInfoDataInstance<T>) => Promise<Record<string, any>> | Record<string, any>;
    /**详情保存接口*/
    onSaveInfo?: (
      payload: any,
      instance: PageInfoDataInstance<T>,
    ) => Promise<{ code?: number; data?: any; message?: string }>;
    /**详情保存-请求之后处理返回值进行存储*/
    onSaveAfter?: (data: Record<string, any>, instance: PageInfoDataInstance<T>) => void;
    /**详情查询-code!==1 时 触发*/
    onSaveError?: (data: Record<string, any>, instance: PageInfoDataInstance<T>) => void;
    /**保存成功-跳转页面*/
    saveSuccessNavigate?: string | 'navigateBack' | number | ((data: any) => void);
    /**是否显示成功提示*/
    isShowSuccessMessage?: boolean;
  } = {};

  ctor(options?: PageInfoDataOptions<T>) {
    if (options?.isProxy) {
      this.notRefFields = ['editFormData', 'loading'];
      this.defaultInital.editFormData = {};
      this.store.editFormData = {};
    }
    if (options?.initialValues) {
      this.main_page_store(options.initialValues);
    }
    return this;
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

  /**内置——查询详细信息*/
  main_getInfo = async () => {
    if (!this.requestInfoConfig?.getInfo) {
      console.error('未配置 requestInfoConfig.getInfo 请求方法');
      return;
    }
    Taro.showLoading({ title: '加载中...' });
    try {
      this.updatedLoading(true);
      let newParams = {} as any;
      if (this.requestInfoConfig?.onBefore) {
        newParams = await this.requestInfoConfig.onBefore(this.store, this);
      }
      const result = await this.requestInfoConfig.getInfo?.(newParams, this);
      this.updatedLoading(false);
      if (result && result.code === globalSettingDataInstance.store.requestSuccessCode) {
        let saveData: Partial<T> = {};
        if (this.requestInfoConfig?.onAfter) {
          saveData = this.requestInfoConfig.onAfter(result, this);
        } else {
          saveData = { editFormData: { ...result?.data } } as Partial<T>;
        }
        if (saveData) this._setValues({ ...saveData, isInfoSuccess: true });
      } else if (this.requestInfoConfig?.onError) {
        this.requestInfoConfig.onError(result, this);
      }
    } catch (error) {
      console.log(error);
      this.updatedLoading(false);
    }
    Taro.hideLoading();
  };

  /**保存数据*/
  main_saveInfo = async () => {
    if (this.requestSaveInfoConfig?.onSaveInfo) {
      console.error('未配置 requestSaveInfoConfig.onSaveInfo 请求方法');
      return;
    }
    try {
      this.updatedLoading(true);
      Taro.showLoading({ title: '保存中...' });
      const newParams =
        (await this.requestSaveInfoConfig?.onSaveBefore?.(this.store, this)) || this.store.editFormData || {};
      const result = await this.requestSaveInfoConfig.onSaveInfo?.(newParams, this);
      Taro.hideLoading();
      this.updatedLoading(false);
      if (result && result.code === globalSettingDataInstance.store.requestSuccessCode) {
        if (this.requestSaveInfoConfig?.isShowSuccessMessage === false) {
          globalDataInstance.showMessage({ content: result.message || '保存成功' });
        } else {
          Taro.showToast({ title: result.message || '保存成功', icon: 'none' });
        }
        if (this.requestSaveInfoConfig?.onSaveAfter) {
          this.requestSaveInfoConfig.onSaveAfter(result, this);
        }
        const saveSuccessNavigate = this.requestSaveInfoConfig?.saveSuccessNavigate;
        if (saveSuccessNavigate) {
          if (saveSuccessNavigate === 'navigateBack') {
            navigate.navigateBack();
          } else if (typeof saveSuccessNavigate === 'function') {
            saveSuccessNavigate(result);
          } else if (typeof saveSuccessNavigate === 'number') {
            navigate.navigateBack({ delta: saveSuccessNavigate });
          } else if (typeof saveSuccessNavigate === 'string') {
            navigate.navigateTo({ url: saveSuccessNavigate });
          }
        }
      } else if (this.requestSaveInfoConfig?.onSaveError) {
        this.requestSaveInfoConfig.onSaveError(result, this);
      }
    } catch (error) {
      console.log(error);
      this.updatedLoading(false);
    }
  };
}

export interface PageInfoDataOptions<
  T extends PageInfoDataInstanceState = PageInfoDataInstanceState,
  M extends PageInfoDataInstance<T> = PageInfoDataInstance<T>,
> {
  /**详情查询请求配置*/
  requestInfoConfig?: M['requestInfoConfig'];
  /**详情保存请求配置*/
  requestSaveInfoConfig?: M['requestSaveInfoConfig'];
  /**初始值*/
  initialValues?: Partial<T>;
  /**editFormData是否使用valtio proxy 存储*/
  isProxy?: boolean;
}

/**初始化实例*/
export const usePageInfoDataInstance = <
  T extends PageInfoDataInstanceState = PageInfoDataInstanceState,
  M extends PageInfoDataInstance<T> = PageInfoDataInstance<T>,
>(
  instance?: M,
) => {
  const ref = useRef<M>();
  if (!ref.current) {
    if (instance) {
      ref.current = instance;
    } else {
      ref.current = new PageInfoDataInstance<T>() as M;
    }
  }
  return ref.current;
};

/**页面级数据状态管理上下文*/
export const PageInfoDataInstanceContext = createContext<PageInfoDataInstance>(new PageInfoDataInstance());

/**获取上下文实例*/
export const usePageInfoDataInstanceContext = <
  T extends PageInfoDataInstanceState = PageInfoDataInstanceState,
  M extends PageInfoDataInstance<T> = PageInfoDataInstance<T>,
>() => {
  const PageInfoDataInstance = useContext(PageInfoDataInstanceContext) as M;
  return PageInfoDataInstance;
};

export interface PageInfoDataInstanceContextProviderProps<
  T extends PageInfoDataInstanceState = PageInfoDataInstanceState,
  M extends PageInfoDataInstance<T> = PageInfoDataInstance<T>,
> extends PageInfoDataOptions<T, M> {
  instance?: M;
  children: React.ReactNode;
  /**页面标题*/
  title?: string;
  /**页面一加载是否请求详情接口*/
  isMountRequestInfo?: boolean;
  /**自定义hooks,挂载参数和设置完初始值后执行*/
  useHooks?: (instance: M) => void;
}

/**页面级数据状态管理上下文提供者*/
export function PageInfoDataInstanceContextProvider<
  T extends PageInfoDataInstanceState = PageInfoDataInstanceState,
  M extends PageInfoDataInstance<T> = PageInfoDataInstance<T>,
>(props: PageInfoDataInstanceContextProviderProps<T, M>) {
  const {
    instance,
    children,
    initialValues,
    requestInfoConfig,
    requestSaveInfoConfig,
    isProxy,
    title,
    isMountRequestInfo,
    useHooks,
  } = props;
  const pageInfoInstance = usePageInfoDataInstance(instance);
  pageInfoInstance.requestInfoConfig = requestInfoConfig;
  pageInfoInstance.requestSaveInfoConfig = requestSaveInfoConfig;

  useMemo(() => pageInfoInstance.ctor({ initialValues, isProxy }), [pageInfoInstance]);

  useHooks?.(pageInfoInstance);

  useDidShow(() => {
    if (title) {
      // 列表查询才调用
      Taro.setNavigationBarTitle({ title });
    }
  });

  useEffect(() => {
    if (isMountRequestInfo) {
      pageInfoInstance.main_getInfo();
    }
  }, []);

  return (
    <PageInfoDataInstanceContext.Provider value={pageInfoInstance}>{children}</PageInfoDataInstanceContext.Provider>
  );
}

/**
 * 页面级数据状态管理
 */
export const usePageInfoDataInstanceState = <
  T extends PageInfoDataInstanceState = PageInfoDataInstanceState,
  M extends PageInfoDataInstance<T> = PageInfoDataInstance<T>,
>() => {
  const PageInfoDataInstance = usePageInfoDataInstanceContext<T, M>();
  const store = useSnapshot(PageInfoDataInstance.store, { sync: true }) as T;
  return [store, PageInfoDataInstance, store.__defaultValue] as [T, M, string | undefined];
};
