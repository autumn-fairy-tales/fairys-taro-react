import { Cell, Checkbox, Button } from '@nutui/nutui-react-taro';
import { Del } from '@nutui/icons-react-taro';
import { ScrollView } from '@tarojs/components';

/**虚拟列表*/
/**
 * 如果是表格，需要计算每一列的宽度 选中(第一列固定)和删除(最后一列固定)按钮
 * 不是表格，则直接渲染行数，每一行添加 选中和删除按钮
 */
import { useFairysTaroPopupSearchBaseInstanceContext } from './instance';
import { Fragment, useMemo } from 'react';

function VirtualListItem<T = any>(props: { rowData: T; dataIndex: number; index: number }) {
  const { rowData } = props;
  const [state, instance] = useFairysTaroPopupSearchBaseInstanceContext();
  const renderListItemText = instance.renderListItemText;
  const _tempValue = state._tempValue;
  const operationStatus = state.operationStatus;
  const manageSelectedDataList = state.manageSelectedDataList;
  const showRowDeleteButton = instance.showRowDeleteButton;
  const renderText = useMemo(() => {
    return renderListItemText?.(rowData, instance) || rowData[instance.displayField];
  }, [rowData, instance.displayField, renderListItemText]);

  const checked = useMemo(
    () => instance.isCheckedData(rowData),
    [rowData, _tempValue, operationStatus, manageSelectedDataList],
  );

  return (
    <Cell
      className="fairys-taro-popup-search-list-virtual-cell fairystaroform__px-[0.75rem]! fairystaroform__py-[0.5rem]! fairystaroform__mx-0 fairystaroform__my-[0.1rem]!"
      onClick={(event) => {
        event?.stopPropagation?.();
        event?.preventDefault?.();
        instance.onCheckedData(rowData, checked);
      }}
      title={
        <Checkbox className="fairys-taro-popup-search-list-virtual-checkbox fairystaroform__flex-1" checked={checked}>
          {renderText}
        </Checkbox>
      }
      extra={
        operationStatus === 'manage' && showRowDeleteButton ? (
          <Button
            size="mini"
            fill="none"
            className="fairys-taro-popup-search-list-virtual-delete-button"
            onClick={(event) => {
              event?.stopPropagation?.();
              event?.preventDefault?.();
              instance.onDeleteData(rowData);
            }}
            icon={<Del color="red" />}
          />
        ) : (
          <Fragment />
        )
      }
    />
  );
}

export function FairysTaroPopupSearchListVirtual<T = any>() {
  const [state, instance] = useFairysTaroPopupSearchBaseInstanceContext<T>();
  const popupHeight = instance.popupHeight;
  const _tempFilterDataList = state._tempFilterDataList;
  const rowKey = instance.rowKey;

  return (
    <ScrollView scrollY style={{ height: popupHeight, overflow: 'auto' }}>
      {_tempFilterDataList.map((item, index) => (
        <VirtualListItem key={`${item[rowKey]}_${index}`} rowData={item} dataIndex={index} index={index} />
      ))}
    </ScrollView>
    // <VirtualList
    //   containerHeight={popupHeight}
    //   itemHeight={46}
    //   list={_tempFilterDataList as T[]}
    //   itemRender={(item, dataIndex, index) => <VirtualListItem rowData={item} dataIndex={dataIndex} index={index} />}
    //   itemEqual={false}
    // />
  );
}
