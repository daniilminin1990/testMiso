// src/stores/NavigationStore.ts
import { makeAutoObservable } from "mobx";

class ProjectPageNavigationStore {
  activeGroupIndex: number | null = 0; // Сделаем активынм 1 блок
  // isScrolling: boolean = false;
  // isInitialLoad: boolean = true; // Флаг начальной загрузки

  constructor() {
    makeAutoObservable(this);
  }

  setActiveGroupIndex(id: number) {
    this.activeGroupIndex = id;
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
