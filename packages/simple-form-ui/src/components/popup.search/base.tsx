import { View } from '@tarojs/components';
import { Button, Checkbox, Input, ConfigProvider, Loading } from '@nutui/nutui-react-taro';
import { Fragment } from 'react';
import { useFairysTaroPopupSearchBaseInstanceContext } from './instance';
import { Del, Search } from '@nutui/icons-react-taro';

export function FairysTaroPopupSearchFooterBase<T = any>() {
  const [state, instance] = useFairysTaroPopupSearchBaseInstanceContext<T>();
  const operationStatus = state.operationStatus;
  return (
    <View className="fairys-taro-popup-search-content-footer fairystaroform__flex fairystaroform__flex-row fairystaroform__items-center fairystaroform__flex-nowrap fairystaroform__py-2 fairystaroform__box-border  fairystaroform__px-2">
      <View className="fairystaroform__flex-1 fairystaroform__flex fairystaroform__flex-row fairystaroform__items-center fairystaroform__flex-nowrap fairystaroform__justify-between">
        <View className="fairystaroform__flex-1">
          <Checkbox checked={state.allChecked} onChange={instance.onAllChecked} label="全选" />
        </View>
        {operationStatus === 'manage' ? (
          <View className="fairystaroform__flex-1 fairystaroform__flex fairystaroform__flex-row fairystaroform__items-center fairystaroform__flex-nowrap fairystaroform__justify-end">
            <Button icon={<Del color="#fff" />} type="danger" onClick={() => instance.onDeleteData()}>
              删除
            </Button>
          </View>
        ) : (
          <Fragment />
        )}
      </View>
      {operationStatus === 'select' ? (
        <View className="fairystaroform__flex-1">
          <Button onClick={instance.onSave} block type="primary">
            确定
          </Button>
        </View>
      ) : (
        <Fragment />
      )}
    </View>
  );
}

export function FairysTaroPopupSearchInputBase<T = any>() {
  const [state, instance] = useFairysTaroPopupSearchBaseInstanceContext<T>({ sync: true });
  const search = state.search || '';
  const loading = state.loading;

  return (
    <View className="fairys-taro-popup-search-content-header fairystaroform__flex fairystaroform__flex-row fairystaroform__items-center fairystaroform__flex-nowrap fairystaroform__px-1 fairystaroform__box-border fairystaroform__pr-4 fairystaroform__border-b-1 fairystaroform__border-b-solid fairystaroform__border-b-gray-200">
      <Input placeholder="请输入" value={search} onChange={instance.onSearch} />
      <View className="fairystaroform__flex fairystaroform__flex-row fairystaroform__items-center" style={{ gap: 4 }}>
        {loading ? (
          <ConfigProvider
            theme={{
              nutuiLoadingIconColor: '#396aca',
              nutuiLoadingIconSize: '24px',
            }}
          >
            <Loading type="spinner" />
          </ConfigProvider>
        ) : (
          <Fragment />
        )}
        <Search className="fairys-taro-popup-search-content-header-search fairystaroform__text-gray-600 fairystaroform__cursor-pointer" />
      </View>
    </View>
  );
}
