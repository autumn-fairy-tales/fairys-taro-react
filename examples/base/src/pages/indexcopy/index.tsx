import {
  connectToastMessage,
  FairysTaroMainPage,
  FairysTaroMainPageSearch,
  FairysTaroMainPageBody,
  FairysTaroMainPageFooter,
  FairysTaroMainPageScrollView,
} from '@fairys/taro-tools-react';
import { Button } from '@nutui/nutui-react-taro';
import { ScrollView } from '@tarojs/components';
import { useState } from 'react';

function Index() {
  // 测试下拉刷新、上拉加载、整个页面下拉刷新
  const [refresherTriggered, setRefresherTriggered] = useState(false);
  const [refresherTriggered1, setRefresherTriggered1] = useState(false);
  const [refresherTriggered2, setRefresherTriggered2] = useState(false);

  return (
    <FairysTaroMainPageScrollView
      refresherStatus={refresherTriggered}
      onScrollToUpper={() => {
        console.log('顶部触发');
      }}
      onScrollToLower={() => {
        console.log('底部加载');
      }}
      onRefresherRefresh={() => {
        console.log('刷新');
        setRefresherTriggered(true);
        setTimeout(() => {
          setRefresherTriggered(false);
        }, 2000);
      }}
    >
      <FairysTaroMainPage style={{ height: '100vh' }}>
        <FairysTaroMainPageSearch style={{ padding: 20 }}>查询</FairysTaroMainPageSearch>
        <FairysTaroMainPageBody style={{ padding: 20 }}>
          <ScrollView
            style={{ height: 500, border: '1px solid #ccc', padding: 20, boxSizing: 'border-box' }}
            scrollY
            refresherEnabled
            enhanced
            usingSticky
            refresherTriggered={refresherTriggered1}
            onScrollToUpper={() => {
              console.log('顶部触发');
            }}
            onScrollToLower={() => {
              console.log('底部加载');
            }}
            // onRefresherPulling={() => {
            //   console.log('下拉刷新')
            // }}
            onRefresherRefresh={() => {
              console.log('刷新');
              setRefresherTriggered1(true);
              setTimeout(() => {
                setRefresherTriggered1(false);
              }, 2000);
            }}
            // onRefresherStatusChange={(status) => {
            //   console.log(status)
            // }}
          >
            <div style={{ height: '100vh' }}>
              <div style={{ height: '200vh' }}>1 下拉刷新、上拉加载、整个页面下拉刷新测试</div>
            </div>
            <ScrollView
              style={{ height: 200, border: '1px solid #ccc' }}
              scrollY
              refresherEnabled
              enhanced
              usingSticky
              refresherTriggered={refresherTriggered2}
              onScrollToUpper={() => {
                console.log('顶部触发');
              }}
              onScrollToLower={() => {
                console.log('底部加载');
              }}
              onRefresherRefresh={() => {
                console.log('刷新');
                setRefresherTriggered2(true);
                setTimeout(() => {
                  setRefresherTriggered2(false);
                }, 2000);
              }}
            >
              <div style={{ height: '100vh' }}>
                <div style={{ height: '200vh' }}>2 下拉刷新、上拉加载、整个页面下拉刷新测试</div>
              </div>
            </ScrollView>
          </ScrollView>
        </FairysTaroMainPageBody>
        <FairysTaroMainPageFooter
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0.3rem 0.5rem' }}
        >
          <Button block type="primary">
            提交
          </Button>
        </FairysTaroMainPageFooter>
      </FairysTaroMainPage>
    </FairysTaroMainPageScrollView>
  );
}
export default connectToastMessage(Index);
