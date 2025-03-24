import { useTraceUpdate } from "../../../shared/hooks/debugHooks";
import { type FormFieldProps } from "./FormFieldProps";
import { RecursiveField } from "./RecursiveField";
import { memo, type FC } from "react";
import { FormFieldEdit } from "@shared/types/apiTypes";
import { ExpandableCard } from "../../../shared/ui/ExpandableCard";
import { FieldsLayout } from "./FieldsLayout";
import { Text } from "@v-uik/base";
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
        return (
          <RecursiveField key={inpId} fieldDescriptor={ffd} inputId={inpId} />
        );
      })}
    </FieldsLayout>
  );

  if (inline) return fields;

  // const disabled = fd.edit === FormFieldEdit.Readonly;
  const required =
    fd.edit === FormFieldEdit.Required || fd.edit === FormFieldEdit.RequiredNew;

  const pd = fd.propDescriptor;
  return (
    <ExpandableCard
      labelProps={{
        label: <Text>{pd.title}</Text>,
        labelProps: { tooltipText: pd.description },
        required: required,
      }}
    >
      {fields}
    </ExpandableCard>
  );
});
