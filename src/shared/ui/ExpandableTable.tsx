import { Table, type ColumnProps, type Key } from "@v-uik/base";
import { useTraceUpdate } from "../hooks/debugHooks";
import {
  forwardRef,
  useImperativeHandle,
  useReducer,
  type ForwardedRef,
} from "react";

export type DataSourceWithKey<T> = T & { key: Key };

type Props<T> = {
  dataSource: T[];
  columns: ColumnProps<T>[];
  renderExpandableContent: ColumnProps<T>["renderExpandableContent"];
};

export interface ControTableRef {
  toogleRow: (key: React.Key) => void;
  collapseRow: (key: React.Key) => void;
  collapseAll: () => void;
}

export const ExpandableTable = forwardRef(
  <T,>(
    props: Props<DataSourceWithKey<T>>,
    controlRef?: ForwardedRef<ControTableRef>
  ) => {
    useTraceUpdate("ExpandableTable", props);
    const { dataSource, columns, renderExpandableContent } = props;

    const [expandedRows, dispatchRowsState] = useReducer(
      (
        state: React.Key[],
        event:
          | { type: "collapseAll" }
          | { type: "collapse"; key: React.Key }
          | { type: "toogle"; key: React.Key }
      ) => {
        if (event.type === "collapseAll") {
          return [];
        }

        const filtered = state.filter((x) => x !== event.key);
        if (event.type === "collapse") return filtered;

        return filtered.length === state.length
          ? (filtered.push(event.key), filtered)
          : filtered;
      },
      []
    );

    useImperativeHandle(controlRef, () => ({
      toogleRow: (key) => {
        dispatchRowsState({ type: "toogle", key });
      },
      collapseRow: (key) => {
        dispatchRowsState({ type: "collapse", key });
      },
      collapseAll: () => {
        dispatchRowsState({ type: "collapseAll" });
      },
    }));

    const columnsWithExpand: ColumnProps<DataSourceWithKey<T>>[] = [
      {
        key: "_expand",
        kind: "expand",
        width: 1,
        isRowExpanded: ({ row }) => expandedRows.includes(row.key),
        renderExpandableContent,
      },
      {
        key: "_idx",
        width: 1,
        title: "№",
        align: "center",
        renderCellContent: ({ rowIndex }) => rowIndex + 1,
      },
      ...columns,
    ];

    return (
      <Table
        hoverable
        fixedHeader
        size="sm"
        style={{ maxHeight: "70vh" }}
        dataSource={dataSource}
        columns={columnsWithExpand}
        setRowProps={(params) => ({
          onClick: () => {
            dispatchRowsState({ type: "toogle", key: params.row.key });
          },
        })}
        onChange={(params) => {
          if (params.type === "expand") {
            dispatchRowsState({ type: "toogle", key: params.row.key });
          }
        }}
      />
    );
  }
);
