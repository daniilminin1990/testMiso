// import { createUseStyles } from "@v-uik/base";
import { memo } from "react";

import { useTraceUpdate } from "../../../shared/hooks/debugHooks";
import * as styles from "./FieldsLayout.module.scss"; // Импорт стилей из CSS-модуля

// const useStyles = createUseStyles({
//   gridContainer: {
//     display: "grid",
//     gridTemplateColumns: "50% 50%",
//     gap: "5px"
//   }
// });

type FieldsLayoutProps = {
  children: React.ReactNode;
};

export const FieldsLayout: React.FC<FieldsLayoutProps> = memo((props) => {
  const { children } = props;
  // const styles = useStyles();
  useTraceUpdate("FieldsLayout", props);

  return <div className={styles.gridContainer}>{children}</div>;
});
