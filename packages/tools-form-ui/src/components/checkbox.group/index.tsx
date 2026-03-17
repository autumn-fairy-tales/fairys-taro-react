import { CheckboxGroup, CheckboxGroupProps, Checkbox, CheckboxProps } from '@nutui/nutui-react-taro';

export interface FairysTaroCheckboxGroupProps extends Partial<CheckboxGroupProps> {
  items?: Partial<CheckboxProps>[];
}

export const FairysTaroCheckboxGroupBase = (props: FairysTaroCheckboxGroupProps) => {
  const { items, className, ...rest } = props;
  return (
    <CheckboxGroup className={`fairys-taro-checkbox-group ${className || ''}`} direction="horizontal" {...rest}>
      {items?.map((item) => (
        <Checkbox key={item.value} {...item} />
      ))}
    </CheckboxGroup>
  );
};
