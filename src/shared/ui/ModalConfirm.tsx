import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@v-uik/base";
import { memo } from "react";
import {
  modalConfirmClosedState,
  modaConfirmClosedReason,
  type ModalConfirmProps,
  type ModalConfirmState,
} from "./ModalConfirmProps";

export const ModalConfirm = memo(
  ({
    headerText,
    mainButtonText = "Подтвердить",
    mainButtonColor = "primary",
    mainButtonAutoFocus = true,
    state,
    setState,
  }: ModalConfirmProps) => {
    const cancel = () => {
      reset(state, setState);
      state.onReject?.(modaConfirmClosedReason);
    };
    return (
      <Modal open={state.open} onClose={cancel}>
        <ModalHeader showCloseButton={false}>{headerText}</ModalHeader>
        <ModalBody>{state.content}</ModalBody>
        <ModalFooter>
          <Button kind="outlined" onClick={cancel}>
            Отмена
          </Button>
          <Button
            autoFocus={mainButtonAutoFocus}
            color={mainButtonColor}
            onClick={() => {
              reset(state, setState);
              state.onConfirm();
            }}
          >
            {mainButtonText}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
);

function reset(
  prev: ModalConfirmState,
  setState: (state: ModalConfirmState) => void
) {
  setState({
    ...modalConfirmClosedState,
    content: prev.content, // preserve previous content, otherwise modal would blink on close
  });
}
