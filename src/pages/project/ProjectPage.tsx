// import { notification, Text } from '@v-uik/base';
import { notification } from "antd"; // Замена notification из @v-uik/base
import { memo, MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { projectPageApi } from "@pages/project/projectPageApi";
import { ControlEventForm, type ControlEventFormProps } from "@pages/project/form/ControlEventForm";
import type { ControlEventDto, FormFieldDescriptor } from "@shared/types/apiTypes";
import { showErrorNotification } from "@shared/ui/showErrorNotification";
import { ModalConfirm } from "@shared/ui/ModalConfirm";
import { modalConfirmClosedState, modalConfirmPromise } from "@shared/ui/ModalConfirmProps";
import PageTitle from "@shared/ui/PageTitle";
import { useOutletContext } from "react-router";

function translateError(key: string) {
  switch (key) {
    case "is required":
      return "не заполнено";
    default:
      return key;
  }
}

const ProjectPage = memo(() => {
  const { projectId } = useParams() as { projectId: string };
  const [data, setData] = useState<ControlEventDto>();
  const [modal, setModal] = useState(modalConfirmClosedState);
  const prevEditNotificationIdRef = useRef<string | null>(null);
  // ++
  const [pageTitle, setPageTitle] = useState<string>(""); // Состояние для заголовка
  // ++

  const { contentRefs } = useOutletContext<{
    contentRefs: MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
  }>();

  const blocks = ["block1", "block2", "block3", "block4"];

  // ПОЛУЧЕНИЕ ДАННЫХ
  const fetchProject = useCallback(
    (projectId: string) => projectPageApi.fetch(projectId).then(setData).catch(showErrorNotification),
    []
  );

  useEffect(() => {
    /* await */ fetchProject(projectId);
  }, [projectId, fetchProject]);

  // ++
  // Устанавливаем заголовок страницы при получении данных
  useEffect(() => {
    if (data) {
      const tempNumberField = data.fields.find((x) => x.descriptor.propDescriptor.id === "TempNumber");
      const numberField = data.fields.find((x) => x.descriptor.propDescriptor.id === "Number");
      const title = tempNumberField?.value || numberField?.value || "Проект";
      setPageTitle(`Проект ${title}`);
    }
  }, [data]);
  // ++

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

  console.log({ data });
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
      <PageTitle title={pageTitle} />
      <ControlEventForm data={data} handleSubmit={submit} />
      <ModalConfirm headerText="Переход на статус" state={modal} setState={setModal} />
    </>
  ) : (
    "Loading..."
  );
});

export default ProjectPage;
