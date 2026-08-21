import { renderTalentIntelligenceRoutes } from "./TalentIntelligenceRoutes";
import { renderResourceIntelligenceRoutes } from "./ResourceIntelligenceRoutes";

export const renderTalentResourceRoutes = () => (
  <>
    {renderTalentIntelligenceRoutes()}
    {renderResourceIntelligenceRoutes()}
  </>
);
