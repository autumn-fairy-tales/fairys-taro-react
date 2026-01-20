import { MObject } from 'interface';
import { createContext, useContext, useRef } from 'react';
import { proxy, ref, snapshot, useSnapshot } from 'valtio';
import AsyncValidator, { RuleItem, ValidateFieldsError, Values } from 'async-validator';
import { copy } from 'fast-copy';

/**表单实例*/
export class FairysTaroValtioFormInstance<T extends MObject<T> = Record<string, any>> {
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
  updated = <M = T>(state: Partial<M>, isValidate?: boolean) => {
    const keys = Object.keys(state);
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      this.state[key] = state[key];
    }
    if (isValidate) {
      this.validate(keys, false);
    }
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
  /**列规则 */
  rules: Record<
    PropertyKey,
    ((formData: T, instance: FairysTaroValtioFormInstance<T>) => RuleItem[] | Promise<RuleItem[]>) | RuleItem[]
  > = {};
  /**规则验证
   * @param fields 列字段数组(可选)
   * @param isReturn 是否返回验证结果(可选)
   */
  validate = async (fields?: PropertyKey[], isReturn: boolean = true): Promise<ValidateFieldsError | Values> => {
    let _fields = fields;
    const _formData = snapshot(this.state) as T;
    // 没有规则，直接返回数据
    if (!this.rules) {
      return Promise.resolve({ ..._formData });
    }
    const rules: Record<PropertyKey, RuleItem[]> = {};
    let isNeedValidate = false;
    // 没有 fields 值，验证所有
    if (!fields || (Array.isArray(fields) && fields.length === 0)) {
      _fields = Object.keys(this.rules);
    }
    for (let index = 0; index < _fields.length; index++) {
      isNeedValidate = true;
      const element = _fields[index];
      const rule = this.rules[element];
      if (typeof rule === 'function') {
        const _rules = await rule(_formData, this);
        rules[element] = _rules;
      } else if (Array.isArray(rule)) {
        rules[element] = rule;
      }
    }
    if (!isNeedValidate) {
      console.warn('no rules to validate');
      return Promise.resolve({ ..._formData });
    }
    return new Promise((resolve, reject) => {
      new AsyncValidator({ ...rules }).validate({ ..._formData }, (errors, fields) => {
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
            resolve(fields);
          }
        }
      });
    });
  };
}

/**声明实例*/
export function useFairysTaroValtioFormInstance<T extends MObject<T> = object>(
  instance?: FairysTaroValtioFormInstance<T>,
) {
  const ref = useRef<FairysTaroValtioFormInstance<T>>();
  if (!ref.current) {
    if (instance) {
      ref.current = instance;
    } else {
      ref.current = new FairysTaroValtioFormInstance<T>();
    }
  }
  return ref.current;
}

/**表单实例上下文*/
export const FairysTaroValtioFormInstanceContext = createContext<FairysTaroValtioFormInstance<any>>(
  new FairysTaroValtioFormInstance<any>(),
);

/**表单实例上下文*/
export function useFairysTaroValtioFormInstanceContext<T extends MObject<T> = object>() {
  return useContext(FairysTaroValtioFormInstanceContext) as FairysTaroValtioFormInstance<T>;
}

/**状态取值*/
export function useFairysTaroValtioFormInstanceContextState<T extends MObject<T> = object>() {
  const instance = useFairysTaroValtioFormInstanceContext<T>();
  const state = useSnapshot(instance.state) as T;
  const errorState = useSnapshot(instance.errorState) as Record<PropertyKey, string[]>;
  return [state, errorState, instance, (state as any).__defaultValue, errorState.__defaultValue] as [
    T,
    Record<PropertyKey, string[]>,
    FairysTaroValtioFormInstance<T>,
    any,
    any,
  ];
}

/**隐藏组件状态取值*/
export function useFairysTaroValtioFormInstanceContextHideState<T extends MObject<T> = object>() {
  const instance = useFairysTaroValtioFormInstanceContext<T>();
  const hideState = useSnapshot(instance.hideState) as Record<PropertyKey, boolean>;
  return [hideState, instance, (hideState as any).__defaultValue] as [
    Record<PropertyKey, boolean>,
    FairysTaroValtioFormInstance<T>,
    any,
  ];
}
