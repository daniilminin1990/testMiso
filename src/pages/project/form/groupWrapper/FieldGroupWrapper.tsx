import { memo, ReactNode, useRef, FC, MutableRefObject } from "react";
import clsx from "clsx";
import { observer } from "mobx-react-lite";

import { useHandleClickNavigation } from "@/pages/project/useHandleClickNavigation";
import { useTraceUpdate } from "@/shared/hooks/debugHooks";

import { projectPageNavigationStore } from "../../../../stores/projectPageNavigationStore";
import * as styles from "./FieldGroupWrapper.module.scss";

interface IGroupWrapper {
  children?: ReactNode;
  name: string;
  index: number;
}

const Component: FC<IGroupWrapper> = observer((props) => {
  const { children, name, index } = props;
  // Для слайдинга
  // ++
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const groupRef = useRef<HTMLDivElement | null>(null);
  // Обработчик клика по блоку
  const handleGroupClick = useHandleClickNavigation(index);

  const borderStyle = projectPageNavigationStore.activeGroupId === index ? "1px solid red" : "1px solid blue";
  // ++

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useTraceUpdate("FieldGroupWrapper", props);
  return (
    <div
      ref={groupRef ? (groupRef as MutableRefObject<HTMLDivElement>) : null}
      id={index.toString()}
      onClick={() => handleGroupClick()}
    >
      <div
        className={clsx(
          styles.fieldGroupTitle,
          projectPageNavigationStore.activeGroupIndex === index && styles.activeText
        )}
      >
        {name}
      </div>
      <div className={clsx(styles.fieldGroup, projectPageNavigationStore.activeGroupIndex === index && styles.active)}>
        {children}
      </div>
    </div>
  );
});

export const FieldGroupWrapper = memo(Component);
