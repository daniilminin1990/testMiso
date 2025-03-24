import { notification, Text } from "@v-uik/base";
export function showErrorNotification(error: unknown): never {
  let text;
  if (error instanceof Error) {
    text = error.message;
  } else text = String(error);

  notification(<Text>{text}</Text>, {
    title: "Ошибка",
    direction: "vertical",
    autoClose: false,
    status: "error",
  });

  throw error;
}
