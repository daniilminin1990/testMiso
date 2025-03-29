// import { FormFieldEdit, type DirectoryContent, type PropertyDescriptor } from "@shared/types/apiTypes";
// import { useTraceUpdate } from "../../../shared/hooks/debugHooks";
// import { type FormFieldProps } from "./FormFieldProps";
// import { ComboBox, type ComboboxProps } from "@v-uik/base";
// // import { Select } from "antd"; // Новый импорт AntD Select
// import { memo, useContext, useMemo, useRef } from "react";
// import { Field, getIn, type FieldProps, type FormikHandlers } from "formik";
// import { DirectoriesContext, type Directory } from "@shared/contexts/directories/DirectoriesContext";
// import type { JsonObject } from "@shared/types/json";
//
// interface DirectoryContentModel extends DirectoryContent {
//   unavailable?: boolean;
// }
//
// interface DirectoryModel extends Map<string, DirectoryContentModel> {}
//
// function groupBy(option: DirectoryContentModel): string {
//   return option.group ?? "";
// }
//
// function getOptionLabel(option: DirectoryContentModel): string {
//   return `${option.unavailable ? "НЕДОСТУПНО | " : ""}${option.code} | ${option.label}`; // Исправлено
// }
//
// interface DirectoryFieldProps extends FormFieldProps {}
//
// type DirectoryFieldValue = string | string[] | null;
//
// interface DirectoryFieldInternalProps extends DirectoryFieldProps {
//   value: DirectoryFieldValue;
//   directory: DirectoryModel | undefined;
//   setFieldValue: FieldProps<DirectoryFieldValue>["form"]["setFieldValue"];
//   onBlur: FormikHandlers["handleBlur"];
//   touched: boolean;
//   error?: string;
// }
//
// export const DirectoryField = memo((props: DirectoryFieldProps) => {
//   // TODO EDIT MININ Убрано React.FC
//   useTraceUpdate("DirectoryField[Field] " + props.inputId, props);
//   const directories = useContext(DirectoriesContext);
//
//   return (
//     <Field name={props.inputId}>
//       {(formik: FieldProps<DirectoryFieldValue, JsonObject>) => {
//         const pd = props.fieldDescriptor.propDescriptor;
//         const directory = directories.get(pd.directoryDescriptor!.id);
//         const options = pd.valuesFrom && directory ? getValuesFromOptions(formik, pd, directory) : directory;
//
//         return (
//           <DirectoryFieldInternal
//             {...props}
//             value={formik.field.value}
//             directory={options}
//             setFieldValue={formik.form.setFieldValue}
//             onBlur={formik.field.onBlur}
//             touched={formik.meta.touched}
//             error={formik.meta.error}
//           />
//         );
//       }}
//     </Field>
//   );
// });
//
// function getValuesFromOptions(
//   formik: FieldProps<DirectoryFieldValue, JsonObject>,
//   pd: PropertyDescriptor,
//   directory: Directory
// ): DirectoryModel {
//   const valuesFrom = (getIn(formik.form.values, pd.valuesFrom!) as string[] | null) ?? [];
//   const cur = formik.field.value ?? [];
//   const map = new Map<string, DirectoryContentModel>(valuesFrom.map((x) => [x, directory.get(x)!] as const));
//   for (const v of cur) {
//     if (!map.has(v)) {
//       map.set(v, { ...directory.get(v)!, unavailable: true });
//     }
//   }
//   return map;
// }
//
// function getFilteredItemsByInput(directory: DirectoryModel, inputValue: string) {
//   const input = inputValue.toLowerCase();
//   const values = Array.from(directory.values());
//   const matchingItems = values.filter(
//     (x) => x.label.toLowerCase().includes(input) || x.code.toLowerCase().includes(input)
//   );
//
//   matchingItems.push(
//     ...values.filter((directoryItem) =>
//       matchingItems.some((item) => directoryItem.code.startsWith(item.code.replace(/^0+/, "")))
//     )
//   );
//
//   return { inputValue, matchingItems };
// }
//
// const DirectoryFieldInternal = memo((props: DirectoryFieldInternalProps) => {
//   // TODO EDIT MININ Убрано FC
//   const { fieldDescriptor: fd, inputId, value, directory, setFieldValue, onBlur, touched, error } = props;
//   useTraceUpdate("DirectoryField " + inputId, props);
//
//   const pd = fd.propDescriptor;
//   const isCollection = pd.isCollection;
//
//   const filterCacheRef = useRef({
//     inputValue: "",
//     matchingItems: [] as DirectoryContentModel[]
//   });
//
//   const comboBoxProps = useMemo(() => {
//     const disabled = fd.edit === FormFieldEdit.Readonly;
//     const required = fd.edit === FormFieldEdit.Required || fd.edit === FormFieldEdit.RequiredNew;
//
//     return {
//       options: directory && Array.from(directory.values()),
//       loading: !directory?.size,
//       isSearchable: true,
//       canClear: true,
//       openOnFocus: true,
//       inputProps: { id: inputId, name: inputId },
//       groupBy,
//       getOptionLabel,
//       filterOption: !directory
//         ? undefined
//         : (option: DirectoryContentModel, inputValue: string) => {
//             if (!inputValue) {
//               return true;
//             }
//             if (filterCacheRef.current.inputValue !== inputValue) {
//               filterCacheRef.current = getFilteredItemsByInput(directory, inputValue);
//             }
//             return filterCacheRef.current.matchingItems.some((x) => x.value === option.value);
//           },
//       onBlur,
//       label: pd.title,
//       labelProps: { id: inputId + "-label", tooltipText: pd.description },
//       disabled,
//       required,
//       error: touched && Boolean(error),
//       helperText: touched && error ? String(error) : ""
//     } satisfies ComboboxProps<DirectoryContentModel>;
//   }, [directory, fd, inputId, touched, error, onBlur]);
//
//   return isCollection ? (
//     <MyComboMultiple
//       inputId={inputId}
//       setFieldValue={setFieldValue}
//       directory={directory}
//       value={value as string[] | null}
//       comboBoxProps={{ ...comboBoxProps, multiple: true } as const}
//     />
//   ) : (
//     <MyComboSingle
//       inputId={inputId}
//       setFieldValue={setFieldValue}
//       directory={directory}
//       value={value as string | null}
//       comboBoxProps={comboBoxProps}
//     />
//   );
// });
//
// interface ComboCommonProps {
//   inputId: string;
//   setFieldValue: FieldProps<DirectoryFieldValue>["form"]["setFieldValue"];
//   directory: DirectoryModel | undefined;
// }
//
// const MyComboSingle = memo(
//   ({
//     value,
//     setFieldValue,
//     inputId,
//     directory,
//     comboBoxProps
//   }: ComboCommonProps & {
//     value: string | null;
//     comboBoxProps: ComboboxProps<DirectoryContentModel>;
//   }) => {
//     return (
//       <ComboBox
//         {...comboBoxProps}
//         value={directory && value ? directory.get(value) : undefined}
//         onChange={(v: DirectoryContentModel | null) => setFieldValue(inputId, v?.value ?? null)}
//       />
//     );
//   }
// );
//
// const MyComboMultiple = memo(
//   ({
//     value,
//     setFieldValue,
//     inputId,
//     directory,
//     comboBoxProps
//   }: ComboCommonProps & {
//     value: string[] | null;
//     comboBoxProps: ComboboxProps<DirectoryContentModel> & { multiple: true };
//   }) => {
//     return (
//       <ComboBox
//         {...comboBoxProps}
//         multiple
//         withTags
//         disableCloseOnSelect
//         value={directory && value ? value.map((x) => directory.get(x)!) : []}
//         onChange={(v: DirectoryContentModel[]) =>
//           setFieldValue(
//             inputId,
//             v.map((x) => x.value)
//           )
//         }
//       />
//     );
//   }
// );
//
// /**
//  *
// Проблемы:
// * Типизация value в onChange:
//     В MyComboSingle и MyComboMultiple onChange получает v (значение ComboBox), но его тип не проверяется на соответствие DirectoryFieldValue. Это может привести к ошибкам, если ComboBox возвращает неожиданный тип.
// * Потенциальная ошибка с directory.get:
//     В MyComboSingle и MyComboMultiple вызывается directory.get(value) без проверки, существует ли ключ. Если value не найдено, это вернёт undefined, что может сломать логику.
// * Избыточная сложность типов:
//     Типизация comboBoxProps с satisfies и дженериками в MyComboSingle/MyComboMultiple работает, но избыточно сложна. Можно упростить.
//
//     ТО ЕСТЬ ВО ТКАК БЫЛО
// function MyComboSingle<T extends ComboboxProps<DirectoryContentModel> & { multiple?: false; }>({
//   value,
//   setFieldValue,
//   inputId,
//   directory,
//   comboBoxProps,
// }: {
//   value: string | null,
//   setFieldValue: FieldProps<DirectoryFieldValue>['form']['setFieldValue'];
//   inputId: string;
//   directory: DirectoryModel | undefined,
//   comboBoxProps: T;
// }) {
//   return <ComboBox
//     // multiple={false}
//     {...comboBoxProps}
//
//
// value={(directory && value) ? directory.get(value) : undefined}
// onChange={(v, _e, _f, _r) => { setFieldValue(inputId, v); }}
//   />;
// }
//  */
export {};
