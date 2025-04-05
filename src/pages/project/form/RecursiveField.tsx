import { memo } from "react";

import { FieldType } from "@shared/types/apiTypes";

import { ArrayField } from "./ArrayField";
import { ComplexField } from "./ComplexField";
import { DirectoryField } from "./DirectoryField";
import { type FormFieldProps } from "./FormFieldProps";
import { PlainField } from "./PlainField";
import { useTraceUpdate } from "../../../shared/hooks/debugHooks";
// import { createUseStyles } from '@v-uik/base';
import * as styles from "./RecursiveField.module.scss";

interface RecursiveFieldProps extends FormFieldProps {
  inline?: boolean;
}

// const useStyles = createUseStyles({
//   flexItem: {
//     display: 'flex'
//   }
// });

export const RecursiveField: React.FC<RecursiveFieldProps> = memo((props) => {
  const { fieldDescriptor: fd, inputId, inline } = props;
  // const styles = useStyles();
  const pd = fd.propDescriptor;

  useTraceUpdate("RecursiveField " + props.inputId, props);

  if (pd.type === FieldType.Hidden) {
    return undefined;
  }

  if (pd.type === FieldType.Directory) {
    return (
      <div className={styles.flexItem}>
        <DirectoryField fieldDescriptor={fd} inputId={inputId} />
      </div>
    );
  }

  if (pd.isCollection && !inline) {
    return <ArrayField fieldDescriptor={fd} inputId={inputId} />;
  }

  if (pd.type === FieldType.Complex) {
    return <ComplexField fieldDescriptor={fd} inputId={inputId} inline={!!inline} />;
  }

  return (
    <div className={styles.flexItem}>
      <PlainField fieldDescriptor={fd} inputId={inputId} />
    </div>
  );
});
