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
            bordered
            lastItemBordered={false}
            isInvalidBorderRed
            showColon
          >
            <FairysTaroValtioFormItem name="name" extra="eee" label="用户名">
              <Input align="right" />
            </FairysTaroValtioFormItem>
            <FairysTaroValtioFormItem name="name" extra="eee" label="用户名">
              <Input align="right" />
            </FairysTaroValtioFormItem>
          </FairysTaroValtioForm>

          <FairysTaroValtioForm form={form} bordered lastItemBordered={false} isInvalidBorderRed showColon>
            <FairysTaroValtioFormItem name="name">
              <FairysTaroValtioFormItem name="name">
                <FairysTaroValtioFormItem name="name">
                  <FairysTaroValtioFormItem
                    rules={[{ required: true, message: '请输入用户名' }]}
                    name="name"
                    extra="eee"
                    label="用户名4"
                  >
                    <Input align="right" />
                  </FairysTaroValtioFormItem>
                </FairysTaroValtioFormItem>
              </FairysTaroValtioFormItem>
            </FairysTaroValtioFormItem>
          </FairysTaroValtioForm>

          <FairysTaroValtioForm
            labelMode="top"
            rules={{
              name: [{ required: true, message: '请输入用户名' }],
            }}
            title="这是标题"
            extra="扩展"
            bordered
            lastItemBordered={false}
          >
            <FairysTaroValtioFormItem name="name" extra="eee" label="用户名">
              <Input align="right" />
            </FairysTaroValtioFormItem>
          </FairysTaroValtioForm>
          <FairysTaroValtioForm
            labelMode="left"
            rules={{
              name: [{ required: true, message: '请输入用户名' }],
            }}
            title="这是标题"
            extra="扩展"
            bordered
            lastItemBordered={false}
          >
            <FairysTaroValtioFormItem name="name" extra="eee" label="用户名">
              <Input align="right" />
            </FairysTaroValtioFormItem>
          </FairysTaroValtioForm>
          {/* ================================================================ */}

          <FairysTaroValtioForm
            rules={{
              name: [{ required: true, message: '请输入用户名' }],
            }}
            title="这是标题"
            extra="扩展"
            bordered
            itemBorderType="body"
          >
            <FairysTaroValtioFormItem name="name" extra="eee" label="用户名">
              <Input align="right" />
            </FairysTaroValtioFormItem>
            <FairysTaroValtioFormItem name="name" extra="eee" label="用户名">
              <Input align="right" />
            </FairysTaroValtioFormItem>
          </FairysTaroValtioForm>

          <FairysTaroValtioForm
            rules={{
              name: [{ required: true, message: '请输入用户名' }],
            }}
            title="这是标题"
            extra="扩展"
            bordered
            itemBorderType="body"
            colCount={2}
            labelMode="top"
          >
            <FairysTaroValtioFormItem name="name" extra="eee" label="用户名">
              <Input align="right" />
            </FairysTaroValtioFormItem>
            <FairysTaroValtioFormItem name="name" extra="eee" label="用户名">
              <Input align="right" />
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
