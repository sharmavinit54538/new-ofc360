import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import LearningIntelligencePage from "@/features/talent-intelligence/pages/LearningIntelligencePage";
import ExitIntelligencePage from "@/features/talent-intelligence/pages/ExitIntelligencePage";
import HiringIntelligencePage from "@/features/talent-intelligence/pages/HiringIntelligencePage";

export const renderTalentIntelligenceHiringRoutes = () => (
  <>
    <Route path="/talent-intelligence/learning" element={<RoleGuard module="talent_intelligence"><LearningIntelligencePage /></RoleGuard>} />
    <Route path="/talent-intelligence/exit" element={<RoleGuard module="talent_intelligence"><ExitIntelligencePage /></RoleGuard>} />
    <Route path="/talent-intelligence/hiring" element={<RoleGuard module="talent_intelligence"><HiringIntelligencePage /></RoleGuard>} />
  </>
);