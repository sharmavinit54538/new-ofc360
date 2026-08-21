import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import ITAdminDashboardPage from "@/pages/dashboards/ITAdminDashboardPage";
import SSOPage from "@/pages/it-admin/SSOPage";
import AccessPage from "@/pages/it-admin/AccessPage";
import SecurityPage from "@/pages/it-admin/SecurityPage";

export const renderITAdminAccessRoutes = () => (
  <>
    <Route path="/it-admin" element={<ITAdminDashboardPage />} />
    <Route path="/it-admin/sso" element={<RoleGuard allowedRoles={["it_admin", "hr_admin"]}><SSOPage /></RoleGuard>} />
    <Route path="/it-admin/access" element={<RoleGuard allowedRoles={["it_admin", "hr_admin"]}><AccessPage /></RoleGuard>} />
    <Route path="/it-admin/security" element={<RoleGuard allowedRoles={["it_admin", "hr_admin"]}><SecurityPage /></RoleGuard>} />
  </>
);
