import { Routes, Route } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import { renderPublicRoutes } from "./PublicRoutes";
import { renderProtectedDashboardRoutes } from "./ProtectedDashboardRoutes";

export function AppRoutes() {
  return (
    <Routes>
      {renderPublicRoutes()}
      {renderProtectedDashboardRoutes()}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
