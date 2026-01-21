import { View, Text } from '@tarojs/components';
import { Popup, TaroPopupProps } from '@nutui/nutui-react-taro';
import { Fragment, useEffect, useMemo } from 'react';
import {
  useFairysTaroPopupSearchBaseInstance,
  FairysTaroPopupSearchBaseInstanceContext,
  useFairysTaroPopupSearchBaseInstanceContext,
} from './instance';
import type { FairysTaroPopupSearchBaseInstanceMount } from './instance';
import { FairysTaroPopupSearchFooterBase, FairysTaroPopupSearchInputBase } from './base';
import { FairysTaroPopupSearchListVirtual } from './list.virtual';
import { FairysTaroPopupSearchListTable } from './list.table';
import { FairysTaroTextClearBase } from 'components/clear';

/**
 * 如果是多选，怎么移除某几个选中项
 * */

export interface FairysTaroPopupSearchProps<T = any>
  extends Partial<TaroPopupProps>,
    FairysTaroPopupSearchBaseInstanceMount<T> {
  placeholder?: string;
}

function RenderList<T = any>() {
  const [state, instance] = useFairysTaroPopupSearchBaseInstanceContext<T>();
  const renderList = instance.renderList;
  const _tempFilterDataList = state._tempFilterDataList as T[];
  const operationStatus = state.operationStatus;
  return renderList?.(_tempFilterDataList || [], operationStatus, instance) || <Fragment />;
}

function FairysTaroPopupSearchBodyBase<T = any>() {
  const [state, instance] = useFairysTaroPopupSearchBaseInstanceContext<T>();
  const renderType = instance.renderType;
  const showSearch = instance.showSearch;
  const mode = instance.mode;
  const columns = instance.columns;
  const options = instance.options;
  const isNeedManage = instance.isNeedManage;
  const value = instance.value;
  const visible = state.visible;

  useMemo(() => {
    if (isNeedManage || instance.isUseOptions()) {
      instance.updateState({ value, _tempValue: value });
    } else {
      instance.updateState({ value, _tempValue: undefined });
    }
  }, [value, isNeedManage, visible]);

  useMemo(() => instance.updateState({ dataList: options || [], _tempFilterDataList: options || [] }), [options]);
  useMemo(() => instance.updateState({ mode }), [mode]);
  useMemo(() => instance.updateState({ columns }), [columns]);

  useEffect(() => {
    if (visible && typeof instance.onLoadData === 'function') {
      instance.onSearch('', 0);
    }
  }, [visible]);

  return (
    <View className="fairys-taro-popup-search-content-inner fairystaroform__flex  fairystaroform__flex-1  fairystaroform__flex-col fairystaroform__overflow-hidden">
      {showSearch ? <FairysTaroPopupSearchInputBase /> : <Fragment />}
      <View style={{ flex: 1, overflow: 'hidden' }}>
        {renderType === 'list' ? (
          <FairysTaroPopupSearchListVirtual<T> />
        ) : renderType === 'table' ? (
          <FairysTaroPopupSearchListTable<T> />
        ) : renderType === 'custom' ? (
          <RenderList<T> />
        ) : (
          <Fragment />
        )}
      </View>
      {mode === 'multiple' ? <FairysTaroPopupSearchFooterBase<T> /> : <Fragment />}
    </View>
  );
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
    showRowDeleteButton = true,
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
    maxTagCount = 9,
    /**表格属性*/
    tableProps = {},
    useTableProps,
    isNeedManage = false,
    isUseOptionsChecked = true,
    /**第一次成功加载后，根据 options 参数处理*/
    isFirstLoadAfterOptions = false,
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
  instance.isNeedManage = isNeedManage;
  instance.isUseOptionsChecked = isUseOptionsChecked;
  instance.isFirstLoadAfterOptions = isFirstLoadAfterOptions;

  instance.rowKey = rowKey;
  instance.displayField = displayField;
  instance.mode = mode;
  instance.columns = columns;
  instance.renderType = renderType;

  instance.showRowDeleteButton = showRowDeleteButton;
  instance.showSearch = showSearch;
  instance.maxTagCount = maxTagCount;
  instance.options = options;
  instance.value = value;

  const operationStatus = state.operationStatus;
  const visible = state.visible;

  useMemo(() => instance.ctor(), [maxWidth, maxHeight]);

  const renderTextValue = useMemo(() => {
    if (instance.renderText) {
      return instance.renderText(value, instance);
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

  return (
    <View className={`fairys-taro-popup-search ${className || ''}`} style={style}>
      <FairysTaroTextClearBase
        warpClassName="fairys-taro-popup-search-text-container"
        isValue={!!renderTextValue}
        onTextClick={() => instance.updateState({ visible: true })}
        onClearClick={() => onChange?.(undefined)}
      >
        {renderTextValue || placeholder}
      </FairysTaroTextClearBase>
      <Popup
        lockScroll
        position="bottom"
        closeable
        {...rest}
        left={
          mode === 'multiple' && isNeedManage ? (
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
          {visible ? <FairysTaroPopupSearchBodyBase<T> /> : <Fragment />}
        </FairysTaroPopupSearchBaseInstanceContext.Provider>
      </Popup>
    </View>
  );
}
