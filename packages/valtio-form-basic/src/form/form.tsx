import { MObject } from 'interface';
import { FairysValtioFormInstance, useFairysValtioFormInstance } from './instance';
import { useMemo, type ReactNode } from 'react';
import { FairysValtioFormLayoutAttrsProps } from './layout';
import { RuleItem } from 'async-validator';

export interface FairysValtioFormAttrsProps<T extends MObject<T> = object> extends FairysValtioFormLayoutAttrsProps {
  /**表单实例*/
  form?: FairysValtioFormInstance<T>;
  /**子元素*/
  children: ReactNode;
  /**表单项规则(如果表单项没有指定规则，则使用全局规则，如果表单项指定规则，则使用表单项规则)*/
  rules?: Record<PropertyKey, RuleItem[]>;
  /**表单初始值*/
  formData?: FairysValtioFormInstance<T>['state'];
  /**表单隐藏状态*/
  hideState?: FairysValtioFormInstance<T>['hideState'];
  /**
   * 初始化表单数据类型，默认值为 deepCopy
   * - deepCopy：使用深度拷贝初始化表单数据
   * - proxy：使用代理对象初始化表单数据
   * - immutable：直接使用对象，不进行任何处理，注意，这个使用必须是`valtio`中的`proxy`声明的对象数据，否则表单项更新数据不会同步
   */
  initFormDataType?: 'deepCopy' | 'proxy' | 'immutable';
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
  const { form, rules, formData, hideState, initFormDataType = 'deepCopy', ...rest } = props;
  const formInstance = useFairysValtioFormInstance(form);
  /**表单规则*/
  formInstance.rules = rules;
  /**初始化表单值*/
  useMemo(() => formInstance.ctor({ formData, hideState, initFormDataType }), []);
  return {
    ...rest,
    formInstance,
  };
}
