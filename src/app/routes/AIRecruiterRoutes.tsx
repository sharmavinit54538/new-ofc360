import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import AIRecruiterCopilotPage from "@/features/recruitment/pages/AIRecruiterCopilotPage";
import PredictiveWorkforcePage from "@/pages/intelligence/PredictiveWorkforcePage";
import AIDocumentIntelligencePage from "@/pages/AIDocumentIntelligencePage";

export const renderAIRecruiterRoutes = () => (
  <>
    <Route path="/ai/copilot" element={<AIRecruiterCopilotPage />} />
    <Route path="/ai/predictive" element={<RoleGuard module="intelligence_hub"><PredictiveWorkforcePage /></RoleGuard>} />
    <Route path="/ai/documents" element={<AIDocumentIntelligencePage />} />
  </>
);