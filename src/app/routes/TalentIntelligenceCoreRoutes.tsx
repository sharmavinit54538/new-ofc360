import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import TalentIntelligenceLandingPage from "@/features/talent-intelligence/pages/TalentIntelligenceLandingPage";
import RecruitmentPage from "@/features/recruitment/pages/RecruitmentPage";
import DocumentIntelligencePage from "@/features/talent-intelligence/pages/DocumentIntelligencePage";
import OnboardingIntelligencePage from "@/features/talent-intelligence/pages/OnboardingIntelligencePage";

export const renderTalentIntelligenceCoreRoutes = () => (
  <>
    <Route path="/talent-intelligence" element={<RoleGuard module="talent_intelligence"><TalentIntelligenceLandingPage /></RoleGuard>} />
    <Route path="/talent-intelligence/recruitment" element={<RoleGuard module="recruitment"><RecruitmentPage /></RoleGuard>} />
    <Route path="/talent-intelligence/documents" element={<RoleGuard module="talent_intelligence"><DocumentIntelligencePage /></RoleGuard>} />
    <Route path="/talent-intelligence/onboarding" element={<RoleGuard module="talent_intelligence"><OnboardingIntelligencePage /></RoleGuard>} />
  </>
);