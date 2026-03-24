import { FairysTaroCustomTabBar, fairysTaroCustomTabBarState } from '@fairys/taro-tools-react';
import { Component } from 'react';
import './index.scss';

const list = [
  {
    url: '/pages/index/index',
    text: '首页',
  },
  {
    url: '/pages/indexcopy/index',
    text: '功能',
  },
  {
    url: '/pages/indexcopy2/index',
    text: '我',
  },
];
fairysTaroCustomTabBarState.selected = list[0].url;
fairysTaroCustomTabBarState.onUpdatedItems(list);
export default class CustomTabBar extends Component {
  render() {
    return <FairysTaroCustomTabBar />;
  }
}
