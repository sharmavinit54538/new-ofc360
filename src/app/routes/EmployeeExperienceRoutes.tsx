import { renderEmployeeExperienceMainRoutes } from "./EmployeeExperienceMainRoutes";
import { renderEmployeeExperienceRequestRoutes } from "./EmployeeExperienceRequestRoutes";

export const renderEmployeeExperienceRoutes = () => (
  <>
    {renderEmployeeExperienceMainRoutes()}
    {renderEmployeeExperienceRequestRoutes()}
  </>
);
