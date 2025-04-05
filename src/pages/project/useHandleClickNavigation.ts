import { runInAction } from "mobx";

import { projectPageNavigationStore } from "@/stores/projectPageNavigationStore";

/**
 * Обработчик клика на элемент навигационной панели (левая колонка) или группы формы в основной колонке.
 * Использует MobX store projectPageNavigationStore
 * Изменят активный элемент навигационной панели, если он не является активным.
 * @param groupNameAndIndex - Имя группы элемента навигационной палени с индексом
 */
export const useHandleClickNavigation = (groupNameAndIndex: string | null) => {
  return () => {
    if (projectPageNavigationStore.activeGroupNameAndIndex === groupNameAndIndex) {
      // Обрываем обработку события, если это уже активный элемент
      return;
    }

    // Мгновенное обновление состояния, чтобы сразу отобразить активный элемент в навигационной панели (иначе с задержкой)
    runInAction(() => {
      projectPageNavigationStore.setActiveGroupNameAndIndex(groupNameAndIndex);
    });

    const groupElement = groupNameAndIndex ? document.getElementById(groupNameAndIndex) : null;
    const headerHeight = document.getElementsByTagName("header").item(0)?.offsetHeight;
    const index = groupNameAndIndex ? Number(groupNameAndIndex.split("_")[1]) : 0;

    if (groupElement && headerHeight) {
      const groupPosition =
        groupElement.getBoundingClientRect().top + window.scrollY - (headerHeight + (index === 0 ? 200 : 50));

      // Скролим до выбранного элемента
      window.scrollTo({ top: groupPosition, behavior: "smooth" });
    } else {
      // Обрабатываем случай, когда элемент не найден или при загрузке страницы
      window.scrollTo({ top: headerHeight, behavior: "smooth" });
    }
  };
};
