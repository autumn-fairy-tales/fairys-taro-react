import { PropsWithChildren } from 'react';
import { useLaunch } from '@tarojs/taro';
import { connectToastMessage } from '@fairys/taro-tools-react';
import '@nutui/nutui-react-taro/dist/style.css';
import '@fairys/taro-tools-react/esm/styles/index.css';
import '@fairys/taro-tools-simple-form-ui/esm/styles/index.css';
import '@fairys/valtio-form/esm/styles/index.css';
import './app.scss';

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('App launched.');
  });
  // children 是将要会渲染的页面
  return children;
}

export default connectToastMessage(App, { isRoot: true });
