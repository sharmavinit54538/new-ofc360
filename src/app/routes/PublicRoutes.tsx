import { renderLandingRoutes } from "./LandingRoutes";
import { renderCompanyInfoRoutes } from "./CompanyInfoRoutes";
import { renderAuthPublicRoutes } from "./AuthPublicRoutes";

export const renderPublicRoutes = () => (
  <>
    {renderLandingRoutes()}
    {renderCompanyInfoRoutes()}
    {renderAuthPublicRoutes()}
  </>
);
