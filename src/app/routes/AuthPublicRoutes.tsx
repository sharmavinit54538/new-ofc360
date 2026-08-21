import { renderAuthLoginRoutes } from "./AuthLoginRoutes";
import { renderAuthActivateRoutes } from "./AuthActivateRoutes";

export const renderAuthPublicRoutes = () => (
  <>
    {renderAuthLoginRoutes()}
    {renderAuthActivateRoutes()}
  </>
);
