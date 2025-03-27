export interface GetProjectListParams {
  filter?: string;
  page: number;
  pageSize: number;
  orderBy?: string;
  orderDesc?: boolean;
}

const base = process.env.REACT_APP_BASE_ROUTE as string;

export const apiRoutes = {
  getProject: (id: string) => `${base}/controlevent/${id}`,
  updateProject: (id: string) => `${base}/controlevent/${id}`,
  getDirectory: (id: string) => `${base}/directory/${id}`,
  getDirectoriesBatch: () => `${base}/directory/batchForControlEvent`,
  getProjectListItems: () => `${base}/controlevent/list`,
  getProjectListMeta: () => `${base}/controlevent/list/meta`,
  createProject: () => `${base}/controlevent/create`
};
