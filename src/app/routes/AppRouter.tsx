import { Routes, Route, Navigate } from "react-router";
// TODO EDIT -- лучше использовать react-router-dom, потому что он содержит больше полезных функций и компонент для маршрутизации.
// ПРОВЕРИТЬ react-router-dom
// TODO EDIT MININ QUESTION ПОЧЕМУ НЕ РАБОТАЕТ @ импорт???
import Page404 from "@pages/404";

import { memo } from "react";
// import { ProjectListPage } from "@pages/projectList/ProjectListPage";
import ProjectPage from "@pages/project/ProjectPage";
import { ProjectListPage } from "@pages/projectList/ProjectListPage";

// TODO EDIT -- оборачивание в memo избыточно, потому что AooRiyterне принимает пропсы
export default memo(function AppRouter() {
  return (
    <Routes>
      <Route index element={<Navigate to="/projects" replace />} />
      <Route path="/projects" element={<ProjectListPage />} />
      <Route path="/projects/:projectId" element={<ProjectPage />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
});
