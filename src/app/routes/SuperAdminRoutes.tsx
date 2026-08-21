import { renderSuperAdminPlatformRoutes } from "./SuperAdminPlatformRoutes";
import { renderSuperAdminSystemRoutes } from "./SuperAdminSystemRoutes";

export const renderSuperAdminRoutes = () => (
  <>
    {renderSuperAdminPlatformRoutes()}
    {renderSuperAdminSystemRoutes()}
  </>
);
