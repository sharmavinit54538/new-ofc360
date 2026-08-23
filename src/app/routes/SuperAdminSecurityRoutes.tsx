import { renderSuperAdminSystemBaseRoutes } from "./SuperAdminSystemBaseRoutes";
import { renderSuperAdminAuditSecurityRoutes } from "./SuperAdminAuditSecurityRoutes";

export const renderSuperAdminSecurityRoutes = () => (
  <>
    {renderSuperAdminSystemBaseRoutes()}
    {renderSuperAdminAuditSecurityRoutes()}
  </>
);