import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import TalentIntelligenceLandingPage from "@/pages/talent-intelligence/TalentIntelligenceLandingPage";
import RecruitmentPage from "@/pages/RecruitmentPage";
import DocumentIntelligencePage from "@/pages/talent-intelligence/DocumentIntelligencePage";
import OnboardingIntelligencePage from "@/pages/talent-intelligence/OnboardingIntelligencePage";

export const renderTalentIntelligenceCoreRoutes = () => (
  <>
    <Route path="/talent-intelligence" element={<RoleGuard module="talent_intelligence"><TalentIntelligenceLandingPage /></RoleGuard>} />
    <Route path="/talent-intelligence/recruitment" element={<RoleGuard module="recruitment"><RecruitmentPage /></RoleGuard>} />
    <Route path="/talent-intelligence/documents" element={<RoleGuard module="talent_intelligence"><DocumentIntelligencePage /></RoleGuard>} />
    <Route path="/talent-intelligence/onboarding" element={<RoleGuard module="talent_intelligence"><OnboardingIntelligencePage /></RoleGuard>} />
  </>
);
