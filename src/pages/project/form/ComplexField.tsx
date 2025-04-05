import { memo, type FC } from "react";
import { Typography } from "antd"; // Импортируем Typography из AntD

import { FormFieldEdit } from "@/shared/types/apiTypes";

import { FieldsLayout } from "./FieldsLayout";
import { type FormFieldProps } from "./FormFieldProps";
import { RecursiveField } from "./RecursiveField";
import { useTraceUpdate } from "../../../shared/hooks/debugHooks";
import { ExpandableCard } from "../../../shared/ui/ExpandableCard";
// import { Text } from '@v-uik/base';
interface ComplexFieldProps extends FormFieldProps {
  inline: boolean;
}

export const ComplexField: FC<ComplexFieldProps> = memo((props) => {
  const { fieldDescriptor: fd, inputId, inline } = props;
  useTraceUpdate("ComplexField " + inputId, props);

  const fields = (
    <FieldsLayout>
      {fd.children!.map((ffd) => {
        const ppd = ffd.propDescriptor;
        const inpId = inputId + "." + ppd.id;
        return <RecursiveField key={inpId} fieldDescriptor={ffd} inputId={inpId} />;
      })}
    </FieldsLayout>
  );

  if (inline) {
    return fields;
  }

  // const disabled = fd.edit === FormFieldEdit.Readonly;
  const required = fd.edit === FormFieldEdit.Required || fd.edit === FormFieldEdit.RequiredNew;

  const pd = fd.propDescriptor;
  return (
    <ExpandableCard
      labelProps={{
        label: <Typography.Text>{pd.title}</Typography.Text>, // Замена Text на Typography.Text
        labelProps: { tooltipText: pd.description },
        required: required
      }}
    >
      {fields}
    </ExpandableCard>
  );
});
