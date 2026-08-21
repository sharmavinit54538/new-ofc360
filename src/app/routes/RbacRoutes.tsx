import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import ExitManagementPage from "@/pages/ExitManagementPage";
import CulturePage from "@/pages/CulturePage";
import RolesAndPermissionsPage from "@/pages/rbac/RolesAndPermissionsPage";

export const renderRbacRoutes = () => (
  <>
    <Route path="/exit" element={<RoleGuard module="exit"><ExitManagementPage /></RoleGuard>} />
    <Route path="/culture" element={<RoleGuard module="culture"><CulturePage /></RoleGuard>} />
    <Route path="/rbac" element={<RoleGuard module="rbac"><RolesAndPermissionsPage /></RoleGuard>} />
  </>
);
