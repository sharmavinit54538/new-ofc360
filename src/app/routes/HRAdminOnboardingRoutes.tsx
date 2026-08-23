import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import OnboardingHubPage from "@/features/onboarding/pages/OnboardingHubPage";
import WorkflowsManagementPage from "@/features/onboarding/pages/WorkflowsManagementPage";
import NewHiresManagementPage from "@/features/onboarding/pages/NewHiresManagementPage";
import DocumentsManagementPage from "@/features/onboarding/pages/DocumentsManagementPage";
import TasksManagementPage from "@/features/onboarding/pages/TasksManagementPage";

export const renderHRAdminOnboardingRoutes = () => (
  <>
    <Route path="/hr-admin/onboarding/hub" element={<RoleGuard allowedRoles={["hr_admin"]}><OnboardingHubPage /></RoleGuard>} />
    <Route path="/hr-admin/onboarding/workflows" element={<RoleGuard allowedRoles={["hr_admin"]}><WorkflowsManagementPage /></RoleGuard>} />
    <Route path="/hr-admin/onboarding/new-hires" element={<RoleGuard allowedRoles={["hr_admin"]}><NewHiresManagementPage /></RoleGuard>} />
    <Route path="/hr-admin/onboarding/documents" element={<RoleGuard allowedRoles={["hr_admin"]}><DocumentsManagementPage /></RoleGuard>} />
    <Route path="/hr-admin/onboarding/tasks" element={<RoleGuard allowedRoles={["hr_admin"]}><TasksManagementPage /></RoleGuard>} />
  </>
);