import { View, Text, Button } from '@tarojs/components';
import { useLoad } from '@tarojs/taro';
import { FairysTaroMessage, FairysTaroMessageItem, connectToastMessage } from '@fairys/taro-tools-react';
import './index.scss';
import { globalDataInstance } from '@fairys/taro-tools-react/esm/context/global.data.instance';

function Index() {
  useLoad(() => {
    console.log('Page loaded.');
  });
  return (
    <View className="index">
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
      <FairysTaroMessage>
        <FairysTaroMessageItem>这是一条提示信息这</FairysTaroMessageItem>
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
    </View>
  );
}
export default connectToastMessage(Index);
