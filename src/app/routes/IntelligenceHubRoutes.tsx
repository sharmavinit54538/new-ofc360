import { renderIntelligenceCoreRoutes } from "./IntelligenceCoreRoutes";
import { renderIntelligencePredictiveRoutes } from "./IntelligencePredictiveRoutes";

export const renderIntelligenceHubRoutes = () => (
  <>
    {renderIntelligenceCoreRoutes()}
    {renderIntelligencePredictiveRoutes()}
  </>
);
