import { renderTalentIntelligenceCoreRoutes } from "./TalentIntelligenceCoreRoutes";
import { renderTalentIntelligenceHiringRoutes } from "./TalentIntelligenceHiringRoutes";

export const renderTalentIntelligenceRoutes = () => (
  <>
    {renderTalentIntelligenceCoreRoutes()}
    {renderTalentIntelligenceHiringRoutes()}
  </>
);
