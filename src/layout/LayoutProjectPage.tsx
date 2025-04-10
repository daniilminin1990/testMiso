import { useRef, useState, UIEvent } from "react";
import { Outlet } from "react-router";
import clsx from "clsx";

import AppRouter from "@/app/routes/AppRouter";

import { Header } from "./header/Header";
import * as styles from "./LayoutProjectPage.module.scss";
// import { NotificationContainer } from '@v-uik/base';

export const LayoutProjectPage = () => {
  const [activeBlock, setActiveBlock] = useState<string | null>(null);
  const contentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({}); // Объект для хранения ссылок на элементы в виде объекта где ключ - это ID блока, а значение - ссылка на элемент

  // Пример списка блоков для левой колонки (навигационная панель)

  const blocks = ["block1", "block2", "block3", "block4"];

  // Обработчик клика по блоку
  const handleBlockClick = (blockId: string) => {
    setActiveBlock(blockId); // Устанавливаем активный блок
    const target = contentRefs.current[blockId]; // Находим элемент по ID в DOM дереве
    if (target) {
      target.scrollIntoView({
        // Плавно прокручиваем до эл-та
        behavior: "smooth"
      });
      // Специальный метод, который прокручивает до элемента, чтобы он стал видимым.
    }
  };

  // Следим за скроллом в основном контенте (центральная колонна)
  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const scrollContainer = e.currentTarget;
    for (const blockId of blocks) {
      const blockElement = contentRefs.current[blockId];

      if (blockElement) {
        const rect = blockElement.getBoundingClientRect(); // Определяем положение элемента в viewport
        if (rect.top >= 0 && rect.top <= scrollContainer.clientHeight / 2) {
          setActiveBlock(blockId);
          break; // Если элемент находится в зоне видимости, прекращаем поиск
        }
      }
    }
  };

  return (
    <div className={styles.common}>
      <Header
        // finder={{
        //   messages: { loading: 'loading', notfound: 'notfound' },
        //   onSelectItem: () => alert('onSelectItem'),
        //   initialGetter: () => Promise.resolve([{ id: '1', value: 'ival1' }]),
        //   dataGetter: (resp) => Promise.resolve([{ id: '1', value: 'val1' }, { id: '1', value: 'val2' }]),
        // }}
        userInfo={{
          notice: {
            notificationsNumber: 5,
            onShowNotifications: () => alert("onShowNotifications")
          },
          onShowInfo: () => alert("onShowInfo"),
          profile: {
            name: "Филимонов Арсений Денисович",
            onOpenSettings: () => alert("onOpenSettings"),
            onLogOut: () => alert("onLogOut")
          }
        }}
      />
      <div className={styles.container}>
        {/* Левая колонна (навигационная)*/}
        <aside className={clsx(styles.sidebar, styles.leftSide)}>
          {blocks.map((blockId) => {
            return (
              <div key={blockId} className={styles.block} onClick={() => handleBlockClick(blockId)}>
                {blockId}
              </div>
            );
          })}
        </aside>

        {/* Основной контент, центральная колонна */}
        <main className={styles.content} onScroll={handleScroll}>
          {/* Кидаем ref-ы в ProjectPage */}
          <Outlet context={contentRefs} />
          {/*<NotificationContainer nextNotification position="top-right" autoClose={1500} limit={5} />*/}
        </main>

        {/* Правая колонна (справа от основного контента) */}
        <aside className={clsx(styles.sidebar, styles.rightSide)}>Hello World!</aside>
      </div>
    </div>
  );
};
