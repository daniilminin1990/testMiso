// @ts-ignore

import { memo, ReactNode, useRef } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import * as styles from "./FieldGroupWrapper.module.scss";
import { FC } from "react";
import { useTraceUpdate } from "@shared/hooks/debugHooks";
import { projectPageNavigationStore } from "../../../../stores/projectPageNavigationStore";
import { observer } from "mobx-react-lite";

interface IGroupWrapper {
  children?: ReactNode;
  name: string;
  index: number;
}

export const FieldGroupWrapper: FC<IGroupWrapper> = memo(
  observer((props) => {
    const { children, name, index } = props;
    // Для слайдинга
    // ++
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const groupRef = useRef<HTMLDivElement | null>(null);
    // Обработчик клика по блоку
    const handleGroupClick = () => {
      if (projectPageNavigationStore.activeGroupId === index) {
        console.log("Не нажал в FIELDGROUOPWRAPPER");
        return;
      }
      console.log("НАЖАЛ В FIELDGROUOPWRAPPER");
      const groupElement = document.getElementById(index.toString());
      if (groupElement) {
        const headerHeight = 200; // Высота header
        const groupPosition = groupElement.getBoundingClientRect().top + window.scrollY - headerHeight;

        // Устанавливаем активный блок
        projectPageNavigationStore.setActiveGroupId(index);

        // Прокручиваем к блоку
        window.scrollTo({ top: groupPosition, behavior: "smooth" });
      }
    };
    const borderStyle = projectPageNavigationStore.activeGroupId === index ? "1px solid red" : "1px solid blue";
    // ++

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTraceUpdate("FieldGroupWrapper", props);
    return (
      <div id={index.toString()} ref={groupRef} onClick={handleGroupClick} style={{ border: borderStyle }}>
        <div className={styles.fieldGroupTitle}>{name}</div>
        <div className={styles.fieldGroup}>{children}</div>
      </div>
    );
  })
);
