import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import SecurityLandingPage from "@/pages/super-admin/security/SecurityLandingPage";
import AdminSessionsPage from "@/pages/super-admin/security/AdminSessionsPage";
import SecurityEventsPage from "@/pages/super-admin/security/SecurityEventsPage";

export const renderSuperAdminAuditSecurityRoutes = () => (
  <>
    <Route path="/super-admin/security" element={<RoleGuard allowedRoles={["super_admin"]}><SecurityLandingPage /></RoleGuard>} />
    <Route path="/super-admin/security/sessions" element={<RoleGuard allowedRoles={["super_admin"]}><AdminSessionsPage /></RoleGuard>} />
    <Route path="/super-admin/security/events" element={<RoleGuard allowedRoles={["super_admin"]}><SecurityEventsPage /></RoleGuard>} />
  </>
);
