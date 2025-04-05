import { memo } from "react";
import { Routes, Route, Navigate } from "react-router";

// TODO EDIT MININ QUESTION ПОЧЕМУ НЕ РАБОТАЕТ @ импорт???
import Page404 from "@pages/404";
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
