import { renderLandingRoutes } from "./LandingRoutes";
import { renderCompanyInfoRoutes } from "./CompanyInfoRoutes";

export const renderMarketingRoutes = () => (
  <>
    {renderLandingRoutes()}
    {renderCompanyInfoRoutes()}
  </>
);
