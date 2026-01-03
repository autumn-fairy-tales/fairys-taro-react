/**表格渲染*/
import { Table, Checkbox, Button, TableColumnProps } from '@nutui/nutui-react-taro';
import { Del } from '@nutui/icons-react-taro';

/**虚拟列表*/
/**
 * 如果是表格，需要计算每一列的宽度 选中(第一列固定)和删除(最后一列固定)按钮
 * 不是表格，则直接渲染行数，每一行添加 选中和删除按钮
 */
import { useFairysTaroPopupSearchBaseInstanceContext } from './instance';
import { useMemo } from 'react';

function TableItemCheckBox<T = any>(props: { rowData: T }) {
  const { rowData } = props;
  const [state, instance] = useFairysTaroPopupSearchBaseInstanceContext();
  const _tempValue = state._tempValue;
  const operationStatus = state.operationStatus;
  const manageSelectedDataList = state.manageSelectedDataList;
  const checked = useMemo(
    () => instance.isCheckedData(rowData),
    [rowData, _tempValue, operationStatus, manageSelectedDataList],
  );
  return (
    <Checkbox
      className="fairys-taro-popup-search-list-virtual-checkbox fairystaroform__flex-1"
      checked={checked}
      onChange={() => instance.onCheckedData(rowData, checked)}
    />
  );
}

function TableItemDelete<T = any>(props: { rowData: T }) {
  const { rowData } = props;
  const [, instance] = useFairysTaroPopupSearchBaseInstanceContext();
  return (
    <Button
      size="mini"
      fill="none"
      className="fairys-taro-popup-search-list-virtual-delete-button"
      onClick={() => instance.onDeleteData(rowData)}
      icon={<Del color="red" />}
    />
  );
}

export function FairysTaroPopupSearchListTable<T = any>() {
  const [state, instance] = useFairysTaroPopupSearchBaseInstanceContext<T>();
  const popupHeight = instance.popupHeight;
  const data = (state._tempFilterDataList || []) as T[];
  const operationStatus = state.operationStatus;
  const columns = (state.columns || []) as TableColumnProps[];
  const tableProps = instance.useTableProps?.(instance.tableProps || {}, instance) || instance.tableProps || {};
  const showRowDeleteButton = instance.showRowDeleteButton;

  const _newColumns = useMemo(() => {
    const list = [
      {
        key: '__checkbox',
        width: 16,
        align: 'center',
        title: '',
        render: (rowData: T) => <TableItemCheckBox rowData={rowData} />,
      } as TableColumnProps,
    ].concat([...columns]);
    if (operationStatus === 'manage' && instance.mode === 'multiple' && showRowDeleteButton) {
      return [
        ...list,
        {
          key: '__delete',
          width: 16,
          align: 'center',
          title: '',
          render: (rowData: T) => <TableItemDelete rowData={rowData} />,
        } as TableColumnProps,
      ];
    }
    return list;
  }, [columns, operationStatus, showRowDeleteButton]);

  return (
    <Table
      bordered
      {...tableProps}
      className={`fairys-taro-popup-search-list-table ${tableProps?.className || ''}`}
      style={{ height: popupHeight, ...(tableProps?.style || {}) }}
      columns={_newColumns}
      data={data}
    />
  );
}
