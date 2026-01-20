import { MObject } from 'interface';
import {
  FairysTaroValtioFormInstance,
  FairysTaroValtioFormInstanceContext,
  useFairysTaroValtioFormInstance,
  useFairysTaroValtioFormInstanceContext,
  useFairysTaroValtioFormInstanceContextState,
  useFairysTaroValtioFormInstanceContextHideState,
} from './instance';
import { useMemo, type ReactNode } from 'react';
import { FairysTaroValtioFormLayout, FairysTaroValtioFormLayoutProps } from './layout';
import { FairysTaroValtioFormItem, FairysTaroValtioFormHideItem } from './form.item';
import { FairysTaroValtioFormConfigListItem, FairysTaroValtioFormConfigItem } from './item.config';
export * from './item.config';

export interface FairysTaroValtioFormProps<T extends MObject<T> = object> extends FairysTaroValtioFormLayoutProps {
  /**表单实例*/
  form?: FairysTaroValtioFormInstance<T>;
  /**子元素*/
  children: ReactNode;
  /**表单项规则*/
  rules?: FairysTaroValtioFormInstance<T>['rules'];
  /**表单初始值*/
  formData?: FairysTaroValtioFormInstance<T>['state'];
  /**表单隐藏状态*/
  hideState?: FairysTaroValtioFormInstance<T>['hideState'];
  /**formData 是否进行深度拷贝，如果不是则直接把 formData 赋值到 state ，否则使用 copy 方法深度拷贝后赋值 */
  isDeepCopy?: boolean;
}

export function FairysTaroValtioForm<T extends MObject<T> = object>(props: FairysTaroValtioFormProps<T>) {
  const { form, children, rules, formData, hideState, isDeepCopy = true, ...rest } = props;
  const formInstance = useFairysTaroValtioFormInstance(form);
  /**表单规则*/
  formInstance.rules = rules;
  /**初始化表单值*/
  useMemo(() => formInstance.ctor({ formData, hideState, isDeepCopy }), []);
  return (
    <FairysTaroValtioFormInstanceContext.Provider value={formInstance}>
      <FairysTaroValtioFormLayout {...rest}>{children}</FairysTaroValtioFormLayout>
    </FairysTaroValtioFormInstanceContext.Provider>
  );
}
/**初始化实例*/
FairysTaroValtioForm.useForm = useFairysTaroValtioFormInstance;
/**获取状态*/
FairysTaroValtioForm.useFormState = useFairysTaroValtioFormInstanceContextState;
/**获取隐藏状态*/
FairysTaroValtioForm.useFormHideState = useFairysTaroValtioFormInstanceContextHideState;
/**获取上下文实例*/
FairysTaroValtioForm.useFormInstance = useFairysTaroValtioFormInstanceContext;
/**多个配置项*/
FairysTaroValtioForm.FormItemListItem = FairysTaroValtioFormConfigListItem;
/**单个配置项*/
FairysTaroValtioForm.FormItemConfig = FairysTaroValtioFormConfigItem;
/**表单项*/
FairysTaroValtioForm.FormItem = FairysTaroValtioFormItem;
/**隐藏表单想*/
FairysTaroValtioForm.FormHideItem = FairysTaroValtioFormHideItem;
