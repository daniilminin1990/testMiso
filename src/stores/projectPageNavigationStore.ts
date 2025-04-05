// src/stores/NavigationStore.ts
import { makeAutoObservable } from "mobx";

class ProjectPageNavigationStore {
  // activeGroupNameAndIndex: string | null = null;
  activeGroupName: string | null = null;
  activeGroupIndex: number | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // setActiveGroupNameAndIndex(groupNameWithIndex: string | null) {
  //   this.activeGroupNameAndIndex = groupNameWithIndex;
  // }

  setActiveGroup(groupName: string | null, groupIndex: number | null) {
    this.activeGroupName = groupName;
    this.activeGroupIndex = groupIndex;
  }

  isActiveGroup(groupName: string, groupIndex: number) {
    return this.activeGroupName === groupName && this.activeGroupIndex === groupIndex;
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
