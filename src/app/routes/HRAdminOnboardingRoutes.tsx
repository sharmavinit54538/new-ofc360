import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import OnboardingHubPage from "@/pages/onboarding/OnboardingHubPage";
import WorkflowsManagementPage from "@/pages/onboarding/WorkflowsManagementPage";
import NewHiresManagementPage from "@/pages/onboarding/NewHiresManagementPage";
import DocumentsManagementPage from "@/pages/onboarding/DocumentsManagementPage";
import TasksManagementPage from "@/pages/onboarding/TasksManagementPage";

export const renderHRAdminOnboardingRoutes = () => (
  <>
    <Route path="/hr-admin/onboarding/hub" element={<RoleGuard allowedRoles={["hr_admin"]}><OnboardingHubPage /></RoleGuard>} />
    <Route path="/hr-admin/onboarding/workflows" element={<RoleGuard allowedRoles={["hr_admin"]}><WorkflowsManagementPage /></RoleGuard>} />
    <Route path="/hr-admin/onboarding/new-hires" element={<RoleGuard allowedRoles={["hr_admin"]}><NewHiresManagementPage /></RoleGuard>} />
    <Route path="/hr-admin/onboarding/documents" element={<RoleGuard allowedRoles={["hr_admin"]}><DocumentsManagementPage /></RoleGuard>} />
    <Route path="/hr-admin/onboarding/tasks" element={<RoleGuard allowedRoles={["hr_admin"]}><TasksManagementPage /></RoleGuard>} />
  </>
);
