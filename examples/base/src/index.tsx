import { PropsWithChildren } from 'react';
import { useLaunch } from '@tarojs/taro';

import './app.scss';
import { View, Text } from '@tarojs/components';

function Main({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('Main launched.');
  });

  // children 是将要会渲染的页面
  return (
    <View>
      <Text>Main</Text>
      {children}
    </View>
  );
}
export default Main;
