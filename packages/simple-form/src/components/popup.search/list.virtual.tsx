import { Cell, VirtualList, Checkbox, Button } from '@nutui/nutui-react-taro';
import { Del } from '@nutui/icons-react-taro';

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
  const renderText = useMemo(() => {
    return renderListItemText?.(rowData) || rowData[instance.displayField];
  }, [rowData, instance.displayField, renderListItemText]);

  const checked = useMemo(
    () => instance.isCheckedData(rowData),
    [rowData, _tempValue, operationStatus, manageSelectedDataList],
  );

  return (
    <Cell
      className="fairys-taro-popup-search-list-virtual-cell"
      title={
        <Checkbox
          className="fairys-taro-popup-search-list-virtual-checkbox fairystaroform__flex-1"
          checked={checked}
          onChange={() => instance.onCheckedData(rowData, checked)}
        >
          {renderText}
        </Checkbox>
      }
      extra={
        operationStatus === 'manage' ? (
          <Button
            size="mini"
            fill="none"
            className="fairys-taro-popup-search-list-virtual-delete-button"
            onClick={() => instance.onDeleteData(rowData)}
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

  return (
    <VirtualList
      containerHeight={popupHeight}
      itemHeight={46}
      list={_tempFilterDataList as T[]}
      itemRender={(item, dataIndex, index) => <VirtualListItem rowData={item} dataIndex={dataIndex} index={index} />}
      itemEqual={false}
    />
  );
}
