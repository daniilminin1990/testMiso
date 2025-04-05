import { Navigate, RouteObject, createBrowserRouter } from "react-router";

import { appPaths } from "@/app/routes/appPaths";
import Page404 from "@/pages/404";
import ProjectPage from "@/pages/project/ProjectPage";
import { ProjectListPage } from "@/pages/projectList/ProjectListPage";

import { Layout } from "../../layout/Layout";
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
  },
  {
    element: <ProjectPage />,
    path: `${appPaths.projects}/:projectId`
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
  }
  // {
  //   element: <LayoutProjectPage />, // Layout для одного проекта
  //   path: `${appPaths.projects}`,
  //   children: [...projectRoutes]
  // }
]);
