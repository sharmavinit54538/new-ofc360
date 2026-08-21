import { renderHRAdminOnboardingRoutes } from "./HRAdminOnboardingRoutes";
import { renderSuperAdminRoutes } from "./SuperAdminRoutes";
import { renderRoleDashboardRoutes } from "./RoleDashboardRoutes";
import { renderCoreHRModuleRoutes } from "./CoreHRModuleRoutes";
import { renderOperationsModuleRoutes } from "./OperationsModuleRoutes";

export const renderProtectedDashboardRoutesPart1 = () => (
  <>
    {renderHRAdminOnboardingRoutes()}
    {renderSuperAdminRoutes()}
    {renderRoleDashboardRoutes()}
    {renderCoreHRModuleRoutes()}
    {renderOperationsModuleRoutes()}
  </>
);
