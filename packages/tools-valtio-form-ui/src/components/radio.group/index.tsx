import { RadioGroup, RadioGroupProps, Radio, RadioProps } from '@nutui/nutui-react-taro';

export interface FairysTaroRadioGroupProps extends Partial<RadioGroupProps> {
  items?: RadioProps[];
}

export const FairysTaroRadioGroupBase = (props: FairysTaroRadioGroupProps) => {
  const { items, className, ...rest } = props;
  return (
    <RadioGroup className={`fairys-taro-radio-group ${className || ''}`} {...rest}>
      {items?.map((item) => (
        <Radio key={item.value} {...item} />
      ))}
    </RadioGroup>
  );
};
