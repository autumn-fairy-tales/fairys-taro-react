import { FairysTaroValtioForm as FairysTaroValtioFormBase } from '@fairys/taro-valtio-form-basic';
import { FairysTaroValtioFormConfigListItem, FairysTaroValtioFormConfigItem } from './item.config';
export * from '@fairys/taro-valtio-form-basic';
export * from './item.config';
export const FairysTaroValtioForm = FairysTaroValtioFormBase as typeof FairysTaroValtioFormBase & {
  FormItemListItem: typeof FairysTaroValtioFormConfigListItem;
  FormItemConfig: typeof FairysTaroValtioFormConfigItem;
};
FairysTaroValtioForm.FormItemListItem = FairysTaroValtioFormConfigListItem;
FairysTaroValtioForm.FormItemConfig = FairysTaroValtioFormConfigItem;
