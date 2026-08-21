import { renderCompanyAboutRoutes } from "./CompanyAboutRoutes";
import { renderCompanyBlogRoutes } from "./CompanyBlogRoutes";

export const renderCompanyInfoRoutes = () => (
  <>
    {renderCompanyAboutRoutes()}
    {renderCompanyBlogRoutes()}
  </>
);
