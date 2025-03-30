import { FieldType, FormFieldEdit, type FormFieldDescriptor } from "@shared/types/apiTypes";
import { useTraceUpdate } from "../../../shared/hooks/debugHooks";
import { type FormFieldProps } from "./FormFieldProps";
import type { JsonObject } from "@shared/types/json";
import { RecursiveField } from "./RecursiveField";
import { Field, FieldArray, type FieldProps } from "formik";
// import { Button, Text, type ColumnProps, type Key } from '@v-uik/base';
import { Typography, Button as AntButton } from "antd"; // Замена Text и Button
// import { ColumnProps } from 'antd/es/table'; // Замена ColumnProps, от AntD таблицы
import { ExpandableCard } from "../../../shared/ui/ExpandableCard";
import {
  ExpandableTable,
  type ControTableRef,
  type DataSourceWithKey,
  ColumnProps
} from "../../../shared/ui/ExpandableTable";
import { IoTrash } from "react-icons/io5";
import { DirectoryValue } from "@shared/ui/DirectoryValue";
import {
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
  type MouseEventHandler,
  type MutableRefObject,
  Key
} from "react";
import { ModalConfirm } from "../../../shared/ui/ModalConfirm";
import { modalConfirmClosedState } from "@shared/ui/ModalConfirmProps";
import * as styles from "./ArrayField.module.scss";

// interface ArrayFieldProps extends FormFieldProps {}
type ArrayFieldProps = FormFieldProps; // Замена
interface ArrayFieldInternalProps extends ArrayFieldProps {
  value: JsonObject[] | null;
}

export const ArrayField: React.FC<ArrayFieldProps> = (props) => (
  <Field name={props.inputId}>
    {(formik: FieldProps<JsonObject[] | null>) => <ArrayFieldInternal {...props} value={formik.field.value} />}
  </Field>
);

const ArrayFieldInternal: React.FC<ArrayFieldInternalProps> = memo((props) => {
  useTraceUpdate("ArrayFieldInternal", props);
  const { fieldDescriptor: fd, inputId, value } = props;

  const pd = fd.propDescriptor;
  const required = fd.edit === FormFieldEdit.Required || fd.edit === FormFieldEdit.RequiredNew;

  return (
    <div className={styles.fullRow}>
      <ExpandableCard
        labelProps={{
          label: <Typography.Text>{pd.title}</Typography.Text>, // Замена Text
          labelProps: { tooltipText: pd.description },
          required: required
        }}
      >
        <FieldArray name={inputId}>
          {(arrayHelpers) => (
            <ArrayTableControl
              fd={fd}
              inputId={inputId}
              value={value}
              onAdd={arrayHelpers.push}
              onRemove={arrayHelpers.remove}
            />
          )}
        </FieldArray>
      </ExpandableCard>
    </div>
  );
});

type ArrayTableControlProps = {
  fd: FormFieldDescriptor;
  value: JsonObject[] | null;
  inputId: string;
  onRemove: (index: number) => void;
  onAdd: (val: JsonObject) => void;
};

