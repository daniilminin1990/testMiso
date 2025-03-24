import { memo, ReactNode } from "react";
import * as styles from "./FieldGroupWrapper.module.scss";
import { FC } from "react";
import { useTraceUpdate } from "@shared/hooks/debugHooks";

interface IGroupWrapper {
  children?: ReactNode;
  name: string;
}

export const FieldGroupWrapper: FC<IGroupWrapper> = memo((props) => {
  const { children, name } = props;
  useTraceUpdate("FieldGroupWrapper", props);
  return (
    <div>
      <div className={styles.fieldGroupTitle}>{name}</div>
      <div className={styles.fieldGroup}>{children}</div>
    </div>
  );
});
