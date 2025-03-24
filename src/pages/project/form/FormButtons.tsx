import type { ControlEventTransitionDto } from "@shared/types/apiTypes";
import {
  ButtonGroup,
  DropdownMenu,
  DropdownMenuItem,
  Tooltip,
  Button,
} from "@v-uik/base";
import * as styles from "./FormButtons.module.scss";
import { memo, type MutableRefObject, type ReactNode } from "react";
import { useTraceUpdate } from "../../../shared/hooks/debugHooks";
export interface FormButtonsProps {
  transitions: ControlEventTransitionDto[];
  isSubmitting: boolean;
  onSubmit: () => Promise<void>;
  buttonValueRef: MutableRefObject<ControlEventTransitionDto | null>;
}

export const FormButtons: React.FC<FormButtonsProps> = memo((props) => {
  const { transitions, onSubmit, buttonValueRef, isSubmitting } = props;
  useTraceUpdate("FormButtons", props);

  const buttons = Object.groupBy(transitions, (b) =>
    b.forward ? "forward" : "back"
  );

  const onClick = (btn: ControlEventTransitionDto | null) => {
    // eslint-disable-next-line react-compiler/react-compiler
    buttonValueRef.current = btn;
    /* await */ onSubmit();
  };

  const [forwardButton, ...forwardSkipButtons] = buttons.forward ?? [];

  return (
    <div className={styles.buttonsContainer}>
      <ButtonGroup
        color="primary" // for background fill on forward button
        value={forwardButton.active ? forwardButton.goToStatus : undefined}
        disabled={isSubmitting}
      >
        {buttons.back &&
          buttons.back.length > 0 &&
          createDropdownMenu("Вернуться к шагу...", buttons.back, onClick)}

        {forwardButton && (
          <Tooltip
            dropdownProps={{ placement: "top", content: forwardButton.note }}
          >
            <Button
              name={forwardButton.goToStatus} // for background fill
              onClick={
                !forwardButton.active
                  ? undefined
                  : () => {
                      onClick(forwardButton);
                    }
              }
            >
              {forwardButton.label}
            </Button>
          </Tooltip>
        )}

        {forwardSkipButtons.length > 0 &&
          createDropdownMenu("▼", forwardSkipButtons, onClick)}
      </ButtonGroup>
      <Button
        disabled={isSubmitting}
        onClick={() => {
          onClick(null);
        }}
      >
        Сохранить
      </Button>
    </div>
  );
});

function createDropdownMenu(
  text: ReactNode,
  buttons: ControlEventTransitionDto[],
  onClick: (btn: ControlEventTransitionDto | null) => void
) {
  return (
    <DropdownMenu
      keepMounted
      action="hover"
      placement="top-start"
      content={buttons.map((btn) => (
        <DropdownMenuItem
          key={btn.goToStatus}
          classes={{
            text: !btn.active ? styles.disabledTransition : undefined,
          }}
          // not disabled to show tooltip
          onClick={
            !btn.active
              ? undefined
              : () => {
                  onClick(btn);
                }
          }
        >
          <Tooltip dropdownProps={{ placement: "right", content: btn.note }}>
            <div>{btn.label}</div>
          </Tooltip>
        </DropdownMenuItem>
      ))}
    >
      <Button>{text}</Button>
    </DropdownMenu>
  );
}

/**
 Небольшие корректировки


 */
/**

import type { ControlEventTransitionDto } from "@shared/types/apiTypes";
import {
  ButtonGroup,
  DropdownMenu,
  DropdownMenuItem,
  Tooltip,
  Button,
} from "@v-uik/base";
import * as styles from "./FormButtons.module.scss";
import { memo, type MutableRefObject, type ReactNode } from "react";
import { useTraceUpdate } from "../../../shared/hooks/debugHooks";

export interface FormButtonsProps {
  transitions: ControlEventTransitionDto[];
  isSubmitting: boolean;
  onSubmit: () => Promise<void>;
  buttonValueRef: MutableRefObject<ControlEventTransitionDto | null>;
}

export const FormButtons = memo((props: FormButtonsProps) => {
  // Убрано React.FC
  const { transitions, onSubmit, buttonValueRef, isSubmitting } = props;
  useTraceUpdate("FormButtons", props);

  const buttons = Object.groupBy(transitions, (b) =>
    b.forward ? "forward" : "back"
  );
  const [forwardButton, ...forwardSkipButtons] = buttons.forward ?? [];

  const onClick = async (btn: ControlEventTransitionDto | null) => {
    // Добавлен await
    buttonValueRef.current = btn;
    await onSubmit().catch((err) => console.error("Submit failed:", err)); // Обработка ошибок
  };

  return (
    <div className={styles.buttonsContainer}>
      <ButtonGroup color="primary">
        {buttons.back?.length > 0 &&
          createDropdownMenu(
            "Вернуться к шагу...",
            buttons.back,
            onClick,
            isSubmitting
          )}

        {forwardButton && (
          <Tooltip
            dropdownProps={{ placement: "top", content: forwardButton.note }}
          >
            <Button
              name={forwardButton.goToStatus}
              disabled={isSubmitting || !forwardButton.active}
              onClick={() => forwardButton.active && onClick(forwardButton)}
            >
              {forwardButton.label}
            </Button>
          </Tooltip>
        )}

        {forwardSkipButtons.length > 0 &&
          createDropdownMenu("▼", forwardSkipButtons, onClick, isSubmitting)}
      </ButtonGroup>

      <Button disabled={isSubmitting} onClick={() => onClick(null)}>
        Сохранить
      </Button>
    </div>
  );
});

function createDropdownMenu(
  text: ReactNode,
  buttons: ControlEventTransitionDto[],
  onClick: (btn: ControlEventTransitionDto | null) => void,
  isSubmitting: boolean
) {
  return (
    <DropdownMenu
      keepMounted
      action="hover"
      placement="top-start"
      content={buttons.map((btn) => (
        <DropdownMenuItem
          key={btn.goToStatus}
          classes={{
            text: !btn.active ? styles.disabledTransition : undefined,
          }}
          disabled={!btn.active || isSubmitting} // Добавлено disabled
          onClick={btn.active ? () => onClick(btn) : undefined}
        >
          <Tooltip dropdownProps={{ placement: "right", content: btn.note }}>
            <div>{btn.label}</div>
          </Tooltip>
        </DropdownMenuItem>
      ))}
    >
      <Button disabled={isSubmitting}>{text}</Button>
    </DropdownMenu>
  );
}

*/
