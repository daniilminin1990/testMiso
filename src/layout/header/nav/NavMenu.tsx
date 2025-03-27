import { NavLink, type NavLinkRenderProps } from 'react-router';
import * as styles from './NavMenu.module.scss';
import type { FC } from 'react';

function isActive({ isActive }: NavLinkRenderProps) {
  return isActive ? styles.current : undefined;
}

export const NavMenu: FC = () => (
  <nav className={styles.menuContainer}>
    <NavLink end to="/projects" className={isActive}>
      Центр проектов
    </NavLink>
  </nav>
);
