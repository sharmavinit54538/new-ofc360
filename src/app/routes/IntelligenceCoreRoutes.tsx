import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import IntelligenceLandingPage from "@/pages/intelligence/IntelligenceLandingPage";
import PerformanceIntelligencePage from "@/pages/intelligence/PerformanceIntelligencePage";
import WorkforceAnalyticsPage from "@/pages/intelligence/WorkforceAnalyticsPage";
import EngagementIntelligencePage from "@/pages/intelligence/EngagementIntelligencePage";

export const renderIntelligenceCoreRoutes = () => (
  <>
    <Route path="/intelligence" element={<RoleGuard module="intelligence_hub"><IntelligenceLandingPage /></RoleGuard>} />
    <Route path="/intelligence/performance" element={<RoleGuard module="intelligence_hub"><PerformanceIntelligencePage /></RoleGuard>} />
    <Route path="/intelligence/workforce" element={<RoleGuard module="intelligence_hub"><WorkforceAnalyticsPage /></RoleGuard>} />
    <Route path="/intelligence/engagement" element={<RoleGuard module="intelligence_hub"><EngagementIntelligencePage /></RoleGuard>} />
  </>
);
