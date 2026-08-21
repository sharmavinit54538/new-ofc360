import { renderIntelligenceHubRoutes } from "./IntelligenceHubRoutes";
import { renderTalentResourceRoutes } from "./TalentResourceRoutes";
import { renderEmployeeExpSettingsRoutes } from "./EmployeeExpSettingsRoutes";
import { renderConnectRoutes } from "./ConnectRoutes";
import { renderAIRoutes } from "./AIRoutes";

export const renderProtectedDashboardRoutesPart2 = () => (
  <>
    {renderIntelligenceHubRoutes()}
    {renderTalentResourceRoutes()}
    {renderEmployeeExpSettingsRoutes()}
    {renderConnectRoutes()}
    {renderAIRoutes()}
  </>
);
