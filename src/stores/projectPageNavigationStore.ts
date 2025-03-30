// src/stores/NavigationStore.ts
import { makeAutoObservable } from "mobx";

class ProjectPageNavigationStore {
  activeGroupId: number | null = 0; // Сделаем активынм 1 блок
  // isScrolling: boolean = false;
  // isInitialLoad: boolean = true; // Флаг начальной загрузки

  constructor() {
    makeAutoObservable(this);
  }

  setActiveGroupId(id: number) {
    this.activeGroupId = id;
  }

  // setIsScrolling(scrolling: boolean) {
  //   this.isScrolling = scrolling;
  // }
  //
  // setIsInitialLoad(initialLoad: boolean) {
  //   this.isInitialLoad = initialLoad;
  // }
}

export const projectPageNavigationStore = new ProjectPageNavigationStore();
