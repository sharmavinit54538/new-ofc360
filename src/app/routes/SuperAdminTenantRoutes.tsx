import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import UsersPage from "@/features/super-admin/pages/platform/UsersPage";
import HRAdminsPage from "@/features/super-admin/pages/platform/HRAdminsPage";
import OnboardingTrackerPage from "@/features/super-admin/pages/platform/OnboardingTrackerPage";
import SubscriptionsPage from "@/features/super-admin/pages/platform/SubscriptionsPage";

export const renderSuperAdminTenantRoutes = () => (
  <>
    <Route path="/super-admin/users" element={<RoleGuard allowedRoles={["super_admin"]}><UsersPage /></RoleGuard>} />
    <Route path="/super-admin/hr-admins" element={<RoleGuard allowedRoles={["super_admin"]}><HRAdminsPage /></RoleGuard>} />
    <Route path="/super-admin/onboarding" element={<RoleGuard allowedRoles={["super_admin"]}><OnboardingTrackerPage /></RoleGuard>} />
    <Route path="/super-admin/subscriptions" element={<RoleGuard allowedRoles={["super_admin"]}><SubscriptionsPage /></RoleGuard>} />
  </>
);