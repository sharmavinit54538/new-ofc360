import { renderSuperAdminCoreRoutes } from "./SuperAdminCoreRoutes";
import { renderSuperAdminTenantRoutes } from "./SuperAdminTenantRoutes";

export const renderSuperAdminPlatformRoutes = () => (
  <>
    {renderSuperAdminCoreRoutes()}
    {renderSuperAdminTenantRoutes()}
  </>
);
