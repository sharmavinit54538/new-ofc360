import { renderComplianceRoutes } from "./ComplianceRoutes";
import { renderRbacRoutes } from "./RbacRoutes";

export const renderComplianceRbacRoutes = () => (
  <>
    {renderComplianceRoutes()}
    {renderRbacRoutes()}
  </>
);
