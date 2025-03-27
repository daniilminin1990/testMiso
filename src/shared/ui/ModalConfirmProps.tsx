// import type { TButtonColor } from '@v-uik/base';
import type { Dispatch, ReactNode, SetStateAction } from 'react';

// Определяем собственный тип для цветов кнопок
export type ButtonColor = 'primary' | 'secondary' | 'error' | 'success';

export type ModalConfirmState = {
  open: boolean;
  content: ReactNode;
  onConfirm: (userConfirmed: string) => void;
  onReject?: (reason: typeof modaConfirmClosedReason) => void;
};

export type ModalConfirmProps = {
  headerText: ReactNode;
  mainButtonText?: ReactNode;
  mainButtonColor?: ButtonColor; // Используем новый тип вместо TButtonColor
  mainButtonAutoFocus?: boolean;
  state: ModalConfirmState;
  setState: (state: ModalConfirmState) => void;
};

export const modalConfirmClosedState: Readonly<ModalConfirmState> = {
  open: false,
  content: undefined,
  onConfirm: () => {},
  onReject: undefined
};

export const modaConfirmClosedReason = 'closed' as const;

export async function modalConfirmPromise(message: ReactNode, setModal: Dispatch<SetStateAction<ModalConfirmState>>) {
  try {
    await new Promise<string>((resolve, reject) => {
      // Изменяем тип Promise на Promise<string>
      setModal({
        open: true,
        content: message,
        onConfirm: (userConfirmed: string) => resolve(userConfirmed), // Передаем строку из onConfirm в resolve
        onReject: reject
      });
    });
    return true;
  } catch (error) {
    if (error === modaConfirmClosedReason) return false;
    throw error; //unexpected
  }
}
