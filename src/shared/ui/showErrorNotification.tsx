// ++
// ! ЗАМЕНА v-uik
import { notification } from "antd";

export function showErrorNotification(error: unknown): never {
  let text;
  if (error instanceof Error) {
    text = error.message;
  } else {
    text = String(error);
  }

  notification.error({
    message: "Ошибка", // Заголовок
    description: text, // Текст уведомления
    placement: "topRight", // Положение (можно настроить: topLeft, bottomRight и т.д.)
    duration: 0 // 0 означает, что уведомление не закроется автоматически
  });

  throw error;
}

// ++
// import { notification, Text } from '@v-uik/base';
// export function showErrorNotification(error: unknown): never {
//   let text;
//   if (error instanceof Error) {
//     text = error.message;
//   } else text = String(error);
//
//   notification(<Text>{text}</Text>, {
//     title: 'Ошибка',
//     direction: 'vertical',
//     autoClose: false,
//     status: 'error'
//   });
//
//   throw error;
// }
