// ! Замена v-uik
import React, { ForwardedRef, forwardRef, ReactNode, useImperativeHandle, useState } from "react";
import { Table } from "antd";

export type DataSourceWithKey<T> = T & { key: React.Key };

type Props<T> = {
  dataSource: T[];
  columns: any[]; // Тип колонок можно уточнить под Ant Design, если нужно
  renderExpandableContent: (record: T) => React.ReactNode;
};

export interface ControTableRef {
  toogleRow: (key: React.Key) => void;
  collapseRow: (key: React.Key) => void;
  collapseAll: () => void;
}

export type ColumnProps<T> = {
  key: string;
  dataIndex?: string;
  title: string;
  width?: number;
  renderCellContent?: (params: {
    cell: any; // Можно уточнить тип позже
    row: T;
    rowIndex: number;
    originClassName: string;
  }) => ReactNode;
};

export const ExpandableTable = forwardRef(
  <T,>(props: Props<DataSourceWithKey<T>>, controlRef?: ForwardedRef<ControTableRef>) => {
    const { dataSource, columns, renderExpandableContent } = props;
    const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

    const toggleRow = (key: React.Key) => {
      setExpandedRowKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
    };

    useImperativeHandle(controlRef, () => ({
      toogleRow: toggleRow,
      collapseRow: (key) => setExpandedRowKeys((prev) => prev.filter((k) => k !== key)),
      collapseAll: () => setExpandedRowKeys([])
    }));

    const columnsWithExpand = [
      {
        title: "№",
        width: 50,
        align: "center" as const,
        render: (_: any, __: any, index: number) => index + 1
      },
      ...columns
    ];

    return (
      <Table
        rowKey="key"
        dataSource={dataSource}
        columns={columnsWithExpand}
        expandable={{
          expandedRowRender: renderExpandableContent,
          expandedRowKeys,
          onExpand: (expanded, record) => toggleRow(record.key)
        }}
        scroll={{ y: "70vh" }}
        size="small"
        onRow={(record) => ({
          onClick: () => toggleRow(record.key)
        })}
      />
    );
  }
);

// ! ЭТО ОРИГИНАЛ
// import { Table, type ColumnProps, type Key } from '@v-uik/base';
// import { useTraceUpdate } from '../hooks/debugHooks';
// import React, { forwardRef, useImperativeHandle, useReducer, type ForwardedRef } from 'react';
//
// export type DataSourceWithKey<T> = T & { key: Key };
//
// type Props<T> = {
//   dataSource: T[];
//   columns: ColumnProps<T>[];
//   renderExpandableContent: ColumnProps<T>['renderExpandableContent'];
// };
//
// export interface ControTableRef {
//   toogleRow: (key: React.Key) => void;
//   collapseRow: (key: React.Key) => void;
//   collapseAll: () => void;
// }
//
// export const ExpandableTable = forwardRef(
//   <T,>(props: Props<DataSourceWithKey<T>>, controlRef?: ForwardedRef<ControTableRef>) => {
//     useTraceUpdate('ExpandableTable', props);
//     const { dataSource, columns, renderExpandableContent } = props;
//
//     const [expandedRows, dispatchRowsState] = useReducer(
//       (
//         state: React.Key[],
//         event: { type: 'collapseAll' } | { type: 'collapse'; key: React.Key } | { type: 'toogle'; key: React.Key }
//       ) => {
//         if (event.type === 'collapseAll') {
//           return [];
//         }
//
//         const filtered = state.filter((x) => x !== event.key);
//         if (event.type === 'collapse') return filtered;
//
//         return filtered.length === state.length ? (filtered.push(event.key), filtered) : filtered;
//       },
//       []
//     );
//
//     useImperativeHandle(controlRef, () => ({
//       toogleRow: (key) => {
//         dispatchRowsState({ type: 'toogle', key });
//       },
//       collapseRow: (key) => {
//         dispatchRowsState({ type: 'collapse', key });
//       },
//       collapseAll: () => {
//         dispatchRowsState({ type: 'collapseAll' });
//       }
//     }));
//
//     const columnsWithExpand: ColumnProps<DataSourceWithKey<T>>[] = [
//       {
//         key: '_expand',
//         kind: 'expand',
//         width: 1,
//         isRowExpanded: ({ row }: { row: { key: React.Key } }) => expandedRows.includes(row.key),
//         renderExpandableContent
//       },
//       {
//         key: '_idx',
//         width: 1,
//         title: '№',
//         align: 'center',
//         renderCellContent: ({ rowIndex }: { rowIndex: number }) => rowIndex + 1
//       },
//       ...columns
//     ];
//
//     return (
//       <Table
//         hoverable
//         fixedHeader
//         size="sm"
//         style={{ maxHeight: '70vh' }}
//         dataSource={dataSource}
//         columns={columnsWithExpand}
//         setRowProps={(params: { row: { key: any } }) => ({
//           onClick: () => {
//             dispatchRowsState({ type: 'toogle', key: params.row.key });
//           }
//         })}
//         onChange={(params: { type: string; row: { key: any } }) => {
//           if (params.type === 'expand') {
//             dispatchRowsState({ type: 'toogle', key: params.row.key });
//           }
//         }}
//       />
//     );
//   }
// );
