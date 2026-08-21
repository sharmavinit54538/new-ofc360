import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import CompliancePage from "@/pages/CompliancePage";
import ITAccessPage from "@/pages/ITAccessPage";
import ReportsPage from "@/pages/ReportsPage";

export const renderComplianceRoutes = () => (
  <>
    <Route path="/compliance" element={<RoleGuard module="compliance"><CompliancePage /></RoleGuard>} />
    <Route path="/it-access" element={<RoleGuard module="it_access"><ITAccessPage /></RoleGuard>} />
    <Route path="/analytics" element={<RoleGuard module="analytics"><ReportsPage /></RoleGuard>} />
    <Route path="/reports" element={<RoleGuard module="analytics"><ReportsPage /></RoleGuard>} />
  </>
);
