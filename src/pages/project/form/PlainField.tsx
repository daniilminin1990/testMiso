import { FieldType, FormFieldEdit } from "@shared/types/apiTypes";
import {
  DatePicker,
  Input,
  type DatePickerProps,
  type InputProps,
} from "@v-uik/base";
import { memo, useMemo } from "react";
import { useTraceUpdate } from "../../../shared/hooks/debugHooks";
import { type FormFieldProps } from "./FormFieldProps";
import type { JsonPrimative } from "@shared/types/json";
import { Field, type FormikHandlers, type FieldProps } from "formik";
interface PlainFieldProps extends FormFieldProps {}
interface PlainFieldInternalProps extends PlainFieldProps {
  value: JsonPrimative;
  setFieldValue: FieldProps<JsonPrimative>["form"]["setFieldValue"];
  onBlur: FormikHandlers["handleBlur"];
  touched: boolean;
  error?: string;
}

export const PlainField: React.FC<PlainFieldProps> = memo((props) => {
  useTraceUpdate("PlainField[Field] " + props.inputId, props);

  return (
    <Field name={props.inputId}>
      {(formik: FieldProps<JsonPrimative>) => (
        <PlainFieldInternal
          {...props}
          value={formik.field.value}
          setFieldValue={formik.form.setFieldValue}
          onBlur={formik.field.onBlur}
          touched={formik.meta.touched}
          error={formik.meta.error}
        />
      )}
    </Field>
  );
});

const PlainFieldInternal: React.FC<PlainFieldInternalProps> = memo((props) => {
  const {
    fieldDescriptor: fd,
    inputId,
    value,
    setFieldValue,
    onBlur,
    touched,
    error,
  } = props;
  const pd = fd.propDescriptor;

  useTraceUpdate("Plain " + inputId, props);

  // if (pd.type === FieldType.Hidden) {
  //   // return <div color='grey'>[{pd.title}]: <code>[{value as string}]</code></div>
  //   return undefined
  // }

  const fieldProps = useMemo<InputProps & DatePickerProps<Date>>(() => {
    const pd = fd.propDescriptor;
    const disabled = fd.edit === FormFieldEdit.Readonly;
    const required =
      fd.edit === FormFieldEdit.Required ||
      fd.edit === FormFieldEdit.RequiredNew;

    return {
      // className,
      label: pd.title,
      labelProps: {
        id: inputId + "-label",
        tooltipText: pd.description,
        htmlFor: inputId,
      },
      disabled: disabled,
      required: required,
      error: touched && Boolean(error),
      helperText: touched && error ? String(error) : null,

      onBlur,
    };
  }, [fd, inputId, touched, error, onBlur]);

  switch (pd.type) {
    case FieldType.String:
      return (
        <MyInput
          inputId={inputId}
          fieldProps={fieldProps}
          setFieldValue={setFieldValue}
          value={value as string | null}
        />
      );
    case FieldType.Date:
      return (
        <MyDatePicker
          inputId={inputId}
          fieldProps={fieldProps}
          setFieldValue={setFieldValue}
          value={value as string | null}
        />
      );
    case FieldType.Number:
    case FieldType.Bool:
    case FieldType.Directory:
    case FieldType.Complex:
    case FieldType.Hidden:
    default:
      return (
        <div color="grey">
          {inputId} ({pd.type}): <code>[{value as string}]</code>
        </div>
      );
  }
});

function MyInput<T extends InputProps>({
  value,
  setFieldValue,
  inputId,
  fieldProps,
}: {
  value: string | null;
  setFieldValue: FieldProps<JsonPrimative>["form"]["setFieldValue"];
  inputId: string;
  fieldProps: T;
}) {
  return (
    <Input //<true>
      fullWidth
      canClear
      value={value}
      onChange={(v, _event, _r) => {
        setFieldValue(inputId, v);
      }}
      inputProps={{ id: inputId, name: inputId }}
      {...fieldProps}
    />
  );
}

function MyDatePicker({
  value,
  setFieldValue,
  inputId,
  fieldProps,
}: {
  value: string | null;
  setFieldValue: FieldProps<JsonPrimative>["form"]["setFieldValue"];
  inputId: string;
  fieldProps: DatePickerProps<Date>;
}) {
  return (
    <div
      style={{
        width: "100%",
      }}
    >
      <DatePicker<Date>
        value={value ? new Date(value) : null}
        onChange={(v) => {
          const value = v?.toISOString().split("T")[0] ?? null;
          setFieldValue(inputId, value);
        }}
        mask="11.11.1111"
        inputProps={{
          inputProps: { id: inputId, name: inputId },
        }}
        {...fieldProps}
      />
    </div>
  );
}
