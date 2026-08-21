import { Route } from "react-router-dom";
import { RoleGuard } from "@/components/auth/RoleGuard";
import ResourceIntelligenceLandingPage from "@/pages/resource-intelligence/ResourceIntelligenceLandingPage";
import AssetIntelligencePage from "@/pages/resource-intelligence/AssetIntelligencePage";
import VendorIntelligencePage from "@/pages/resource-intelligence/VendorIntelligencePage";

export const renderResourceIntelligenceRoutes = () => (
  <>
    <Route path="/assets" element={<RoleGuard module="resource_intelligence"><AssetIntelligencePage /></RoleGuard>} />
    <Route path="/resource-intelligence" element={<RoleGuard module="resource_intelligence"><ResourceIntelligenceLandingPage /></RoleGuard>} />
    <Route path="/resource-intelligence/assets" element={<RoleGuard module="resource_intelligence"><AssetIntelligencePage /></RoleGuard>} />
    <Route path="/resource-intelligence/vendors" element={<RoleGuard module="resource_intelligence"><VendorIntelligencePage /></RoleGuard>} />
  </>
);
