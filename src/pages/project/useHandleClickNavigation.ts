import { runInAction } from "mobx";

import { projectPageNavigationStore } from "@/stores/projectPageNavigationStore";

/**
 * Обработчик клика на элемент навигационной панели (левая колонка) или группы формы в основной колонке.
 * Использует MobX store projectPageNavigationStore
 * Изменят активный элемент навигационной панели, если он не является активным.
 * @param groupName - Имя группы навигационной палени
 * @param groupIndex - Индекс элемента в группе навигационной палени
 */
// export const useHandleClickNavigation = (groupNameAndIndex: string | null) => {
export const useHandleClickNavigation = (groupName: string | null, groupIndex: number | null) => {
  return () => {
    if (groupName !== null && groupIndex !== null && projectPageNavigationStore.isActiveGroup(groupName, groupIndex)) {
      // Обрываем обработку события, если это уже активный элемент
      return;
    }

    // Мгновенное обновление состояния, чтобы сразу отобразить активный элемент в навигационной панели (иначе с задержкой)
    runInAction(() => {
      projectPageNavigationStore.setActiveGroup(groupName, groupIndex);
    });

    const uniqueId = `${groupName}_${groupIndex}`;
    // const groupElement = groupNameAndIndex ? document.getElementById(groupNameAndIndex) : null;
    const groupElement = groupName ? document.getElementById(uniqueId) : null;
    const headerHeight = document.getElementsByTagName("header").item(0)?.offsetHeight;
    // const index = groupNameAndIndex ? Number(groupNameAndIndex.split("_")[1]) : 0;

    if (groupElement && headerHeight) {
      const groupPosition =
        groupElement.getBoundingClientRect().top + window.scrollY - (headerHeight + (groupIndex === 0 ? 200 : 50));

      // Скролим до выбранного элемента
      window.scrollTo({ top: groupPosition, behavior: "smooth" });
    } else {
      // Обрабатываем случай, когда элемент не найден или при загрузке страницы
      window.scrollTo({ top: headerHeight, behavior: "smooth" });
    }
  };
};
