import { Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/layouts/DashboardLayout";
import { renderProtectedDashboardRoutesPart1 } from "./ProtectedDashboardRoutesPart1";
import { renderProtectedDashboardRoutesPart2 } from "./ProtectedDashboardRoutesPart2";

export const renderProtectedDashboardRoutes = () => (
  <Route element={<ProtectedRoute />}>
    <Route element={<DashboardLayout />}>
      {renderProtectedDashboardRoutesPart1()}
      {renderProtectedDashboardRoutesPart2()}
    </Route>
  </Route>
);
