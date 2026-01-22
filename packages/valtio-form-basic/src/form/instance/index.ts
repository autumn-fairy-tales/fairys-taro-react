import { MObject } from 'interface';
import { createContext, useContext, useRef } from 'react';
import { proxy, ref, snapshot, useSnapshot } from 'valtio';
import AsyncValidator, { RuleItem, ValidateFieldsError, Values } from 'async-validator';
import { copy } from 'fast-copy';
import { formatePath, get, set } from 'form/utils';

/**表单实例*/
export class FairysValtioFormInstance<T extends MObject<T> = Record<string, any>> {
  /**状态*/
  state = proxy<T>({} as T);
  /**
   * 错误信息
   */
  errorState = proxy<Record<PropertyKey, string[]>>({});
  /**隐藏状态*/
  hideState = proxy<Record<PropertyKey, boolean>>({});
  /**初始化表单值*/
  ctor = (options?: { formData?: Partial<T>; hideState?: Record<PropertyKey, boolean>; isDeepCopy?: boolean }) => {
    const { formData, hideState, isDeepCopy = true } = options || {};
    // 如果是 isProxy,则直接赋值
    this.errorState = proxy<Record<PropertyKey, string[]>>({});
    this.hideState = proxy<Record<PropertyKey, boolean>>(hideState ? copy(hideState) : {});
    if (isDeepCopy) {
      this.state = proxy((formData ? copy(formData) : {}) as T);
    } else if (formData) {
      this.state = proxy(formData as T);
    }
  };
  /**
   * 更新数据
   * @param state 更新数据对象
   * @param isValidate 是否验证(可选)
   */
  updated = <M = T>(state: Partial<M>, isValidate: boolean = true) => {
    const keys = Object.keys(state);
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      this.state[key] = state[key];
    }
    if (isValidate) {
      this.validate(keys, false);
    }
  };

  /**根据路径设置值
   * @param path 值路径
   * @param value 值
   */
  updatedValueByPaths = (path: PropertyKey, value: any) => {
    set(this.state, formatePath(path), value);
    this.validate([path], false);
  };
  // ===================================================隐藏状态================================================================
  /**
   * 更新行数据的隐藏信息
   * @param objectHideInfo 行数据隐藏信息对象
   */
  updatedHideInfo = (objectHideInfo: Record<PropertyKey, boolean>) => {
    const keys = Object.keys(objectHideInfo);
    for (let index = 0; index < keys.length; index++) {
      const field = keys[index];
      this.hideState[field] = objectHideInfo[field];
    }
    return this;
  };
  /**
   * 清理隐藏信息
   */
  clearHideInfo = (fields?: PropertyKey[]) => {
    let _fields = fields;
    if (!Array.isArray(fields)) {
      _fields = Object.keys(this.hideState) as PropertyKey[];
    }
    for (let index = 0; index < _fields.length; index++) {
      const field = _fields[index];
      delete this.hideState[field];
    }
    return this;
  };
  // ===================================================隐藏状态===================================================================

  // ===================================================错误信息处理================================================================
  /**
   * 更新行数据的错误信息
   * @param objectErrorInfo 行数据错误信息对象
   */
  updatedErrorInfo = (objectErrorInfo: Record<PropertyKey, string[]>) => {
    const keys = Object.keys(objectErrorInfo);
    for (let index = 0; index < keys.length; index++) {
      const field = keys[index];
      this.errorState[field] = objectErrorInfo[field];
    }
    return this;
  };
  /**
   * 清理错误信息
   */
  clearErrorInfo = (fields?: PropertyKey[]) => {
    let _fields = fields;
    if (!Array.isArray(fields)) {
      _fields = Object.keys(this.errorState) as PropertyKey[];
    }
    for (let index = 0; index < _fields.length; index++) {
      const field = _fields[index];
      delete this.errorState[field];
    }
    return this;
  };
  // ===================================================错误信息处理================================================================

  /**
   * 清理所有数据
   */
  clear = () => {
    this.state = proxy<T>({} as T);
    this.errorState = proxy<Record<PropertyKey, string[]>>({});
    this.hideState = proxy<Record<PropertyKey, boolean>>({});
  };

  // ===================================================规则处理================================================================
  /**由表单项挂载规则,(根据表单项的字段存储路径对应校验规则)*/
  mountRules: Record<PropertyKey, RuleItem[]> = {};
  /**移除表单项挂载规则*/
  removeRules = (name: PropertyKey) => {
    delete this.mountRules[name];
  };
  /**表单项规则*/
  rules: Record<PropertyKey, RuleItem[]> = {};
  /**表单项名称到路径映射*/
  nameToPaths: Record<PropertyKey, PropertyKey[]> = {};
  /**验证表单项规则*/
  validate = async (fields?: PropertyKey[], isReturn: boolean = true): Promise<ValidateFieldsError | Values> => {
    const rules = {
      ...this.rules,
      ...this.mountRules,
    };
    // 根据字段路径获取对应的值
    const _formData = snapshot(this.state) as T;
    const _values: Record<PropertyKey, any> = {};
    /**所有要验证的字段*/
    let _fields = Object.keys(rules) as PropertyKey[];
    /**最后要验证的规则*/
    let _lastRules: Record<PropertyKey, RuleItem[]> = {};
    /**是否指定了字段*/
    let isPropsFields = false;
    // 如果指定了字段，则只验证指定的字段
    if (Array.isArray(fields) && fields.length) {
      _fields = [...fields];
      isPropsFields = true;
      for (let index = 0; index < fields.length; index++) {
        const field = fields[index];
        const paths = this.nameToPaths[field];
        _lastRules[field] = rules[field];
        _values[field] = get(_formData, paths ? paths : formatePath(field as string));
      }
    } else {
      isPropsFields = false;
      _lastRules = { ...rules };
      // 通过规则进行获取那些字段需要验证
      for (let index = 0; index < _fields.length; index++) {
        const field = _fields[index];
        const paths = this.nameToPaths[field];
        _values[field] = get(_formData, paths);
      }
    }
    return new Promise((resolve, reject) => {
      new AsyncValidator({ ...rules }).validate({ ..._values }, (errors, fields) => {
        for (let index = 0; index < _fields.length; index++) {
          const field = _fields[index];
          const fidError = Array.isArray(errors) ? errors.filter((item) => item.field === field) : undefined;
          if (fidError) {
            this.errorState[field] = ref(fidError.map((item) => item.message || ''));
          } else {
            delete this.errorState[field];
          }
        }
        if (isReturn) {
          if (errors) {
            reject({ errors, fields });
          } else {
            /**如果是指定字段，直接返回字段值*/
            if (isPropsFields) {
              resolve({ ...fields });
            } else {
              resolve({ ..._formData });
            }
          }
        }
      });
    });
  };
}

