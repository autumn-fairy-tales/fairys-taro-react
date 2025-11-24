import { View, Text, Button } from '@tarojs/components';
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
} from '@fairys/taro-tools-react';
import './index.scss';
import { globalDataInstance } from '@fairys/taro-tools-react/esm/context/global.data.instance';

function Index() {
  useLoad(() => {
    console.log('Page loaded.');
  });
  return (
    <FairysTaroMainPage>
      {/* <FairysTaroLoading tips="加载中" loading /> */}
      <FairysTaroMainPageSearch>
        <Button
          onClick={() => {
            console.log('点击了按钮');
            globalDataInstance.showToast({
              content: '这是一条提示信息',
            });
          }}
        >
          点击
        </Button>
        <Button
          onClick={() => {
            console.log('点击了按钮');
            globalDataInstance.showMessage({
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
      <FairysTaroMainPageFooter>12</FairysTaroMainPageFooter>
    </FairysTaroMainPage>
  );
}
export default connectToastMessage(Index);
