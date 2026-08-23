import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import SuperAdminDashboardPage from "@/features/super-admin/pages/SuperAdminDashboardPage";
import PlatformLandingPage from "@/features/super-admin/pages/platform/PlatformLandingPage";
import CompaniesPage from "@/features/super-admin/pages/platform/CompaniesPage";

export const renderSuperAdminCoreRoutes = () => (
  <>
    <Route path="/super-admin" element={<RoleGuard allowedRoles={["super_admin"]}><SuperAdminDashboardPage /></RoleGuard>} />
    <Route path="/superadmin" element={<RoleGuard allowedRoles={["super_admin"]}><SuperAdminDashboardPage /></RoleGuard>} />
    <Route path="/super-admin/dashboard" element={<RoleGuard allowedRoles={["super_admin"]}><SuperAdminDashboardPage /></RoleGuard>} />
    <Route path="/super-admin/platform" element={<RoleGuard allowedRoles={["super_admin"]}><PlatformLandingPage /></RoleGuard>} />
    <Route path="/super-admin/companies" element={<RoleGuard allowedRoles={["super_admin"]}><CompaniesPage /></RoleGuard>} />
  </>
);