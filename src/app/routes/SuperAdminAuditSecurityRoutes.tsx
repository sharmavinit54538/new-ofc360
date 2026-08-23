import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import SecurityLandingPage from "@/features/super-admin/pages/security/SecurityLandingPage";
import AdminSessionsPage from "@/features/super-admin/pages/security/AdminSessionsPage";
import SecurityEventsPage from "@/features/super-admin/pages/security/SecurityEventsPage";

export const renderSuperAdminAuditSecurityRoutes = () => (
  <>
    <Route path="/super-admin/security" element={<RoleGuard allowedRoles={["super_admin"]}><SecurityLandingPage /></RoleGuard>} />
    <Route path="/super-admin/security/sessions" element={<RoleGuard allowedRoles={["super_admin"]}><AdminSessionsPage /></RoleGuard>} />
    <Route path="/super-admin/security/events" element={<RoleGuard allowedRoles={["super_admin"]}><SecurityEventsPage /></RoleGuard>} />
  </>
);