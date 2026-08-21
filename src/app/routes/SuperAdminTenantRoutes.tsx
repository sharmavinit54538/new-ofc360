import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import UsersPage from "@/pages/super-admin/platform/UsersPage";
import HRAdminsPage from "@/pages/super-admin/platform/HRAdminsPage";
import OnboardingTrackerPage from "@/pages/super-admin/platform/OnboardingTrackerPage";
import SubscriptionsPage from "@/pages/super-admin/platform/SubscriptionsPage";

export const renderSuperAdminTenantRoutes = () => (
  <>
    <Route path="/super-admin/users" element={<RoleGuard allowedRoles={["super_admin"]}><UsersPage /></RoleGuard>} />
    <Route path="/super-admin/hr-admins" element={<RoleGuard allowedRoles={["super_admin"]}><HRAdminsPage /></RoleGuard>} />
    <Route path="/super-admin/onboarding" element={<RoleGuard allowedRoles={["super_admin"]}><OnboardingTrackerPage /></RoleGuard>} />
    <Route path="/super-admin/subscriptions" element={<RoleGuard allowedRoles={["super_admin"]}><SubscriptionsPage /></RoleGuard>} />
  </>
);
