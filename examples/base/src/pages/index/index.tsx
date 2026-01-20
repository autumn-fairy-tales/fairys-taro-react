import {
  connectToastMessage,
  FairysTaroMainPage,
  FairysTaroMainPageSearch,
  FairysTaroMainPageBody,
  FairysTaroMainPageFooter,
} from '@fairys/taro-tools-react';
import { Button, Input } from '@nutui/nutui-react-taro';
import { FairysTaroValtioFormItem, FairysTaroValtioForm } from '@fairys/taro-tools-simple-form-ui';
import { View } from '@tarojs/components';

function Index() {
  const form = FairysTaroValtioForm.useForm();
  const onSubmit = async () => {
    try {
      await form.validate();
    } catch (error) {}
  };

  return (
    <FairysTaroMainPage>
      <FairysTaroMainPageSearch style={{ padding: 20 }}>
        <View>
          <FairysTaroValtioForm
            form={form}
            rules={{
              name: [{ required: true, message: '请输入用户名' }],
            }}
            title="这是标题"
            extra="扩展"
            bordered
            // boxShadow
          >
            <FairysTaroValtioFormItem helpText="222" name="name" extra="eee" label="用户名">
              <Input />
            </FairysTaroValtioFormItem>
            <FairysTaroValtioFormItem helpText="222" name="phone" extra="eee" label="phone">
              <Input />
            </FairysTaroValtioFormItem>
          </FairysTaroValtioForm>
        </View>
      </FairysTaroMainPageSearch>
      <FairysTaroMainPageBody></FairysTaroMainPageBody>
      <FairysTaroMainPageFooter
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0.3rem 0.5rem' }}
      >
        <Button block type="primary" onClick={onSubmit}>
          提交
        </Button>
      </FairysTaroMainPageFooter>
    </FairysTaroMainPage>
  );
}
export default connectToastMessage(Index);
