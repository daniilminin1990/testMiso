import type { FC, ReactElement, ReactNode } from "react";
import * as styles from "./badgeItem.module.scss";
import { DropdownMenu, Badge, Button } from "@v-uik/base";

type TBadgeItem = {
  icon: ReactElement;
  title?: string;
  children?: ReactNode;
  counter?: number;
  onClick?: () => void;
  disabled?: boolean;
};

export const BadgeItem: FC<TBadgeItem> = ({
  icon,
  title,
  children,
  counter,
  onClick,
  disabled,
}) => {
  const titled = title ? styles.titled : "";

  const badge = (
    <Badge content={counter}>
      <div className={`${styles.acBadgeContent} ${titled}`}>
        <Button
          disabled={disabled}
          onClick={onClick}
          color="secondary"
          style={{
            fontSize: "24px",
            height: "inherit",
            minWidth: "100%",
            width: "100%",
          }}
        >
          <div className={styles.iconContainer}>{icon || null}</div>
          {title && <span className={styles.title}>{title}</span>}
        </Button>
      </div>
    </Badge>
  );

  return (
    <div>
      {children ? (
        <DropdownMenu content={children} action="click" placement="bottom-end">
          {badge}
        </DropdownMenu>
      ) : (
        badge
      )}
    </div>
  );
};
