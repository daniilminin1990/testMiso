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
  const groupRef = useRef<HTMLDivElement | null>(null);
  const uniqueId = `${name}_${index}`;
  // Обработчик клика по блоку
  const handleGroupClick = useHandleClickNavigation(uniqueId);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useTraceUpdate("FieldGroupWrapper", props);
  return (
    <div
      ref={groupRef ? (groupRef as MutableRefObject<HTMLDivElement>) : null}
      id={uniqueId}
      onClick={() => handleGroupClick()}
    >
      <div
        className={clsx(
          styles.fieldGroupTitle,
          projectPageNavigationStore.activeGroupNameAndIndex === uniqueId && styles.activeText
        )}
      >
        {name}
      </div>
      <div
        className={clsx(
          styles.fieldGroup,
          projectPageNavigationStore.activeGroupNameAndIndex === uniqueId && styles.active
        )}
      >
        {children}
      </div>
    </div>
  );
});

export const FieldGroupWrapper = memo(Component);
