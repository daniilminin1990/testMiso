// import {
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Button,
// } from "@v-uik/base";
import * as Dialog from '@radix-ui/react-dialog';
import * as styles from './ModalConfirm.module.scss';
import { memo } from 'react';
import {
  modalConfirmClosedState,
  modaConfirmClosedReason,
  type ModalConfirmProps,
  type ModalConfirmState
} from './ModalConfirmProps';

export const ModalConfirm = memo(
  ({
    headerText,
    mainButtonText = 'Подтвердить',
    mainButtonColor = 'primary',
    mainButtonAutoFocus = true,
    state,
    setState
  }: ModalConfirmProps) => {
    const cancel = () => {
      reset(state, setState);
      state.onReject?.(modaConfirmClosedReason);
    };

    // const confirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    //   e.preventDefault();
    //   reset(state, setState);
    //   state.onConfirm('user confirmed'); // Явно передаем строку
    // };
    const confirm = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      reset(state, setState);
      state.onConfirm('user confirmed');
    };
    return (
      // <Modal open={state.open} onClose={cancel}>
      //   <ModalHeader showCloseButton={false}>{headerText}</ModalHeader>
      //   <ModalBody>{state.content}</ModalBody>
      //   <ModalFooter>
      //     <Button kind="outlined" onClick={cancel}>
      //       Отмена
      //     </Button>
      //     <Button
      //       autoFocus={mainButtonAutoFocus}
      //       color={mainButtonColor}
      //       onClick={() => {
      //         reset(state, setState);
      //         state.onConfirm();
      //       }}
      //     >
      //       {mainButtonText}
      //     </Button>
      //   </ModalFooter>
      // </Modal>
      <Dialog.Root open={state.open} onOpenChange={(open) => !open && cancel()}>
        <Dialog.Portal>
          <Dialog.Overlay className={styles.overlay} />
          <Dialog.Content className={styles.content}>
            <Dialog.Title className={styles.header}>{headerText}</Dialog.Title>
            <div className={styles.body}>{state.content}</div>
            <div className={styles.footer}>
              <button className={`${styles.button} ${styles.cancelButton}`} onClick={cancel}>
                Отмена
              </button>
              <button
                autoFocus={mainButtonAutoFocus}
                className={`${styles.button} ${styles.confirmButton} ${
                  mainButtonColor === 'primary' ? styles.primary : ''
                }`}
                onClick={confirm} // Теперь тип совместим
              >
                {mainButtonText}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }
);

function reset(prev: ModalConfirmState, setState: (state: ModalConfirmState) => void) {
  setState({
    ...modalConfirmClosedState,
    content: prev.content // preserve previous content, otherwise modal would blink on close
  });
}
