import axios from "axios";

import { apiRoutes, type GetProjectListParams } from "@shared/api/apiRoutes";
import type { PropertyDescriptor, ControlEventListDtoPagedResult } from "@shared/types/apiTypes";
export const projectListApi = {
  fetchRecords: async (options: GetProjectListParams) => {
    const response = await axios.get<ControlEventListDtoPagedResult>(apiRoutes.getProjectListItems(), {
      params: options
    });
    return response.data;
  },

  fetchMeta: async () => {
    const response = await axios.get<PropertyDescriptor[]>(apiRoutes.getProjectListMeta());
    return response.data;
  }
};
