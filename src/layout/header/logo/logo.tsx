import { FC } from "react";
import { Link } from "react-router";

import * as styles from "./logo.module.scss";

interface TLogoProps {
  headline: string;
  subtitle: string;
}

export const Logo: FC<TLogoProps> = ({ headline, subtitle }) => (
  <Link to="/">
    <div className={styles.logo}>
      <span className={styles.headline}>{headline}</span>
      <span className={styles.sub}>{subtitle}</span>
    </div>
  </Link>
);
