import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import AnalyticsLandingPage from "@/pages/super-admin/analytics/AnalyticsLandingPage";
import PlatformUsagePage from "@/pages/super-admin/analytics/PlatformUsagePage";
import UserGrowthPage from "@/pages/super-admin/analytics/UserGrowthPage";
import CompanyGrowthPage from "@/pages/super-admin/analytics/CompanyGrowthPage";

export const renderSuperAdminAnalyticsRoutes = () => (
  <>
    <Route path="/super-admin/analytics" element={<RoleGuard allowedRoles={["super_admin"]}><AnalyticsLandingPage /></RoleGuard>} />
    <Route path="/super-admin/analytics/usage" element={<RoleGuard allowedRoles={["super_admin"]}><PlatformUsagePage /></RoleGuard>} />
    <Route path="/super-admin/analytics/user-growth" element={<RoleGuard allowedRoles={["super_admin"]}><UserGrowthPage /></RoleGuard>} />
    <Route path="/super-admin/analytics/company-growth" element={<RoleGuard allowedRoles={["super_admin"]}><CompanyGrowthPage /></RoleGuard>} />
  </>
);
