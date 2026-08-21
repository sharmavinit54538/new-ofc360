import { renderSuperAdminAnalyticsRoutes } from "./SuperAdminAnalyticsRoutes";
import { renderSuperAdminSecurityRoutes } from "./SuperAdminSecurityRoutes";

export const renderSuperAdminSystemRoutes = () => (
  <>
    {renderSuperAdminAnalyticsRoutes()}
    {renderSuperAdminSecurityRoutes()}
  </>
);
