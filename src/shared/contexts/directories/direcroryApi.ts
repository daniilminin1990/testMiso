import axios from "axios";
import { apiRoutes } from "@shared/api/apiRoutes";
import type { DirectoryContent, DirectoryContentBatch } from "@shared/types/apiTypes";

export const directoryApi = {
  // TODO: unused
  fetchDirectory: async (dirId: string): Promise<DirectoryContent[]> => {
    const response = await axios.get<DirectoryContent[]>(apiRoutes.getDirectory(dirId));
    return response.data;
  },

  fetchAllDirectories: async (): Promise<Map<string, Map<string, DirectoryContent>>> => {
    const response = await axios.get<DirectoryContentBatch>(apiRoutes.getDirectoriesBatch());

    const directoriesMap = new Map<string, Map<string, DirectoryContent>>();

    for (const [key, directory] of Object.entries(response.data.batch)) {
      const innerMap = new Map<string, DirectoryContent>();

      for (const item of directory) {
        innerMap.set(item.value, item);
      }

      directoriesMap.set(key, innerMap);
    }

    return directoriesMap;
  }
};
