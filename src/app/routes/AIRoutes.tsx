import { renderAIRoutesPart1 } from "./AIRoutesPart1";
import { renderAIRoutesPart2 } from "./AIRoutesPart2";

export const renderAIRoutes = () => (
  <>
    {renderAIRoutesPart1()}
    {renderAIRoutesPart2()}
  </>
);
