import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import IntelligenceLandingPage from "@/features/intelligence/pages/IntelligenceLandingPage";
import AIChatPage from "@/pages/AIChatPage";
import AIATSPage from "@/features/recruitment/pages/AIATSPage";
import ResumeATSCheckerPage from "@/features/recruitment/pages/ResumeATSCheckerPage";

export const renderAIRoutesPart1 = () => (
  <>
    <Route path="/ai" element={<RoleGuard module="intelligence_hub"><IntelligenceLandingPage /></RoleGuard>} />
    <Route path="/ai-chat" element={<AIChatPage />} />
    <Route path="/ai/ats" element={<AIATSPage />} />
    <Route path="/tools/ats-checker" element={<ResumeATSCheckerPage />} />
    <Route path="/tools/resume-ats-checker" element={<ResumeATSCheckerPage />} />
    <Route path="/resume-ats-checker" element={<ResumeATSCheckerPage />} />
  </>
);