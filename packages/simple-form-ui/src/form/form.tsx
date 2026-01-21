import { MObject } from 'interface';
import { FairysTaroValtioFormLayout } from './layout';
import { FairysTaroValtioFormItem, FairysTaroValtioFormHideItem } from './form.item';
import { FairysTaroValtioFormConfigListItem, FairysTaroValtioFormConfigItem } from './item.config';
import {
  useFairysValtioForm,
  FairysValtioFormInstanceContext,
  useFairysValtioFormInstance,
  useFairysValtioFormInstanceContext,
  useFairysValtioFormInstanceContextState,
  useFairysValtioFormInstanceContextHideState,
} from '@fairys/valtio-form';
import type { FairysValtioFormAttrsProps } from '@fairys/valtio-form';
export * from '@fairys/valtio-form';
export * from './form.item';
export * from './layout';
export * from './item.config';
export interface FairysTaroValtioFormProps<T extends MObject<T> = object> extends FairysValtioFormAttrsProps<T> {}

export function FairysTaroValtioForm<T extends MObject<T> = object>(props: FairysTaroValtioFormProps<T>) {
  const { formInstance, children, ...rest } = useFairysValtioForm(props);
  return (
    <FairysValtioFormInstanceContext.Provider value={formInstance}>
      <FairysTaroValtioFormLayout {...rest}>{children}</FairysTaroValtioFormLayout>
    </FairysValtioFormInstanceContext.Provider>
  );
}
/**初始化实例*/
FairysTaroValtioForm.useForm = useFairysValtioFormInstance;
/**获取状态*/
FairysTaroValtioForm.useFormState = useFairysValtioFormInstanceContextState;
/**获取隐藏状态*/
FairysTaroValtioForm.useFormHideState = useFairysValtioFormInstanceContextHideState;
/**获取上下文实例*/
FairysTaroValtioForm.useFormInstance = useFairysValtioFormInstanceContext;
/**多个配置项*/
FairysTaroValtioForm.FormItemListItem = FairysTaroValtioFormConfigListItem;
/**单个配置项*/
FairysTaroValtioForm.FormItemConfig = FairysTaroValtioFormConfigItem;
/**表单项*/
FairysTaroValtioForm.FormItem = FairysTaroValtioFormItem;
/**隐藏表单想*/
FairysTaroValtioForm.FormHideItem = FairysTaroValtioFormHideItem;
