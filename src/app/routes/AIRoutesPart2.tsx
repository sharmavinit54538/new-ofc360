import { renderAIOpsRoutes } from "./AIOpsRoutes";
import { renderAIRecruiterRoutes } from "./AIRecruiterRoutes";

export const renderAIRoutesPart2 = () => (
  <>
    {renderAIOpsRoutes()}
    {renderAIRecruiterRoutes()}
  </>
);
