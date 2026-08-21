import { renderOperationsCoreRoutes } from "./OperationsCoreRoutes";
import { renderComplianceRbacRoutes } from "./ComplianceRbacRoutes";

export const renderOperationsModuleRoutes = () => (
  <>
    {renderOperationsCoreRoutes()}
    {renderComplianceRbacRoutes()}
  </>
);
