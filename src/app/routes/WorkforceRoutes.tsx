import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import DashboardPage from "@/pages/DashboardPage";
import HiringPlanningPage from "@/pages/HiringPlanningPage";
import RecruitmentPage from "@/pages/RecruitmentPage";
import OnboardingPage from "@/pages/OnboardingPage";

export const renderWorkforceRoutes = () => (
  <>
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/hiring" element={<RoleGuard module="hiring_planning"><HiringPlanningPage /></RoleGuard>} />
    <Route path="/recruitment" element={<RoleGuard module="recruitment"><RecruitmentPage /></RoleGuard>} />
    <Route path="/onboarding" element={<RoleGuard module="onboarding"><OnboardingPage /></RoleGuard>} />
  </>
);
