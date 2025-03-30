import { Navigate, RouteObject } from "react-router";

import { ProjectListPage } from "@pages/projectList/ProjectListPage";
import { appPaths } from "@app/routes/appPaths";
import ProjectPage from "@pages/project/ProjectPage";
import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../../layout/Layout";
import Page404 from "@pages/404";
import { LayoutProjectPage } from "../../layout/LayoutProjectPage";

const simpleRoutes: RouteObject[] = [
  {
    element: <Navigate to={appPaths.projects} replace />,
    path: `${appPaths.base}`
  },
  {
    element: <ProjectListPage />,
    path: `${appPaths.projects}`
  },
  {
    element: <Page404 />,
    path: `${appPaths["*"]}`
  }
];

// Для ProjectPage сделаем отдельный роутер со своим Layout
const projectRoutes: RouteObject[] = [
  {
    element: <ProjectPage />,
    path: `${appPaths.projects}/:projectId`
  }
];

export const router = createBrowserRouter([
  {
    element: <Layout />,
    path: `${appPaths.base}`,
    children: [...simpleRoutes]
  },
  {
    element: <LayoutProjectPage />, // Layout для одного проекта
    path: `${appPaths.projects}`,
    children: [...projectRoutes]
  }
]);
