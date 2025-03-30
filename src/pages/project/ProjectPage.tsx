// import { notification, Text } from '@v-uik/base';
import { notification } from "antd"; // Замена notification из @v-uik/base
import { memo, MutableRefObject, UIEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { projectPageApi } from "@pages/project/projectPageApi";
import { ControlEventForm, type ControlEventFormProps } from "@pages/project/form/ControlEventForm";
import type { ControlEventDto, FormFieldDescriptor } from "@shared/types/apiTypes";
import { showErrorNotification } from "@shared/ui/showErrorNotification";
import { ModalConfirm } from "@shared/ui/ModalConfirm";
import { modalConfirmClosedState, modalConfirmPromise } from "@shared/ui/ModalConfirmProps";
import PageTitle from "@shared/ui/PageTitle";
import { Outlet, useOutletContext } from "react-router";
import * as styles from "./ProjectPage.module.scss";
import clsx from "clsx";
import { undoPartial } from "@shared/types/utils";
import { projectPageNavigationStore } from "../../stores/projectPageNavigationStore";
import { observer } from "mobx-react-lite";

function translateError(key: string) {
  switch (key) {
    case "is required":
      return "не заполнено";
    default:
      return key;
  }
}

const ProjectPage = memo(
  observer(() => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { projectId } = useParams() as { projectId: string };
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [data, setData] = useState<ControlEventDto>();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [modal, setModal] = useState(modalConfirmClosedState);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const prevEditNotificationIdRef = useRef<string | null>(null);

    // ++
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [pageTitle, setPageTitle] = useState<string>(""); // Состояние для заголовка
    // ++

    // ПОЛУЧЕНИЕ ДАННЫХ
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const fetchProject = useCallback(
      (projectId: string) => projectPageApi.fetch(projectId).then(setData).catch(showErrorNotification),
      []
    );

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      /* await */ fetchProject(projectId);
    }, [projectId, fetchProject]);

    // ++
    // Устанавливаем заголовок страницы при получении данных
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (data) {
        const tempNumberField = data.fields.find((x) => x.descriptor.propDescriptor.id === "TempNumber");
        const numberField = data.fields.find((x) => x.descriptor.propDescriptor.id === "Number");
        const title = tempNumberField?.value || numberField?.value || "Проект";
        setPageTitle(`Проект ${title}`);
      }
    }, [data]);
    // ++

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const submit = useCallback<ControlEventFormProps["handleSubmit"]>(
      async (values, btn) => {
        if (!data) {
          return;
        } // unexpected

        if (btn) {
          const message = (
            <span>
              Вы уверены, что хотите перейти на статус <b>"{btn.label}"</b>?
              <br />
              Текущий статус: <b>"{data.status.description}"</b>.
            </span>
          );
          if (!(await modalConfirmPromise(message, setModal))) {
            return;
          }
        }

        const res = await projectPageApi.updateForm(projectId, {
          values,
          goToStatus: btn?.goToStatus,
          timestamp: data.timestamp
        });

        // TODO EDIT MININ думаю это можно было бы упростить, все что касается наполнения для notification вынести в отдельную функцию, иначе тут дублируется код.
        switch (res.status) {
          case "ok":
            // if (prevEditNotificationIdRef.current !== null) notification.close(prevEditNotificationIdRef.current);
            // prevEditNotificationIdRef.current = notification('Данные обновлены.', {
            //   title: 'Успешное сохранение',
            //   direction: 'vertical',
            //   status: 'success'
            // });
            // /* await */ fetchProject(projectId); // update timestamp

            // ! ЗАМЕНА ПОШЛА
            notification.success({
              message: "Успешное сохранение",
              description: "Данные обновлены.",
              placement: "topRight"
            });
            void fetchProject(projectId); // Обновляем данные

            break;

          case "validation": {
            const text = Object.entries(res.errorData).map(([pathStr, errors]) => {
              const path = pathStr.split(".");
              path.shift(); // '$'
              let ffd: FormFieldDescriptor[] | undefined = data.fields.map((x) => x.descriptor);
              let fd: FormFieldDescriptor | undefined;

              let title: string[] | null = [];

              for (let segment of path) {
                let index;
                if (segment.endsWith("]")) {
                  const ind = segment.indexOf("[");
                  index = (1 + Number(segment.substring(ind + 1, segment.length - 1))).toString();
                  segment = segment.substring(0, ind);
                }
                fd = ffd?.find((x) => x.propDescriptor.id === segment);
                if (!fd) {
                  title = null;
                  break;
                } // unexpected
                title.push(fd.propDescriptor.title);
                ffd = fd.children;
                if (index) {
                  title.push(index);
                }
              }

              return (
                <div key={pathStr}>
                  {title?.join(" ➤ ") ?? pathStr}: {errors.map(translateError).join(", ")}.
                </div>
              );
            });

            // if (prevEditNotificationIdRef.current !== null) notification.close(prevEditNotificationIdRef.current);
            // prevEditNotificationIdRef.current = notification(text, {
            //   title: 'Ошибка при сохранении',
            //   direction: 'vertical',
            //   autoClose: false,
            //   status: 'error'
            // });

            // ! Замена пошла
            notification.error({
              message: "Ошибка при сохранении",
              description: <div>{text}</div>,
              placement: "topRight",
              duration: 0 // Не закрывать автоматически
            });

            break;
          }
          case "conflict":
            // if (prevEditNotificationIdRef.current !== null) notification.close(prevEditNotificationIdRef.current);
            // prevEditNotificationIdRef.current = notification('Данные устарели, обновите форму.', {
            //   title: 'Ошибка при сохранении',
            //   direction: 'vertical',
            //   autoClose: false,
            //   status: 'error'
            // });

            // ! Замена пошла
            notification.error({
              message: "Ошибка при сохранении",
              description: "Данные устарели, обновите форму.",
              placement: "topRight",
              duration: 0
            });

            break;
          case "error":
            // if (prevEditNotificationIdRef.current !== null) notification.close(prevEditNotificationIdRef.current);
            // prevEditNotificationIdRef.current = notification('Неизвестная ошибка.', {
            //   title: 'Ошибка при сохранении',
            //   direction: 'vertical',
            //   autoClose: false,
            //   status: 'error'
            // });

            // ! Замена пошла
            notification.error({
              message: "Ошибка при сохранении",
              description: "Неизвестная ошибка.",
              placement: "topRight",
              duration: 0
            });
            break;
        }
      },
      [data, projectId, fetchProject]
    );

    // ЛОГИКА ДЛЯ СКРОЛЛИНГА

    console.log({ data, fields: data?.fields });
    const allGroups = data?.fields.map((x) => x.descriptor.propDescriptor.group);
    const groups = Array.from(new Set(allGroups));
    console.log({ groups });

    const handleClickForNavigationSidebar = (index: number) => {
      const groupElement = document.getElementById(index.toString());
      if (groupElement) {
        const headerHeight = 200; // Высота header
        const groupPosition = groupElement.getBoundingClientRect().top + window.scrollY - headerHeight;
        projectPageNavigationStore.setActiveGroupId(index);

        // Прокручиваем к блоку
        window.scrollTo({ top: groupPosition, behavior: "smooth" });
      }
    };

    // Пример списка блоков для левой колонки (навигационная панель)

    return data ? (
      <>
        {/* TODO EDIT MININ PageTitle это не компонента, а просто функция => мелкая буква, вытащить из JSX и сделать в useEffect */}
        {/*<PageTitle*/}
        {/*  title={*/}
        {/*    'Проект ' +*/}
        {/*    data.fields.find((x) => {*/}
        {/*      const id = x.descriptor.propDescriptor.id;*/}
        {/*      return id === 'TempNumber' || id === 'Number';*/}
        {/*    })?.value*/}
        {/*  }*/}
        {/*/>*/}
        <div className={styles.container}>
          {/* Левая колонна (навигационная)*/}
          <nav className={clsx(styles.sidebar, styles.leftSide)}>
            {groups.map((groupName, index) => {
              return (
                <div
                  key={index}
                  className={styles.group}
                  onClick={() => handleClickForNavigationSidebar(index)}
                  style={{
                    cursor: "pointer",
                    fontWeight: projectPageNavigationStore.activeGroupId === index ? "bold" : "normal",
                    color: projectPageNavigationStore.activeGroupId === index ? "blue" : "black"
                  }}
                >
                  {groupName}
                </div>
              );
            })}
          </nav>

          {/* Основной контент, центральная колонна */}
          <div className={styles.content}>
            <PageTitle title={pageTitle} />
            <ControlEventForm data={data} handleSubmit={submit} />
            <ModalConfirm headerText="Переход на статус" state={modal} setState={setModal} />
            {/*<NotificationContainer nextNotification position="top-right" autoClose={1500} limit={5} />*/}
          </div>

          {/* Правая колонна (справа от основного контента) */}
          <aside className={clsx(styles.sidebar, styles.rightSide)}>Hello World!</aside>
        </div>
      </>
    ) : (
      "Loading..."
    );
  })
);

export default ProjectPage;
