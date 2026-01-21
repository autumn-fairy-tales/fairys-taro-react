import { MObject } from 'interface';
import { FairysValtioFormInstance, useFairysValtioFormInstance } from './instance';
import { useMemo, type ReactNode } from 'react';
import { FairysValtioFormLayoutAttrsProps } from './layout';

export interface FairysValtioFormAttrsProps<T extends MObject<T> = object> extends FairysValtioFormLayoutAttrsProps {
  /**表单实例*/
  form?: FairysValtioFormInstance<T>;
  /**子元素*/
  children: ReactNode;
  /**表单项规则*/
  rules?: FairysValtioFormInstance<T>['rules'];
  /**表单初始值*/
  formData?: FairysValtioFormInstance<T>['state'];
  /**表单隐藏状态*/
  hideState?: FairysValtioFormInstance<T>['hideState'];
  /**formData 是否进行深度拷贝，如果不是则直接把 formData 赋值到 state ，否则使用 copy 方法深度拷贝后赋值 */
  isDeepCopy?: boolean;
}

/**
 * 表单属性处理
 * 
 * @example
 * 
 * ```tsx
import { useFairysValtioForm } from "@fairys/valtio-form"
import type { FairysValtioFormAttrProps } from "@fairys/valtio-form"
export interface FormProps extends FairysValtioFormAttrProps{}

export const Form = (props: FormProps) => {
  const { formInstance,children, ...rest } = useFairysValtioForm(props)
  return  (
    <FairysValtioFormInstanceContext.Provider value={formInstance}>
      <布局组件 {...rest}>{children}</布局组件>
    </FairysValtioFormInstanceContext.Provider>
  );
}
 * ```
*/
export function useFairysValtioForm<T extends MObject<T> = object>(props: FairysValtioFormAttrsProps<T>) {
  const { form, rules, formData, hideState, isDeepCopy = true, ...rest } = props;
  const formInstance = useFairysValtioFormInstance(form);
  /**表单规则*/
  formInstance.rules = rules;
  /**初始化表单值*/
  useMemo(() => formInstance.ctor({ formData, hideState, isDeepCopy }), []);
  return {
    ...rest,
    formInstance,
  };
}
