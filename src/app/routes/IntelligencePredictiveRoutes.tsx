import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import CultureIntelligencePage from "@/pages/intelligence/CultureIntelligencePage";
import ComplianceIntelligencePage from "@/pages/intelligence/ComplianceIntelligencePage";
import PredictiveWorkforcePage from "@/pages/intelligence/PredictiveWorkforcePage";
import AIRecommendationsPage from "@/pages/intelligence/AIRecommendationsPage";

export const renderIntelligencePredictiveRoutes = () => (
  <>
    <Route path="/intelligence/culture" element={<RoleGuard module="intelligence_hub"><CultureIntelligencePage /></RoleGuard>} />
    <Route path="/intelligence/compliance" element={<RoleGuard module="intelligence_hub"><ComplianceIntelligencePage /></RoleGuard>} />
    <Route path="/intelligence/predictive" element={<RoleGuard module="intelligence_hub"><PredictiveWorkforcePage /></RoleGuard>} />
    <Route path="/intelligence/recommendations" element={<RoleGuard module="intelligence_hub"><AIRecommendationsPage /></RoleGuard>} />
  </>
);
