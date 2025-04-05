import { ComponentPropsWithoutRef, CSSProperties } from "react";
import clsx from "clsx";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import * as s from "./Page.module.scss";

type Props = {
  mt?: CSSProperties["marginTop"];
} & ComponentPropsWithoutRef<"div">;

/**
 * Это компонент-обертка для страниц, на тот случай, если потребуется задать отступ сверху (например для Header)
 * Хоть он сейчас настроен, но если вдруг нам нужно будет работать с отступом (высотой Header), как переменной, для более удобного расчета высот компонент
 * @param className
 * @param mt
 * @param style
 * @param rest
 * @constructor
 */
export const Page = ({ className, mt = 0, style, ...rest }: Props) => {
  const classes = clsx(className, s.container);
  const styles: CSSProperties = { marginTop: mt, ...style };

  return <div className={classes} style={styles} {...rest} />;
};
