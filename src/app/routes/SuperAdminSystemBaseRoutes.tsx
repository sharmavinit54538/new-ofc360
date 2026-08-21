import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import SystemLandingPage from "@/pages/super-admin/system/SystemLandingPage";
import SuperAdminSystemHealthPage from "@/pages/super-admin/system/SuperAdminSystemHealthPage";
import SuperAdminAuditLogsPage from "@/pages/super-admin/system/SuperAdminAuditLogsPage";
import PlatformSettingsPage from "@/pages/super-admin/system/PlatformSettingsPage";

export const renderSuperAdminSystemBaseRoutes = () => (
  <>
    <Route path="/super-admin/system" element={<RoleGuard allowedRoles={["super_admin"]}><SystemLandingPage /></RoleGuard>} />
    <Route path="/super-admin/system/health" element={<RoleGuard allowedRoles={["super_admin"]}><SuperAdminSystemHealthPage /></RoleGuard>} />
    <Route path="/super-admin/system/audit-logs" element={<RoleGuard allowedRoles={["super_admin"]}><SuperAdminAuditLogsPage /></RoleGuard>} />
    <Route path="/super-admin/system/settings" element={<RoleGuard allowedRoles={["super_admin"]}><PlatformSettingsPage /></RoleGuard>} />
  </>
);
