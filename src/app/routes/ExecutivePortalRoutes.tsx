import { renderExecutiveCoreRoutes } from "./ExecutiveCoreRoutes";
import { renderExecutiveAnalyticsRoutes } from "./ExecutiveAnalyticsRoutes";

export const renderExecutivePortalRoutes = () => (
  <>
    {renderExecutiveCoreRoutes()}
    {renderExecutiveAnalyticsRoutes()}
  </>
);
