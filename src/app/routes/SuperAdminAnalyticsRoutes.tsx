import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import AnalyticsLandingPage from "@/features/super-admin/pages/analytics/AnalyticsLandingPage";
import PlatformUsagePage from "@/features/super-admin/pages/analytics/PlatformUsagePage";
import UserGrowthPage from "@/features/super-admin/pages/analytics/UserGrowthPage";
import CompanyGrowthPage from "@/features/super-admin/pages/analytics/CompanyGrowthPage";

export const renderSuperAdminAnalyticsRoutes = () => (
  <>
    <Route path="/super-admin/analytics" element={<RoleGuard allowedRoles={["super_admin"]}><AnalyticsLandingPage /></RoleGuard>} />
    <Route path="/super-admin/analytics/usage" element={<RoleGuard allowedRoles={["super_admin"]}><PlatformUsagePage /></RoleGuard>} />
    <Route path="/super-admin/analytics/user-growth" element={<RoleGuard allowedRoles={["super_admin"]}><UserGrowthPage /></RoleGuard>} />
    <Route path="/super-admin/analytics/company-growth" element={<RoleGuard allowedRoles={["super_admin"]}><CompanyGrowthPage /></RoleGuard>} />
  </>
);