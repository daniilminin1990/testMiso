import { FormFieldEdit, type DirectoryContent, type PropertyDescriptor } from "@shared/types/apiTypes";
import { useTraceUpdate } from "../../../shared/hooks/debugHooks";
import { type FormFieldProps } from "./FormFieldProps";
import { Select } from "antd"; // Новый импорт AntD Select
import { memo, useContext, useMemo, useRef } from "react";
import { Field, getIn, type FieldProps, type FormikHandlers } from "formik";
import { DirectoriesContext, type Directory } from "@shared/contexts/directories/DirectoriesContext";
import type { JsonObject } from "@shared/types/json";

interface DirectoryContentModel extends DirectoryContent {
  unavailable?: boolean;
}

interface DirectoryModel extends Map<string, DirectoryContentModel> {}

function groupBy(option: DirectoryContentModel): string {
  return option.group ?? "";
}

function getOptionLabel(option: DirectoryContentModel): string {
  return `${option.unavailable ? "НЕДОСТУПНО | " : ""}${option.code} | ${option.label}`;
}

interface DirectoryFieldProps extends FormFieldProps {}

type DirectoryFieldValue = string | string[] | null;

interface DirectoryFieldInternalProps extends DirectoryFieldProps {
  value: DirectoryFieldValue;
  directory: DirectoryModel | undefined;
  setFieldValue: FieldProps<DirectoryFieldValue>["form"]["setFieldValue"];
  onBlur: FormikHandlers["handleBlur"];
  touched: boolean;
  error?: string;
}

export const DirectoryField = memo((props: DirectoryFieldProps) => {
  useTraceUpdate("DirectoryField[Field] " + props.inputId, props);
  const directories = useContext(DirectoriesContext);

  return (
    <Field name={props.inputId}>
      {(formik: FieldProps<DirectoryFieldValue, JsonObject>) => {
        const pd = props.fieldDescriptor.propDescriptor;
        const directory = directories.get(pd.directoryDescriptor!.id);
        const options = pd.valuesFrom && directory ? getValuesFromOptions(formik, pd, directory) : directory;

        return (
          <DirectoryFieldInternal
            {...props}
            value={formik.field.value}
            directory={options}
            setFieldValue={formik.form.setFieldValue}
            onBlur={formik.field.onBlur}
            touched={formik.meta.touched}
            error={formik.meta.error}
          />
        );
      }}
    </Field>
  );
});

function getValuesFromOptions(
  formik: FieldProps<DirectoryFieldValue, JsonObject>,
  pd: PropertyDescriptor,
  directory: Directory
): DirectoryModel {
  const valuesFrom = (getIn(formik.form.values, pd.valuesFrom!) as string[] | null) ?? [];
  const cur = formik.field.value ?? [];
  const map = new Map<string, DirectoryContentModel>(valuesFrom.map((x) => [x, directory.get(x)!] as const));
  for (const v of cur) {
    if (!map.has(v)) {
      map.set(v, { ...directory.get(v)!, unavailable: true });
    }
  }
  return map;
}

function getFilteredItemsByInput(directory: DirectoryModel, inputValue: string) {
  const input = inputValue.toLowerCase();
  const values = Array.from(directory.values());
  const matchingItems = values.filter(
    (x) => x.label.toLowerCase().includes(input) || x.code.toLowerCase().includes(input)
  );

  matchingItems.push(
    ...values.filter((directoryItem) =>
      matchingItems.some((item) => directoryItem.code.startsWith(item.code.replace(/^0+/, "")))
    )
  );

  return { inputValue, matchingItems };
}

const DirectoryFieldInternal = memo((props: DirectoryFieldInternalProps) => {
  const { fieldDescriptor: fd, inputId, value, directory, setFieldValue, onBlur, touched, error } = props;
  useTraceUpdate("DirectoryField " + inputId, props);

  const pd = fd.propDescriptor;
  const isCollection = pd.isCollection;

  const filterCacheRef = useRef({
    inputValue: "",
    matchingItems: [] as DirectoryContentModel[]
  });

  const selectProps = useMemo(() => {
    const disabled = fd.edit === FormFieldEdit.Readonly;
    const required = fd.edit === FormFieldEdit.Required || fd.edit === FormFieldEdit.RequiredNew;

    return {
      showSearch: true,
      allowClear: true,
      disabled,
      required,
      status: touched && error ? "error" : undefined,
      onBlur,
      placeholder: pd.title,
      filterOption: (input: string, option?: { label: string; value: string }) =>
        option?.label.toLowerCase().includes(input.toLowerCase()) || false
    };
  }, [fd, inputId, touched, error, onBlur]);

  const options = useMemo(() => {
    if (!directory) {
      return [];
    }
    return Array.from(directory.values()).map((item) => ({
      value: item.value,
      label: getOptionLabel(item),
      group: groupBy(item)
    }));
  }, [directory]);

  return isCollection ? (
    <MySelectMultiple
      inputId={inputId}
      setFieldValue={setFieldValue}
      value={value as string[] | null}
      options={options}
      selectProps={selectProps}
    />
  ) : (
    <MySelectSingle
      inputId={inputId}
      setFieldValue={setFieldValue}
      value={value as string | null}
      options={options}
      selectProps={selectProps}
    />
  );
});

interface SelectCommonProps {
  inputId: string;
  setFieldValue: FieldProps<DirectoryFieldValue>["form"]["setFieldValue"];
  options: { value: string; label: string; group: string }[];
  selectProps: any;
}

const MySelectSingle = memo(
  ({ value, setFieldValue, inputId, options, selectProps }: SelectCommonProps & { value: string | null }) => {
    return (
      <Select
        {...selectProps}
        // size={"large"}
        value={value}
        style={{ width: "100%" }}
        onChange={(v) => setFieldValue(inputId, v)}
        options={options}
      />
    );
  }
);

const MySelectMultiple = memo(
  ({ value, setFieldValue, inputId, options, selectProps }: SelectCommonProps & { value: string[] | null }) => {
    return (
      <Select
        mode="multiple"
        size={"large"}
        {...selectProps}
        style={{ width: "100%" }}
        value={value}
        onChange={(v) => setFieldValue(inputId, v)}
        options={options}
      />
    );
  }
);
