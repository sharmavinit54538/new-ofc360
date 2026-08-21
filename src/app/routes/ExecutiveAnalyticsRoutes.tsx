import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import ExecutiveWorkforcePage from "@/pages/executive/ExecutiveWorkforcePage";
import ExecutiveInsightsPage from "@/pages/executive/ExecutiveInsightsPage";
import ExecutiveReportsPage from "@/pages/executive/ExecutiveReportsPage";

export const renderExecutiveAnalyticsRoutes = () => (
  <>
    <Route path="/executive/workforce" element={<RoleGuard allowedRoles={["executive", "hr_admin"]}><ExecutiveWorkforcePage /></RoleGuard>} />
    <Route path="/executive/insights" element={<RoleGuard allowedRoles={["executive", "hr_admin"]}><ExecutiveInsightsPage /></RoleGuard>} />
    <Route path="/executive/reports" element={<RoleGuard allowedRoles={["executive", "hr_admin"]}><ExecutiveReportsPage /></RoleGuard>} />
  </>
);
