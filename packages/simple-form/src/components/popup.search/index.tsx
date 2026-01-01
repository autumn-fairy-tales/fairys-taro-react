import { View, Text } from '@tarojs/components';
import { Popup, TaroPopupProps, Input, Button, Checkbox } from '@nutui/nutui-react-taro';
import { Fragment, useMemo } from 'react';
import clsx from 'clsx';
// import { VirtualList } from '@nutui/nutui-react-taro'
import { useFairysTaroPopupSearchBaseInstance } from './instance';
import type { FairysTaroPopupSearchBaseInstanceMount } from './instance';
import { Cell } from '@nutui/nutui-react-taro';
import { ScrollView } from '@tarojs/components';
import { Search, Del } from '@nutui/icons-react-taro';

/**
 * 如果是多选，怎么移除某几个选中项
 * */

export interface FairysTaroPopupSearchProps<T = any>
  extends Partial<TaroPopupProps>,
    FairysTaroPopupSearchBaseInstanceMount<T> {
  placeholder?: string;
  /**选中项*/
  value?: T | T[];
}

export function FairysTaroPopupSearchBase<T = any>(props: FairysTaroPopupSearchProps<T>) {
  const {
    placeholder = '请选择',
    className,
    style,
    value,
    onChange,
    onLoadData,
    otherRequestParams,
    mode = 'single',
    maxWidth,
    maxHeight,
    renderText,
    ...rest
  } = props;

  const [state, instance] = useFairysTaroPopupSearchBaseInstance<T>();

  instance.maxWidth = maxWidth;
  instance.maxHeight = maxHeight;
  instance.renderText = renderText;
  const operationStatus = state.operationStatus;

  useMemo(() => instance.ctor(), [maxWidth, maxHeight]);

  const visible = state.visible;

  useMemo(() => {
    instance.updateState({ value, _tempValue: value });
  }, [value]);

  const renderTextValue = useMemo(() => {
    if (instance.renderText) {
      return instance.renderText(value);
    }
    if (instance.mode === 'multiple') {
      if (Array.isArray(value)) {
        return value.map((item) => item[instance.displayField]).join(',');
      }
      return '';
    }
    return value?.[instance.displayField];
  }, [value]);

  const clsx_text = useMemo(() => {
    return clsx('fairys-taro-popup-search-text', {
      'fairys-taro-popup-search-text-placeholder fairystaroform__text-gray-600 fairystaroform__font-normal': !value,
      'fairys-taro-popup-search-text-value fairystaroform__text-black': value,
    });
  }, [value]);

  return (
    <View className={`fairys-taro-popup-search ${className || ''}`} style={style}>
      <Text onClick={() => instance.updateState({ visible: true })} className={clsx_text}>
        {renderTextValue || placeholder}
      </Text>
      <Popup
        lockScroll
        position="bottom"
        closeable
        {...rest}
        left={
          mode === 'multiple' ? (
            <Text onClick={instance.updateOperationStatus}>{operationStatus == 'manage' ? '管理' : '完成'}</Text>
          ) : (
            <Fragment />
          )
        }
        visible={visible}
        onClose={instance.onClose}
        overlayClassName="fairys-taro-popup-search-overlay"
        className="fairys-taro-popup-search-content fairystaroform__flex fairystaroform__flex-col fairystaroform__overflow-hidden"
      >
        <View className="fairys-taro-popup-search-content-inner fairystaroform__flex  fairystaroform__flex-1  fairystaroform__flex-col fairystaroform__overflow-hidden">
          <View className="fairys-taro-popup-search-content-header fairystaroform__flex fairystaroform__flex-row fairystaroform__items-center fairystaroform__flex-nowrap fairystaroform__px-1 fairystaroform__box-border fairystaroform__pr-4 fairystaroform__border-b-1 fairystaroform__border-b-solid fairystaroform__border-b-gray-200">
            <Input placeholder="请输入" />
            <View>
              <Search className="fairys-taro-popup-search-content-header-search fairystaroform__text-gray-600 fairystaroform__cursor-pointer" />
            </View>
          </View>
          <View style={{ flex: 1, overflow: 'hidden' }}>
            <ScrollView scrollY style={{ height: instance.popupHeight }}>
              {Array.from({ length: 200 })
                .fill('')
                .map((_, i) => (
                  <Cell key={i}>禁止滚动穿透-{i}</Cell>
                ))}
            </ScrollView>
          </View>
          {mode === 'multiple' ? (
            <View className="fairys-taro-popup-search-content-footer fairystaroform__flex fairystaroform__flex-row fairystaroform__items-center fairystaroform__flex-nowrap fairystaroform__py-2 fairystaroform__box-border  fairystaroform__px-2">
              <View className="fairystaroform__flex-1 fairystaroform__flex fairystaroform__flex-row fairystaroform__items-center fairystaroform__flex-nowrap fairystaroform__justify-between">
                <View className="fairystaroform__flex-1">
                  <Checkbox checked={state.allChecked} onChange={instance.onAllChecked} label="全选" />
                </View>
                {operationStatus === 'select' ? (
                  <View className="fairystaroform__flex-1 fairystaroform__flex fairystaroform__flex-row fairystaroform__items-center fairystaroform__flex-nowrap fairystaroform__justify-start">
                    <Button
                      icon={<Del color="red" />}
                      fill="none"
                      size="mini"
                      type="danger"
                      onClick={() => instance.onDeleteData()}
                    >
                      删除
                    </Button>
                  </View>
                ) : (
                  <Fragment />
                )}
              </View>
              <View className="fairystaroform__flex-1">
                <Button onClick={instance.onSave} block type="primary">
                  确定
                </Button>
              </View>
            </View>
          ) : (
            <Fragment />
          )}
        </View>
      </Popup>
    </View>
  );
}
