import { Route } from "react-router-dom";
import EmployeeActivatePage from "@/pages/employee/EmployeeActivatePage";
import PublicCareersPage from "@/pages/PublicCareersPage";
import HRAdminOnboardingPage from "@/pages/onboarding/HRAdminOnboardingPage";
import { HRAdminOnboardingGuard } from "@/components/auth/HRAdminOnboardingGuard";

export const renderAuthActivateRoutes = () => (
  <>
    <Route path="/employee/activate" element={<EmployeeActivatePage />} />
    <Route path="/activate" element={<EmployeeActivatePage />} />
    <Route path="/careers" element={<PublicCareersPage />} />
    <Route path="/hr-admin/onboarding" element={<HRAdminOnboardingGuard><HRAdminOnboardingPage /></HRAdminOnboardingGuard>} />
  </>
);
