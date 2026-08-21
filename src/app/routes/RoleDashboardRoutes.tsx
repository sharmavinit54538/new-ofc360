import { renderEmployeePortalRoutes } from "./EmployeePortalRoutes";
import { renderManagerPortalRoutes } from "./ManagerPortalRoutes";
import { renderExecutivePortalRoutes } from "./ExecutivePortalRoutes";
import { renderITAdminPortalRoutes } from "./ITAdminPortalRoutes";

export const renderRoleDashboardRoutes = () => (
  <>
    {renderEmployeePortalRoutes()}
    {renderManagerPortalRoutes()}
    {renderExecutivePortalRoutes()}
    {renderITAdminPortalRoutes()}
  </>
);
