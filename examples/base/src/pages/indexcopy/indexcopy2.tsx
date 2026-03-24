import {
  connectToastMessage,
  FairysTaroMainPage,
  FairysTaroMainPageSearch,
  FairysTaroMainPageBody,
  FairysTaroMainPageFooter,
} from '@fairys/taro-tools-react';
import { Button, Input } from '@nutui/nutui-react-taro';
import { FairysTaroValtioFormItem, FairysTaroValtioForm } from '@fairys/taro-tools-simple-form-ui';

function Index() {
  const form = FairysTaroValtioForm.useForm();
  const form2 = FairysTaroValtioForm.useForm();
  const onSubmit = async () => {
    try {
      await form.validate();
    } catch (error) {}
    try {
      await form2.validate();
    } catch (error) {}
  };

  return (
    <FairysTaroMainPage>
      <FairysTaroMainPageSearch style={{ padding: 20 }}></FairysTaroMainPageSearch>
      <FairysTaroMainPageBody style={{ padding: 20 }}>
        <FairysTaroValtioForm bordered isInvalidBorderRed isInvalidTextRed lastItemBordered={false} form={form2}>
          <FairysTaroValtioForm.FormItemConfig label="dd" name="dd" type="input" attrs={{ placeholder: '请输入dd' }} />
          <FairysTaroValtioForm.FormItemConfig label="dd" name="dd" type="inputNumber" />
          <FairysTaroValtioForm.FormItemConfig label="用户名" name="username" type="fairysCalendar" />
          <FairysTaroValtioForm.FormItemConfig
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
          <FairysTaroValtioForm.FormItemConfig
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
          <FairysTaroValtioForm.FormItemConfig
            label="日期选择器"
            name="datePicker"
            type="fairysDatePicker"
            rules={[{ required: true, message: '请选择日期选择器' }]}
            attrs={{
              type: 'datetime',
            }}
          />
          <FairysTaroValtioForm.FormItemConfig
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
          <FairysTaroValtioForm.FormItemConfig
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
          <FairysTaroValtioForm.FormItemConfig
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

          <FairysTaroValtioForm.FormItemConfig
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
          <FairysTaroValtioForm.FormItemConfig
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
          <FairysTaroValtioForm.FormItemConfig
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
        </FairysTaroValtioForm>
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
