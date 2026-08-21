import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import IntegrationsPage from "@/pages/it-admin/IntegrationsPage";
import AuditLogsPage from "@/pages/it-admin/AuditLogsPage";
import SystemHealthPage from "@/pages/it-admin/SystemHealthPage";
import DeploymentsPage from "@/pages/it-admin/DeploymentsPage";

export const renderITAdminOpsRoutes = () => (
  <>
    <Route path="/it-admin/integrations" element={<RoleGuard allowedRoles={["it_admin", "hr_admin"]}><IntegrationsPage /></RoleGuard>} />
    <Route path="/it-admin/audit-logs" element={<RoleGuard allowedRoles={["it_admin", "hr_admin"]}><AuditLogsPage /></RoleGuard>} />
    <Route path="/it-admin/system-health" element={<RoleGuard allowedRoles={["it_admin", "hr_admin"]}><SystemHealthPage /></RoleGuard>} />
    <Route path="/it-admin/deployments" element={<RoleGuard allowedRoles={["it_admin", "hr_admin"]}><DeploymentsPage /></RoleGuard>} />
  </>
);
