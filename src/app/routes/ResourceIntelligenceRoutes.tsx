import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import ResourceIntelligenceLandingPage from "@/features/resource-intelligence/pages/ResourceIntelligenceLandingPage";
import AssetIntelligencePage from "@/features/resource-intelligence/pages/AssetIntelligencePage";
import VendorIntelligencePage from "@/features/resource-intelligence/pages/VendorIntelligencePage";

export const renderResourceIntelligenceRoutes = () => (
  <>
    <Route path="/assets" element={<RoleGuard module="resource_intelligence"><AssetIntelligencePage /></RoleGuard>} />
    <Route path="/resource-intelligence" element={<RoleGuard module="resource_intelligence"><ResourceIntelligenceLandingPage /></RoleGuard>} />
    <Route path="/resource-intelligence/assets" element={<RoleGuard module="resource_intelligence"><AssetIntelligencePage /></RoleGuard>} />
    <Route path="/resource-intelligence/vendors" element={<RoleGuard module="resource_intelligence"><VendorIntelligencePage /></RoleGuard>} />
  </>
);