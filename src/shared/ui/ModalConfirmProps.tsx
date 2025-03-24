import type { TButtonColor } from "@v-uik/base";
import type { Dispatch, ReactNode, SetStateAction } from "react";

export type ModalConfirmState = {
  open: boolean;
  content: ReactNode;
  onConfirm: () => void;
  onReject?: (reason: typeof modaConfirmClosedReason) => void;
};

export type ModalConfirmProps = {
  headerText: ReactNode;
  mainButtonText?: ReactNode;
  mainButtonColor?: TButtonColor;
  mainButtonAutoFocus?: boolean;
  state: ModalConfirmState;
  setState: (state: ModalConfirmState) => void;
};

export const modalConfirmClosedState: Readonly<ModalConfirmState> = {
  open: false,
  content: undefined,
  onConfirm: () => {},
  onReject: undefined,
};

export const modaConfirmClosedReason = "closed" as const;

export async function modalConfirmPromise(
  message: ReactNode,
  setModal: Dispatch<SetStateAction<ModalConfirmState>>
) {
  try {
    await new Promise<void>((resolve, reject) => {
      setModal({
        open: true,
        content: message,
        onConfirm: resolve,
        onReject: reject,
      });
    });
    return true;
  } catch (error) {
    if (error === modaConfirmClosedReason) return false;
    throw error; //unexpected
  }
}
