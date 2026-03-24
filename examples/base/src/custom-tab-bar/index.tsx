// import { FairysTaroCustomTabBar, fairysTaroCustomTabBarState } from "@fairys/taro-tools-react"
// import { Component } from 'react'

// const list = [
//   {
//     url: '/pages/home/index',
//     text: '首页',
//   },
//   {
//     url: '/pages/indexcopy/index',
//     text: '功能',
//   },
//   {
//     url: '/pages/indexcopy2/index',
//     text: '我',
//   },
// ]
// fairysTaroCustomTabBarState.onUpdatedItems(list)
// export default class CustomTabBar extends Component {
//   render() {
//     return <FairysTaroCustomTabBar />
//   }
// }
import { Component } from 'react';
import Taro from '@tarojs/taro';
import { CoverView, CoverImage } from '@tarojs/components';

import './index.scss';

export default class Index extends Component {
  state = {
    selected: 0,
    color: '#000000',
    selectedColor: '#DC143C',
    list: [
      {
        pagePath: '/pages/index/index',
        text: '首页',
      },
      {
        pagePath: '/pages/cate/index',
        text: '分类',
      },
      {
        pagePath: '/pages/cart/index',
        text: '购物车',
      },
      {
        pagePath: '/pages/my/index',
        text: '个人中心',
      },
    ],
  };

  switchTab(index, url) {
    this.setSelected(index);
    Taro.switchTab({ url });
  }

  setSelected(idx: number) {
    this.setState({
      selected: idx,
    });
  }

  render() {
    const { list, selected, color, selectedColor } = this.state;

    return (
      <CoverView className="tab-bar">
        <CoverView className="tab-bar-border"></CoverView>
        {list.map((item, index) => {
          return (
            <CoverView key={index} className="tab-bar-item" onClick={this.switchTab.bind(this, index, item.pagePath)}>
              <CoverView style={{ color: selected === index ? selectedColor : color }}>{item.text}</CoverView>
            </CoverView>
          );
        })}
      </CoverView>
    );
  }
}
