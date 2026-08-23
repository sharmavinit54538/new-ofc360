import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import IntelligenceLandingPage from "@/features/intelligence/pages/IntelligenceLandingPage";
import PerformanceIntelligencePage from "@/features/intelligence/pages/PerformanceIntelligencePage";
import WorkforceAnalyticsPage from "@/features/intelligence/pages/WorkforceAnalyticsPage";
import EngagementIntelligencePage from "@/features/intelligence/pages/EngagementIntelligencePage";

export const renderIntelligenceCoreRoutes = () => (
  <>
    <Route path="/intelligence" element={<RoleGuard module="intelligence_hub"><IntelligenceLandingPage /></RoleGuard>} />
    <Route path="/intelligence/performance" element={<RoleGuard module="intelligence_hub"><PerformanceIntelligencePage /></RoleGuard>} />
    <Route path="/intelligence/workforce" element={<RoleGuard module="intelligence_hub"><WorkforceAnalyticsPage /></RoleGuard>} />
    <Route path="/intelligence/engagement" element={<RoleGuard module="intelligence_hub"><EngagementIntelligencePage /></RoleGuard>} />
  </>
);