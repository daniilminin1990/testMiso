// import type { FC, ReactElement, ReactNode } from "react";
// import * as styles from "./BadgeItem.module.scss";
// import { DropdownMenu, Badge, Button } from "@v-uik/base";

// type TBadgeItem = {
//   icon: ReactElement;
//   title?: string;
//   children?: ReactNode;
//   counter?: number;
//   onClick?: () => void;
//   disabled?: boolean;
// };

// export const BadgeItem: FC<TBadgeItem> = ({
//   icon,
//   title,
//   children,
//   counter,
//   onClick,
//   disabled,
// }) => {
//   const titled = title ? styles.titled : "";

//   const badge = (
//     <Badge content={counter}>
//       <div className={`${styles.acBadgeContent} ${titled}`}>
//         <Button
//           disabled={disabled}
//           onClick={onClick}
//           color="secondary"
//           style={{
//             fontSize: "24px",
//             height: "inherit",
//             minWidth: "100%",
//             width: "100%",
//           }}
//         >
//           <div className={styles.iconContainer}>{icon || null}</div>
//           {title && <span className={styles.title}>{title}</span>}
//         </Button>
//       </div>
//     </Badge>
//   );

//   return (
//     <div>
//       {children ? (
//         <DropdownMenu content={children} action="click" placement="bottom-end">
//           {badge}
//         </DropdownMenu>
//       ) : (
//         badge
//       )}
//     </div>
//   );
// };

import type { FC, ReactElement, ReactNode } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import * as styles from './BadgeItem.module.scss';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

type TBadgeItem = {
  icon: ReactElement;
  title?: string;
  children?: ReactNode;
  counter?: number;
  onClick?: () => void;
  disabled?: boolean;
};

export const BadgeItem: FC<TBadgeItem> = ({ icon, title, children, counter, onClick, disabled }) => {
  const titled = title ? styles.titled : '';

  // Компонент Badge реализован через div с числом
  const badgeContent = (
    <div className={`${styles.acBadgeContent} ${titled}`}>
      <button
        disabled={disabled}
        onClick={onClick}
        className={styles.button} // Предполагается, что вы добавите стили для кнопки в SCSS
        style={{
          fontSize: '24px',
          height: 'inherit',
          minWidth: '100%',
          width: '100%'
        }}
      >
        <div className={styles.iconContainer}>{icon || null}</div>
        {title && <span className={styles.title}>{title}</span>}
      </button>
    </div>
  );

  const badge = (
    <div className={styles.badgeWrapper}>
      {badgeContent}
      {counter !== undefined && counter > 0 && <span className={styles.badgeCounter}>{counter}</span>}
    </div>
  );

  return (
    <div>
      {children ? (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>{badge}</DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className={styles.dropdownContent} // Добавьте стили для контента выпадающего меню
              side="bottom"
              align="end"
            >
              {children}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      ) : (
        badge
      )}
    </div>
  );
};