const ArrayTableControl = memo((props: ArrayTableControlProps) => {
  useTraceUpdate("ArrayTableControl", props);
  const { fd, inputId, value, onRemove, onAdd } = props;
  const disabled = fd.edit === FormFieldEdit.Readonly;

  const dataSource = useMemo(
    () =>
      value?.map((x) => ({
        ...x,
        key: x[fd.propDescriptor.idPropertyName!] as string | number
      })),
    [value, fd]
  );

  const controTableRef = useRef<ControTableRef | null>(null);
  const [modal, setModal] = useState(modalConfirmClosedState);

  const onRemoveHandler = useCallback(
    (index: number, key: React.Key, warn: boolean) => {
      if (warn) {
        setModal({
          open: true,
          // content: <Text>В строке присутствуют данные, вы точно хотите её удалить?</Text>,
          content: <Typography.Text>В строке присутствуют данные, вы точно хотите её удалить?</Typography.Text>, // Замена Text
          onConfirm: () => {
            onRemoveHandler(index, key, false);
          }
        });
        return;
      }

      controTableRef.current?.collapseRow(key);
      onRemove(index);
    },
    [onRemove]
  );

  const newItemIdCounter = useRef(0);

  const onAddHandler = useCallback(() => {
    const newId = --newItemIdCounter.current;
    onAdd({ [fd.propDescriptor.idPropertyName!]: newId });

    // focus first input field of new item
    const firstField = fd.children!.find((x) => x.propDescriptor.type !== FieldType.Hidden)!;
    const idx = dataSource?.length ?? 0;
    setTimeout(() => {
      document
        .querySelector<HTMLLabelElement>("#" + CSS.escape(`${inputId}[${idx}].${firstField.propDescriptor.id}-label`))
        ?.click();
    });

    const table = controTableRef.current;
    if (table) {
      table.collapseAll();
      table.toogleRow(newId);
    }
  }, [onAdd, fd, inputId, dataSource]);

  return (
    <div className={styles.cardContentContainer}>
      {/*<Button disabled={disabled} onClick={onAddHandler}>*/}
      {/*  {fd.propDescriptor.addButtonLabel ?? 'Добавить'}*/}
      {/*</Button>*/}
      {/* Замена Button от v-uik */}
      <AntButton disabled={disabled} onClick={onAddHandler}>
        {fd.propDescriptor.addButtonLabel ?? "Добавить"}
      </AntButton>
      <ArrayTable
        controTableRef={controTableRef}
        onRemove={onRemoveHandler}
        dataSource={dataSource}
        inputId={inputId}
        fd={fd}
      />
      <ModalConfirm
        state={modal}
        setState={setModal}
        headerText="Внимание"
        mainButtonText="Удалить"
        mainButtonColor="error"
      />
    </div>
  );
});

type DataSource = DataSourceWithKey<JsonObject>;

type ArrayTableProps = {
  onRemove: (index: number, key: React.Key, warn: boolean) => void;
  dataSource: DataSource[] | undefined;
  inputId: string;
  fd: FormFieldDescriptor;
  controTableRef: MutableRefObject<ControTableRef | null>;
};

const ArrayTable = memo((props: ArrayTableProps) => {
  const { onRemove, dataSource, fd, inputId, controTableRef } = props;
  useTraceUpdate("ArrayTable", props);

  const columns = useMemo(() => {
    const columns = fd
      .children!.filter((ffd) => ffd.propDescriptor.type !== FieldType.Hidden)
      .map<ColumnProps<DataSource>>((x) => {
        const pd = x.propDescriptor;
        return {
          key: pd.id,
          dataIndex: pd.id,
          title: pd.title,
          renderCellContent:
            pd.type === FieldType.Directory
              ? ({ cell, originClassName }) => (
                  <div className={originClassName}>
                    <DirectoryValue descriptor={pd.directoryDescriptor} value={cell} />
                  </div>
                )
              : undefined
        };
      });

    const disabled = fd.edit === FormFieldEdit.Readonly;

    columns.push({
      title: "",
      key: "_delete",
      width: 1,
      renderCellContent: ({ row, rowIndex }) => (
        <RemoveRowButton
          disabled={disabled}
          onClick={() => {
            const warn = Object.keys(row).some((x) => x !== "key" && x !== fd.propDescriptor.idPropertyName);
            onRemove(rowIndex, row.key, warn);
          }}
        />
      )
    });
    return columns;
  }, [onRemove, fd]);

  return (
    <ExpandableTable
      ref={controTableRef}
      columns={columns}
      dataSource={dataSource ?? []}
      renderExpandableContent={({ rowIndex }) => (
        <div className={styles.expandedRowContainer}>
          <RecursiveField inline fieldDescriptor={fd} inputId={`${inputId}[${rowIndex}]`} />
        </div>
      )}
    />
  );
});

const RemoveRowButton = memo(
  ({ disabled, onClick }: { disabled: boolean; onClick: MouseEventHandler<HTMLButtonElement> }) => (
    // <Button kind="ghost" color="secondary" disabled={disabled} onClick={onClick}>
    //   <IoTrash />
    // </Button>
    <AntButton type="text" danger disabled={disabled} onClick={onClick}>
      <IoTrash />
    </AntButton>
  )
);
