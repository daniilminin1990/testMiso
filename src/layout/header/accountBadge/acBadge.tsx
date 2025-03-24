import type { FC } from "react";
import { FaBell, FaInfoCircle, FaTh, FaUser } from "react-icons/fa";
import { DropdownMenuItem } from "@v-uik/base";
import { BadgeItem } from "@shared/ui/badgeItem/badgeItem";
import * as styles from "./acBadge.module.scss";

type TProfileBadge = {
  name: string;
  onLogOut: () => void;
  onOpenSettings: () => void;
};

type TNoticesBadge = {
  notificationsNumber: number;
  onShowNotifications: () => void;
};

export type TAccountBadgeProps = {
  profile: TProfileBadge;
  notice: TNoticesBadge;
  onShowInfo: () => void;
};

export const AccountBadge: FC<TAccountBadgeProps> = ({
  notice,
  profile,
  onShowInfo,
}) => (
  <div className={styles.container}>
    {/* USER PROFILE */}
    <BadgeItem icon={<FaUser />} title={profile.name}>
      <DropdownMenuItem onClick={profile.onOpenSettings}>
        Настройки
      </DropdownMenuItem>
      <DropdownMenuItem onClick={profile.onLogOut}>Выход</DropdownMenuItem>
    </BadgeItem>

    {/* NOTIFICATIONS */}
    <BadgeItem
      icon={<FaBell />}
      counter={notice.notificationsNumber}
      onClick={notice.onShowNotifications}
    />

    {/* INFO */}
    <BadgeItem icon={<FaInfoCircle />} onClick={onShowInfo} />

    {/* MENU */}
    <BadgeItem icon={<FaTh />}>
      {/* <DropdownMenuItem>Menu item</DropdownMenuItem> */}
      <div>Hello!</div>
    </BadgeItem>
  </div>
);
