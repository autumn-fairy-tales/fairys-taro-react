export default defineAppConfig({
  pages: ['pages/index/index', 'pages/indexcopy/index', 'pages/indexcopy2/index'],
  tabBar: {
    custom: true, // 启用自定义 tabBar
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
      },
      {
        pagePath: 'pages/indexcopy/index',
        text: '功能',
      },
      {
        pagePath: 'pages/indexcopy2/index',
        text: '我',
      },
    ],
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
});
