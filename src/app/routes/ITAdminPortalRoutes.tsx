import { renderITAdminAccessRoutes } from "./ITAdminAccessRoutes";
import { renderITAdminOpsRoutes } from "./ITAdminOpsRoutes";

export const renderITAdminPortalRoutes = () => (
  <>
    {renderITAdminAccessRoutes()}
    {renderITAdminOpsRoutes()}
  </>
);
