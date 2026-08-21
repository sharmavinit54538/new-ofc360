import { renderEmployeeExperienceRoutes } from "./EmployeeExperienceRoutes";
import { renderSettingsRoutes } from "./SettingsRoutes";

export const renderEmployeeExpSettingsRoutes = () => (
  <>
    {renderEmployeeExperienceRoutes()}
    {renderSettingsRoutes()}
  </>
);
