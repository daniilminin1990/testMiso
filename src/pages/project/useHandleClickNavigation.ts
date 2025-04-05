import { runInAction } from "mobx";

import { projectPageNavigationStore } from "@/stores/projectPageNavigationStore";

/**
 * Обработчик клика на элемент навигационной панели (левая колонка) или группы формы в основной колонке.
 * Использует MobX store projectPageNavigationStore
 * Изменят активный элемент навигационной панели, если он не является активным.
 * @param index - индекс элемента навигационной панели
 */
export const useHandleClickNavigation = (index: number) => {
  return () => {
    if (projectPageNavigationStore.activeGroupIndex === index) {
      // Обрываем обработку события, если это уже активный элемент
      return;
    }

    // Мгновенное обновление состояния, чтобы сразу отобразить активный элемент в навигационной панели (иначе с задержкой)
    runInAction(() => {
      projectPageNavigationStore.setActiveGroupIndex(index);
    });

    const groupElement = document.getElementById(index.toString());
    const headerHeight = document.getElementsByTagName("header").item(0)?.offsetHeight;

    if (groupElement && headerHeight) {
      const groupPosition =
        groupElement.getBoundingClientRect().top + window.scrollY - (headerHeight + (index === 0 ? 100 : 50));

      // Скролим до выбранного элемента
      window.scrollTo({ top: groupPosition, behavior: "smooth" });
    }
  };
};
