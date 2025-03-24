import {
  createUseStyles,
  Table,
  TablePagination,
  type ColumnProps,
  type RecordDataSource,
  type SortOrderProp,
} from "@v-uik/base";
import {
  FieldType,
  PropertyDescriptor,
  type ControlEventListDto,
} from "@shared/types/apiTypes";
import { useEffect, useState, type FC } from "react";
import { projectListApi } from "./projectListApi";
import { DirectoryValue } from "@shared/ui/DirectoryValue";
import { showErrorNotification } from "@shared/ui/showErrorNotification";

type Props = {
  onSelect: (projectId: string) => void;
  filter: string;
};

const useStyles = createUseStyles({
  blur: {
    filter: "blur(2.5px)",
  },
});

// TODO EDIT
// Эти 2 функции оч похожи, код дублируется лучше сделать одну, которая будет работать для всех
function toUpperCase(string: string | undefined) {
  if (!string) return "";
  return string[0].toUpperCase() + string.slice(1);
}

function lcFirst(string: string) {
  return string[0].toLowerCase() + string.slice(1);
}

// TODO EDIT лучше писать так, вместо ! в том месте где используется эта функцция.
function ucFirst(string: string | undefined) {
  if (!string) return "";
  return string[0].toUpperCase() + string.slice(1);
}

function metaToColumn(
  meta: PropertyDescriptor
): ColumnProps<ControlEventListDto> {
  const id = lcFirst(meta.id);
  return {
    key: id,
    dataIndex: id,
    title: meta.title,
    align: "center",
    // sortOrder: ,
    // TODO ASK Почему сортировка только по string?
    sortable: meta.type === FieldType.String,
    renderCellContent:
      meta.type === FieldType.Directory
        ? ({ cell, originClassName }) => {
            // OriginClassName - оригинальные стили для ячейки таблицы, то есть можно написать что-то вместо этого
            // console.log({cell, originClassName});

            return (
              <div className={originClassName}>
                <DirectoryValue
                  descriptor={meta.directoryDescriptor}
                  value={cell}
                />
              </div>
            );
          }
        : undefined,
  };
}

const pageSizes = [5, 10, 50];

// TODO EDIT пропсы записать по другому
// export const ProjectListTable: FC<{
//   onSelect: (projectId: string) => void
//   filter: string
// }> = ({ filter, onSelect }) => {
export const ProjectListTable = (props: Props) => {
  const { onSelect, filter } = props;
  const styles = useStyles();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizes[0]);
  const [totalItemsNumber, setTotalItemsNumber] = useState(0);

  const [orderBy, setOrderBy] = useState<string>();
  const [orderDesc, setOrderDesc] = useState<SortOrderProp>("none");

  const [records, setRecords] = useState<
    RecordDataSource<ControlEventListDto>[]
  >([]);
  const [columns, setColumns] = useState<ColumnProps<ControlEventListDto>[]>(
    []
  );

  // initial metadata loading
  useEffect(() => {
    projectListApi
      .fetchMeta()
      .then((meta) => {
        console.log("dfsdfs", meta);
        setColumns(meta.map((x) => metaToColumn(x)));
      })
      .catch(showErrorNotification);
  }, []);

  useEffect(() => {
    setLoading(true);

    projectListApi
      .fetchRecords({
        filter,
        page: currentPage - 1,
        pageSize,
        orderBy,
        orderDesc: orderDesc === "desc",
      })
      .then((data) => {
        console.log("data fetchResult, records", data);
        setRecords(data.items);
        setTotalItemsNumber(data.total);
      })
      .catch(showErrorNotification)
      .finally(() => {
        setLoading(false);
      });
  }, [filter, currentPage, pageSize, orderBy, orderDesc]);

  // TODO ASK ??? Загрузку индицировать?
  // if (loading) return <div>Loading...</div>

  // TODO EDIT лучше вынести все действия из JSX в отдельные функции, потому что это будет визуально читаться лучше.

  return (
    <>
      <Table
        // fixedHeader
        hoverable
        bordered="rows-columns"
        // Какой смысл в этом classes? То есть пока переключаемся между страницами таблицы виден блюр.
        // Может сделать какой-то серый блок и делать анимацию появления таблицы?
        classes={{ body: loading ? styles.blur : undefined }}
        rowKey={(row) => row.id}
        dataSource={records}
        columns={columns}
        onChange={(event) => {
          console.log("event", event);
          if (event.type === "sort") {
            if (event.sortOrder === "none") {
              setOrderBy(undefined);
              setOrderDesc("none");
            } else {
              setOrderBy(ucFirst(event.dataIndex));
              setOrderDesc(event.sortOrder);
            }
          }
        }}
        setRowProps={({ row }) => ({
          onClick: () => {
            onSelect(row.id);
          },
        })}
      />
      <TablePagination
        paginationType="advanced"
        currentPage={currentPage}
        totalCount={totalItemsNumber}
        pageSizesArray={pageSizes}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        onChange={setCurrentPage}
      />
    </>
  );
};
