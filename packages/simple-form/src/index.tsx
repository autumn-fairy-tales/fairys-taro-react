/**
 * 简版表单
 * 用于快速创建表单，支持文本输入、选择框、单选框、复选框等常用表单元素。
 * */
import { Form, useForm, useWatch } from '@carefrees/form-utils-react-taro';
import { FairysTaroSimpleFormProps } from './interface';
import { ConfigListItem, ConfigItem, InputConfigType } from './item.config';
export * from './components';

export const FairysTaroSimpleForm = (props: FairysTaroSimpleFormProps) => {
  return <Form labelMode="between" colCount={1} inputBordered={false} {...props} />;
};
FairysTaroSimpleForm.Item = ConfigItem;
FairysTaroSimpleForm.ListItem = ConfigListItem;
FairysTaroSimpleForm.useForm = useForm;
FairysTaroSimpleForm.useWatch = useWatch;
