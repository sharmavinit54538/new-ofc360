import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import ManagerDashboardPage from "@/pages/dashboards/ManagerDashboardPage";
import ManagerTeamPage from "@/pages/manager/ManagerTeamPage";
import ManagerApprovalsPage from "@/pages/manager/ManagerApprovalsPage";
import ManagerGoalsPage from "@/pages/manager/ManagerGoalsPage";
import ManagerEngagementPage from "@/pages/manager/ManagerEngagementPage";
import ManagerHelpdeskPage from "@/pages/manager/ManagerHelpdeskPage";

export const renderManagerPortalRoutes = () => (
  <>
    <Route path="/manager" element={<ManagerDashboardPage />} />
    <Route path="/manager/team" element={<RoleGuard allowedRoles={["manager", "hr_admin", "executive"]}><ManagerTeamPage /></RoleGuard>} />
    <Route path="/manager/approvals" element={<RoleGuard allowedRoles={["manager", "hr_admin", "executive"]}><ManagerApprovalsPage /></RoleGuard>} />
    <Route path="/manager/goals" element={<RoleGuard allowedRoles={["manager", "hr_admin", "executive"]}><ManagerGoalsPage /></RoleGuard>} />
    <Route path="/manager/engagement" element={<RoleGuard allowedRoles={["manager", "hr_admin", "executive"]}><ManagerEngagementPage /></RoleGuard>} />
    <Route path="/manager/helpdesk" element={<RoleGuard allowedRoles={["manager", "hr_admin", "executive"]}><ManagerHelpdeskPage /></RoleGuard>} />
  </>
);
