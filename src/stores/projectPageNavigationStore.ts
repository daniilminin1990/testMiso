// src/stores/NavigationStore.ts
import { makeAutoObservable } from "mobx";

class ProjectPageNavigationStore {
  activeGroupNameAndIndex: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setActiveGroupNameAndIndex(groupNameWithIndex: string | null) {
    this.activeGroupNameAndIndex = groupNameWithIndex;
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
