import { View, Text } from '@tarojs/components';
import { useLoad } from '@tarojs/taro';
import {
  FairysTaroMessage,
  FairysTaroMessageItem,
  connectToastMessage,
  FairysTaroLoading,
  FairysTaroMainPage,
  FairysTaroMainPageSearch,
  FairysTaroMainPageBody,
  FairysTaroMainPageFooter,
  globalMessageDataInstance,
} from '@fairys/taro-tools-react';
import { Button } from '@nutui/nutui-react-taro';
// import { globalMessageDataInstance } from '@fairys/taro-tools-react/esm/context/global.data.instance';
import { FairysTaroSimpleForm } from '@fairys/taro-tools-simple-form';

function Index() {
  const form = FairysTaroSimpleForm.useForm();

  const onSubmit = () => {
    form
      .validate()
      .then((values) => {
        console.log(values);
        globalMessageDataInstance.showMessage({
          type: 'success',
          content: '表单成功',
        });
      })
      .catch((error) => {
        globalMessageDataInstance.showMessage({
          type: 'error',
          content: error.message || '表单校验失败',
        });
      });
  };

  return (
    <FairysTaroMainPage>
      {/* <FairysTaroLoading tips="加载中" loading /> */}
      <FairysTaroMainPageSearch>
        <FairysTaroSimpleForm form={form}>
          <FairysTaroSimpleForm.Item label="dd" name="dd" type="input" attrs={{ placeholder: '请输入dd' }} />
          <FairysTaroSimpleForm.Item label="dd" name="dd" type="inputNumber" />
          <FairysTaroSimpleForm.Item label="用户名" name="username" type="fairysCalendar" />
          <FairysTaroSimpleForm.Item
            label="级联选择器"
            name="cascader"
            type="fairysCascader"
            rules={[{ required: true, message: '请选择级联选择器' }]}
            attrs={{
              options: [
                { value: 'A0', text: 'A0_1' },
                {
                  value: 'B0',
                  text: 'B0_1',
                  children: [
                    { value: 'B11', text: 'B11_1', leaf: true },
                    { value: 'B12', text: 'B12_1' },
                  ],
                },
                { value: 'C0', text: 'C0_1' },
              ],
            }}
          />
          <FairysTaroSimpleForm.Item
            label="复选框组"
            name="checkboxGroup"
            type="fairysCheckboxGroup"
            rules={[{ required: true, message: '请选择复选框组' }]}
            attrs={{
              items: [
                { value: 'A0', label: 'A0_1' },
                { value: 'B0', label: 'B0_1' },
                { value: 'C0', label: 'C0_1' },
              ],
            }}
          />
          <FairysTaroSimpleForm.Item
            label="日期选择器"
            name="datePicker"
            type="fairysDatePicker"
            rules={[{ required: true, message: '请选择日期选择器' }]}
            attrs={{
              type: 'datetime',
            }}
          />
          <FairysTaroSimpleForm.Item
            label="选择器"
            name="picker"
            type="fairysPicker"
            attrs={{
              options: [
                // 第一列
                [
                  { label: '周一', value: 'Monday' },
                  { label: '周二', value: 'Tuesday' },
                  { label: '周三', value: 'Wednesday' },
                  { label: '周四', value: 'Thursday' },
                  { label: '周五', value: 'Friday' },
                ],
                // 第二列
                [
                  { label: '上午', value: 'Morning' },
                  { label: '下午', value: 'Afternoon' },
                  { label: '晚上', value: 'Evening' },
                ],
              ],
            }}
          />
          <FairysTaroSimpleForm.Item
            label="搜索选择器"
            name="popupSearch"
            type="fairysPopupSearch"
            attrs={{
              placeholder: '请选择',
              mode: 'single',
              options: [
                { value: 'A0', label: 'A0_1' },
                { value: 'B0', label: 'B0_1' },
                { value: 'C0', label: 'C0_1' },
                { value: 'D0', label: 'D0_1' },
                { value: 'E0', label: 'E0_1' },
                { value: 'F0', label: 'F0_1' },
                { value: 'G0', label: 'G0_1' },
                { value: 'H0', label: 'H0_1' },
                { value: 'I0', label: 'I0_1' },
                { value: 'J0', label: 'J0_1' },
                { value: 'K0', label: 'K0_1' },
                { value: 'L0', label: 'L0_1' },
                { value: 'M0', label: 'M0_1' },
              ],
            }}
          />
          <FairysTaroSimpleForm.Item
            label="搜索选择器(表格)"
            name="popupSearch-table"
            type="fairysPopupSearch"
            attrs={{
              placeholder: '请选择',
              mode: 'single',
              renderType: 'table',
              columns: [
                { title: '选项值', key: 'value' },
                { title: '选项标签', key: 'label' },
              ],
              options: [
                { value: 'A0', label: 'A0_1' },
                { value: 'B0', label: 'B0_1' },
                { value: 'C0', label: 'C0_1' },
                { value: 'D0', label: 'D0_1' },
                { value: 'E0', label: 'E0_1' },
                { value: 'F0', label: 'F0_1' },
                { value: 'G0', label: 'G0_1' },
                { value: 'H0', label: 'H0_1' },
                { value: 'I0', label: 'I0_1' },
                { value: 'J0', label: 'J0_1' },
                { value: 'K0', label: 'K0_1' },
                { value: 'L0', label: 'L0_1' },
                { value: 'M0', label: 'M0_1' },
              ],
            }}
          />

          <FairysTaroSimpleForm.Item
            label="多选搜索选择器"
            name="m-popupSearch"
            type="fairysPopupSearch"
            attrs={{
              placeholder: '请选择',
              mode: 'multiple',
              options: [
                { value: 'A0', label: 'A0_1' },
                { value: 'B0', label: 'B0_1' },
                { value: 'C0', label: 'C0_1' },
                { value: 'D0', label: 'D0_1' },
                { value: 'E0', label: 'E0_1' },
                { value: 'F0', label: 'F0_1' },
                { value: 'G0', label: 'G0_1' },
                { value: 'H0', label: 'H0_1' },
                { value: 'I0', label: 'I0_1' },
                { value: 'J0', label: 'J0_1' },
                { value: 'K0', label: 'K0_1' },
                { value: 'L0', label: 'L0_1' },
                { value: 'M0', label: 'M0_1' },
              ],
            }}
          />
          <FairysTaroSimpleForm.Item
            label="多选搜索选择器2"
            name="m-popupSearch2"
            type="fairysPopupSearch"
            attrs={{
              placeholder: '请选择',
              mode: 'multiple',
              isNeedManage: true,
              options: [
                { value: 'A0', label: 'A0_1' },
                { value: 'B0', label: 'B0_1' },
                { value: 'C0', label: 'C0_1' },
                { value: 'D0', label: 'D0_1' },
                { value: 'E0', label: 'E0_1' },
                { value: 'F0', label: 'F0_1' },
                { value: 'G0', label: 'G0_1' },
                { value: 'H0', label: 'H0_1' },
                { value: 'I0', label: 'I0_1' },
                { value: 'J0', label: 'J0_1' },
                { value: 'K0', label: 'K0_1' },
                { value: 'L0', label: 'L0_1' },
                { value: 'M0', label: 'M0_1' },
              ],
            }}
          />
          <FairysTaroSimpleForm.Item
            label="多选搜索选择器(表格)"
            name="m-popupSearch-table"
            type="fairysPopupSearch"
            attrs={{
              placeholder: '请选择',
              mode: 'multiple',
              renderType: 'table',
              isNeedManage: true,
              columns: [
                { title: '选项值', key: 'value' },
                { title: '选项标签', key: 'label' },
              ],
              options: [
                { value: 'A0', label: 'A0_1' },
                { value: 'B0', label: 'B0_1' },
                { value: 'C0', label: 'C0_1' },
                { value: 'D0', label: 'D0_1' },
                { value: 'E0', label: 'E0_1' },
                { value: 'F0', label: 'F0_1' },
                { value: 'G0', label: 'G0_1' },
                { value: 'H0', label: 'H0_1' },
                { value: 'I0', label: 'I0_1' },
                { value: 'J0', label: 'J0_1' },
                { value: 'K0', label: 'K0_1' },
                { value: 'L0', label: 'L0_1' },
                { value: 'M0', label: 'M0_1' },
              ],
            }}
          />
        </FairysTaroSimpleForm>
        <Button
          onClick={() => {
            console.log('点击了按钮');
            globalMessageDataInstance.showToast({
              content: '这是一条提示信息',
            });
          }}
        >
          点击
        </Button>
        <Button
          onClick={() => {
            console.log('点击了按钮');
            globalMessageDataInstance.showMessage({
              content: '这是一条提示信息',
            });
          }}
        >
          点击2
        </Button>
        <Text>Hello world!</Text>
      </FairysTaroMainPageSearch>
      <FairysTaroMainPageBody>
        <FairysTaroMessage>
          <FairysTaroMessageItem icon="ant-design--account-book-filled" type="success">
            这是一条提示信息这
          </FairysTaroMessageItem>
          <FairysTaroMessageItem iconColor="red" icon="ant-design--account-book-filled" type="success">
            这是一条提示信息这
          </FairysTaroMessageItem>
          <FairysTaroMessageItem
            iconColor="red"
            borderColor="red"
            icon="ant-design--account-book-filled"
            type="success"
          >
            这是一条提示信息这
          </FairysTaroMessageItem>
          <FairysTaroMessageItem
            iconColor="red"
            borderColor="red"
            backgroundColor="gray"
            icon="ant-design--account-book-filled"
            type="success"
          >
            这是一条提示信息这
          </FairysTaroMessageItem>
          <FairysTaroMessageItem
            iconColor="red"
            borderColor="red"
            backgroundColor="gray"
            color="white"
            icon="ant-design--account-book-filled"
            type="success"
          >
            这是一条提示信息这
          </FairysTaroMessageItem>
          <FairysTaroMessageItem showIcon={false}>这是一条提示信息这</FairysTaroMessageItem>
          <FairysTaroMessageItem title="提示信息">这是一条提示信息这</FairysTaroMessageItem>
          <FairysTaroMessageItem type="success" title="成功信息">
            这是一条成功信息这是一条成功信息这是一条成功信息这是一条成功信息这是一条成功信息
          </FairysTaroMessageItem>
          <FairysTaroMessageItem type="error">
            这是一条错误信息这是一条错误信息这是一条错误信息这是一条错误信息这是一条错误信息
          </FairysTaroMessageItem>
          <FairysTaroMessageItem type="warning">
            这是一条警告信息这是一条警告信息这是一条警告信息这是一条警告信息这是一条警告信息
          </FairysTaroMessageItem>
          <FairysTaroMessageItem>
            这是一条提示信息这是一条提示信息这是一条提示信息这是一条提示信息这是一条提示信息
          </FairysTaroMessageItem>
          <FairysTaroMessageItem type="success">
            这是一条成功信息这是一条成功信息这是一条成功信息这是一条成功信息这是一条成功信息
          </FairysTaroMessageItem>
          <FairysTaroMessageItem type="error">
            这是一条错误信息这是一条错误信息这是一条错误信息这是一条错误信息这是一条错误信息
          </FairysTaroMessageItem>
          <FairysTaroMessageItem type="warning">
            这是一条警告信息这是一条警告信息这是一条警告信息这是一条警告信息这是一条警告信息
          </FairysTaroMessageItem>
          <FairysTaroMessageItem>
            这是一条提示信息这是一条提示信息这是一条提示信息这是一条提示信息这是一条提示信息
          </FairysTaroMessageItem>
          <FairysTaroMessageItem type="success">
            这是一条成功信息这是一条成功信息这是一条成功信息这是一条成功信息这是一条成功信息
          </FairysTaroMessageItem>
          <FairysTaroMessageItem type="error">
            这是一条错误信息这是一条错误信息这是一条错误信息这是一条错误信息这是一条错误信息
          </FairysTaroMessageItem>
          <FairysTaroMessageItem type="warning">
            这是一条警告信息这是一条警告信息这是一条警告信息这是一条警告信息这是一条警告信息
          </FairysTaroMessageItem>
          <FairysTaroMessageItem>
            这是一条提示信息这是一条提示信息这是一条提示信息这是一条提示信息这是一条提示信息
          </FairysTaroMessageItem>
          <FairysTaroMessageItem type="success">
            这是一条成功信息这是一条成功信息这是一条成功信息这是一条成功信息这是一条成功信息
          </FairysTaroMessageItem>
          <FairysTaroMessageItem type="error">
            这是一条错误信息这是一条错误信息这是一条错误信息这是一条错误信息这是一条错误信息
          </FairysTaroMessageItem>
          <FairysTaroMessageItem type="warning">
            这是一条警告信息这是一条警告信息这是一条警告信息这是一条警告信息这是一条警告信息
          </FairysTaroMessageItem>
          <FairysTaroMessageItem>
            这是一条提示信息这是一条提示信息这是一条提示信息这是一条提示信息这是一条提示信息
          </FairysTaroMessageItem>
          <FairysTaroMessageItem type="success">
            这是一条成功信息这是一条成功信息这是一条成功信息这是一条成功信息这是一条成功信息
          </FairysTaroMessageItem>
          <FairysTaroMessageItem type="error">
            这是一条错误信息这是一条错误信息这是一条错误信息这是一条错误信息这是一条错误信息
          </FairysTaroMessageItem>
          <FairysTaroMessageItem type="warning">
            这是一条警告信息这是一条警告信息这是一条警告信息这是一条警告信息这是一条警告信息
          </FairysTaroMessageItem>
          <FairysTaroMessageItem>
            这是一条提示信息这是一条提示信息这是一条提示信息这是一条提示信息这是一条提示信息
          </FairysTaroMessageItem>
          <FairysTaroMessageItem type="success">
            这是一条成功信息这是一条成功信息这是一条成功信息这是一条成功信息这是一条成功信息
          </FairysTaroMessageItem>
          <FairysTaroMessageItem type="error">
            这是一条错误信息这是一条错误信息这是一条错误信息这是一条错误信息这是一条错误信息
          </FairysTaroMessageItem>
          <FairysTaroMessageItem type="warning">
            这是一条警告信息这是一条警告信息这是一条警告信息这是一条警告信息这是一条警告信息
          </FairysTaroMessageItem>
          <FairysTaroMessageItem>
            这是一条提示信息这是一条提示信息这是一条提示信息这是一条提示信息这是一条提示信息
          </FairysTaroMessageItem>
          <FairysTaroMessageItem type="success">
            这是一条成功信息这是一条成功信息这是一条成功信息这是一条成功信息这是一条成功信息
          </FairysTaroMessageItem>
          <FairysTaroMessageItem type="error">
            这是一条错误信息这是一条错误信息这是一条错误信息这是一条错误信息这是一条错误信息
          </FairysTaroMessageItem>
          <FairysTaroMessageItem type="warning">
            这是一条警告信息这是一条警告信息这是一条警告信息这是一条警告信息这是一条警告信息
          </FairysTaroMessageItem>
        </FairysTaroMessage>
      </FairysTaroMainPageBody>
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
