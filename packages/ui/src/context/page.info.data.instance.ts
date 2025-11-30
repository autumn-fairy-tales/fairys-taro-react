import { proxy, useSnapshot } from 'valtio';
import { ProxyInstanceObjectBase } from 'utils/valtio/instance';
import { useRef } from 'react';
import navigate from './../utils/navigate';
import { globalDataInstance } from './global.data.instance';

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
  /**默认值*/
  defaultInital = {
    /**编辑类型*/
    editType: 'add',
    /**编辑表单数据*/
    editFormData: {},
    /**查询详情是否成功*/
    isInfoSuccess: false,
    /**加载状态*/
    loading: { pageLoading: false },
  } as unknown as T;

  requestInfoConfig?: {
    /**详情查询-请求之前处理参数*/
    onBefore?: (store: T) => Promise<Partial<T>> | Partial<T>;
    /**详情查询-请求接口*/
    getInfo?: (payload: any) => Promise<{ code?: number; data?: any; message?: string }>;
    /**详情查询-请求之后处理返回值进行存储*/
    onAfter?: (data: Record<string, any>) => Partial<T>;
    /**详情查询-code!==1 时 触发*/
    onError?: (data: Record<string, any>) => void;
  };

  requestSaveInfoConfig?: {
    /**详情保存-请求之前处理参数*/
    onSaveBefore?: (store: T) => Promise<Record<string, any>> | Record<string, any>;
    /**详情保存接口*/
    onSaveInfo?: (payload: any) => Promise<{ code?: number; data?: any; message?: string }>;
    /**详情保存-请求之后处理返回值进行存储*/
    onSaveAfter?: (data: Record<string, any>) => void;
    /**详情查询-code!==1 时 触发*/
    onSaveError?: (data: Record<string, any>) => void;
    /**保存成功-跳转页面*/
    saveSuccessNavigate?: string | 'navigateBack' | number | (() => void);
    /**是否显示成功提示*/
    isShowSuccessMessage?: boolean;
  } = {};

  constructor(options?: PageInfoDataOptions<T>) {
    super();
    if (options?.initialValues) {
      this.main_page_store(options.initialValues);
    }
    if (options.requestInfoConfig) {
      this.requestInfoConfig = options.requestInfoConfig || {};
    }
    if (options.requestSaveInfoConfig) {
      this.requestSaveInfoConfig = options.requestSaveInfoConfig || {};
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

  /**内置——查询详细信息*/
  main_getInfo = async () => {
    if (!this.requestInfoConfig?.getInfo) {
      console.error('未配置 requestInfoConfig.getInfo 请求方法');
      return;
    }
    try {
      this.updatedLoading(true);
      let newParams = {} as any;
      if (this.requestInfoConfig?.onBefore) {
        newParams = await this.requestInfoConfig.onBefore(this.store);
      }
      const result = await this.requestInfoConfig.getInfo?.(newParams);
      this.updatedLoading(false);
      if (result && result.code === 1) {
        let saveData: Partial<T> = {};
        if (this.requestInfoConfig?.onAfter) {
          saveData = this.requestInfoConfig.onAfter(result);
        } else {
          saveData = { editFormData: { ...result?.data } } as Partial<T>;
        }
        if (saveData) this._setValues({ ...saveData, isInfoSuccess: true });
      } else if (this.requestInfoConfig?.onError) {
        this.requestInfoConfig.onError(result);
      }
    } catch (error) {
      console.log(error);
      this.updatedLoading(false);
    }
  };

  /**保存数据*/
  main_saveInfo = async () => {
    try {
      if (this.requestSaveInfoConfig?.onSaveBefore) {
        console.error('未配置 requestSaveInfoConfig.onSaveInfo 请求方法');
        return;
      }
      this.updatedLoading(true);
      const newParams = await this.requestSaveInfoConfig?.onSaveBefore?.(this.store);
      const result = await this.requestSaveInfoConfig.onSaveInfo?.(newParams);
      this.updatedLoading(false);
      if (result && result.code === 1) {
        if (this.requestSaveInfoConfig?.isShowSuccessMessage !== false) {
          globalDataInstance.showMessage({ content: result.message || '保存成功' });
        }
        if (this.requestSaveInfoConfig?.onSaveAfter) {
          this.requestSaveInfoConfig.onSaveAfter(result);
        }
        const saveSuccessNavigate = this.requestSaveInfoConfig?.saveSuccessNavigate;
        if (saveSuccessNavigate) {
          if (saveSuccessNavigate === 'navigateBack') {
            navigate.navigateBack();
          } else if (typeof saveSuccessNavigate === 'function') {
            saveSuccessNavigate();
          } else if (typeof saveSuccessNavigate === 'number') {
            navigate.navigateBack({ delta: saveSuccessNavigate });
          } else if (typeof saveSuccessNavigate === 'string') {
            navigate.navigateTo({ url: saveSuccessNavigate });
          }
        }
      } else if (this.requestSaveInfoConfig?.onSaveError) {
        this.requestSaveInfoConfig.onSaveError(result);
      }
    } catch (error) {
      console.log(error);
      this.updatedLoading(false);
    }
  };
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
export const usePageInfoData = <T extends PageInfoDataInstanceState = PageInfoDataInstanceState>(
  options: PageInfoDataOptions<T> = {},
) => {
  const pageDataInstance = useRef(new PageInfoDataInstance<T>(options)).current;
  const store = useSnapshot(pageDataInstance.store) as T;
  return [store, pageDataInstance, store.__defaultValue] as const;
};
