import { Finder, TFinderProps } from "@shared/ui/finderItem/finderItem";
import * as styles from "./Header.module.scss";
import { AccountBadge, TAccountBadgeProps } from "./accountBadge/acBadge";
import { Logo } from "./logo/logo";
import { NavMenu } from "./nav/NavMenu";

type THeaderProps = {
  finder?: TFinderProps;
  userInfo?: TAccountBadgeProps;
};

// export const Header: FC<THeaderProps> = ({ finder, userInfo }) => (
export const Header = ({ finder, userInfo }: THeaderProps) => (
  <header className={styles.header}>
    <div className={styles.headerRow}>
      <Logo headline="АС СВА СУП" subtitle="Система управления проектами" />
      {!!userInfo && <AccountBadge {...userInfo} />}
    </div>
    <br />
    <div className={styles.headerRow}>
      <NavMenu />
      {!!finder && <Finder {...finder} />}
    </div>
  </header>
);
