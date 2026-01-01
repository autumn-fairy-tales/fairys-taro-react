import { View, Text } from '@tarojs/components';
import { Popup, TaroPopupProps } from '@nutui/nutui-react-taro';
import { Fragment, useMemo } from 'react';
import clsx from 'clsx';
import { useFairysTaroPopupSearchBaseInstance, FairysTaroPopupSearchBaseInstanceContext } from './instance';
import type { FairysTaroPopupSearchBaseInstanceMount } from './instance';
import { FairysTaroPopupSearchFooterBase, FairysTaroPopupSearchInputBase } from './base';
import { FairysTaroPopupSearchListVirtual } from './list.virtual';
import { FairysTaroPopupSearchListTable } from './list.table';

/**
 * 如果是多选，怎么移除某几个选中项
 * */

export interface FairysTaroPopupSearchProps<T = any>
  extends Partial<TaroPopupProps>,
    FairysTaroPopupSearchBaseInstanceMount<T> {
  placeholder?: string;
  /**是否显示删除按钮*/
  showDeleteButton?: boolean;
  /**是否显示搜索框*/
  showSearch?: boolean;
  /**选中项*/
  value?: T | T[];
  /**选择数据*/
  options?: ({
    label?: string;
    value?: string | number;
    [x: string]: any;
  } & T)[];
  /**
   * 最大渲染个数数量
   */
  maxTagCount?: number;
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
    maxWidth,
    maxHeight,
    renderText,
    renderListItemText,
    showDeleteButton = true,
    showSearch = true,
    renderList,
    options,
    columns,
    mode = 'single',
    /**列表项的唯一键值*/
    rowKey = 'value',
    /**提示框 显示字段*/
    displayField = 'label',
    /**渲染类型*/
    renderType = 'list',
    maxTagCount = 5,
    /**表格属性*/
    tableProps = {},
    useTableProps,
    ...rest
  } = props;

  const [state, instance] = useFairysTaroPopupSearchBaseInstance<T>();

  instance.maxWidth = maxWidth;
  instance.maxHeight = maxHeight;
  instance.renderText = renderText;
  instance.renderList = renderList;
  instance.onLoadData = onLoadData;
  instance.otherRequestParams = otherRequestParams;
  instance.onChange = onChange;
  instance.renderListItemText = renderListItemText;
  instance.tableProps = tableProps;
  instance.useTableProps = useTableProps;

  instance.rowKey = rowKey;
  instance.displayField = displayField;
  instance.mode = mode;
  instance.columns = columns;
  instance.renderType = renderType;

  const operationStatus = state.operationStatus;
  const visible = state.visible;

  useMemo(() => instance.ctor(), [maxWidth, maxHeight]);

  useMemo(() => instance.updateState({ value, _tempValue: value }), [value]);
  useMemo(() => instance.updateState({ dataList: options || [], _tempFilterDataList: options || [] }), [options]);
  useMemo(() => instance.updateState({ mode }), [mode]);
  useMemo(() => instance.updateState({ columns }), [columns]);

  const renderTextValue = useMemo(() => {
    if (instance.renderText) {
      return instance.renderText(value);
    }
    if (instance.mode === 'multiple') {
      if (Array.isArray(value)) {
        if (value.length > maxTagCount) {
          return `${value
            .slice(0, maxTagCount)
            .map((item) => item[instance.displayField])
            .join(',')}...`;
        }
        return value.map((item) => item[instance.displayField]).join(',');
      }
      return '';
    }
    return value?.[instance.displayField];
  }, [value, mode, maxTagCount]);

  const clsx_text = useMemo(() => {
    // 文本溢出显示...
    return clsx('fairys-taro-popup-search-text', {
      'fairys-taro-popup-search-text-placeholder fairystaroform__text-gray-600 fairystaroform__font-normal': !value,
      'fairys-taro-popup-search-text-value fairystaroform__text-black': value,
    });
  }, [value]);

  return (
    <View className={`fairys-taro-popup-search ${className || ''}`} style={style}>
      <View className="fairys-taro-popup-search-text-container fairystaroform__break-all">
        <Text onClick={() => instance.updateState({ visible: true })} className={clsx_text}>
          {renderTextValue || placeholder}
        </Text>
      </View>
      <Popup
        lockScroll
        position="bottom"
        closeable
        {...rest}
        left={
          mode === 'multiple' ? (
            <Text onClick={instance.updateOperationStatus}>{operationStatus == 'select' ? '管理' : '完成'}</Text>
          ) : (
            <Fragment />
          )
        }
        visible={visible}
        onClose={instance.onClose}
        overlayClassName="fairys-taro-popup-search-overlay"
        className="fairys-taro-popup-search-content fairystaroform__flex fairystaroform__flex-col fairystaroform__overflow-hidden"
      >
        <FairysTaroPopupSearchBaseInstanceContext.Provider value={instance}>
          <View className="fairys-taro-popup-search-content-inner fairystaroform__flex  fairystaroform__flex-1  fairystaroform__flex-col fairystaroform__overflow-hidden">
            {showSearch ? <FairysTaroPopupSearchInputBase /> : <Fragment />}
            <View style={{ flex: 1, overflow: 'hidden' }}>
              {renderType === 'list' ? (
                <FairysTaroPopupSearchListVirtual />
              ) : renderType === 'table' ? (
                <FairysTaroPopupSearchListTable />
              ) : (
                <Fragment />
              )}
            </View>
            {mode === 'multiple' ? <FairysTaroPopupSearchFooterBase /> : <Fragment />}
          </View>
        </FairysTaroPopupSearchBaseInstanceContext.Provider>
      </Popup>
    </View>
  );
}
