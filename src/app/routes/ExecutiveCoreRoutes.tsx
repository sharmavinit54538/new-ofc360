import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import ExecutiveDashboardPage from "@/pages/dashboards/ExecutiveDashboardPage";
import ExecutiveOrgPage from "@/pages/executive/ExecutiveOrgPage";
import ExecutiveKPIsPage from "@/pages/executive/ExecutiveKPIsPage";
import ExecutiveOutcomesPage from "@/pages/executive/ExecutiveOutcomesPage";

export const renderExecutiveCoreRoutes = () => (
  <>
    <Route path="/executive" element={<ExecutiveDashboardPage />} />
    <Route path="/executive/organization" element={<RoleGuard allowedRoles={["executive", "hr_admin"]}><ExecutiveOrgPage /></RoleGuard>} />
    <Route path="/executive/kpis" element={<RoleGuard allowedRoles={["executive", "hr_admin"]}><ExecutiveKPIsPage /></RoleGuard>} />
    <Route path="/executive/outcomes" element={<RoleGuard allowedRoles={["executive", "hr_admin"]}><ExecutiveOutcomesPage /></RoleGuard>} />
  </>
);