/**声明实例*/
export function useFairysValtioFormInstance<T extends MObject<T> = object>(instance?: FairysValtioFormInstance<T>) {
  const ref = useRef<FairysValtioFormInstance<T>>();
  if (!ref.current) {
    if (instance) {
      ref.current = instance;
    } else {
      ref.current = new FairysValtioFormInstance<T>();
    }
  }
  return ref.current;
}

/**表单实例上下文*/
export const FairysValtioFormInstanceContext = createContext<FairysValtioFormInstance<any>>(
  new FairysValtioFormInstance<any>(),
);

/**表单实例上下文*/
export function useFairysValtioFormInstanceContext<T extends MObject<T> = object>() {
  return useContext(FairysValtioFormInstanceContext) as FairysValtioFormInstance<T>;
}

/**状态取值*/
export function useFairysValtioFormInstanceContextState<T extends MObject<T> = object>() {
  const instance = useFairysValtioFormInstanceContext<T>();
  const state = useSnapshot(instance.state) as T;
  const errorState = useSnapshot(instance.errorState) as Record<PropertyKey, string[]>;
  return [state, errorState, instance, (state as any).__defaultValue, errorState.__defaultValue] as [
    T,
    Record<PropertyKey, string[]>,
    FairysValtioFormInstance<T>,
    any,
    any,
  ];
}

/**隐藏组件状态取值*/
export function useFairysValtioFormInstanceContextHideState<T extends MObject<T> = object>() {
  const instance = useFairysValtioFormInstanceContext<T>();
  const hideState = useSnapshot(instance.hideState) as Record<PropertyKey, boolean>;
  return [hideState, instance, (hideState as any).__defaultValue] as [
    Record<PropertyKey, boolean>,
    FairysValtioFormInstance<T>,
    any,
  ];
}
