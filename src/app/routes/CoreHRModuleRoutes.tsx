import { renderWorkforceRoutes } from "./WorkforceRoutes";
import { renderPayrollAttendanceRoutes } from "./PayrollAttendanceRoutes";

export const renderCoreHRModuleRoutes = () => (
  <>
    {renderWorkforceRoutes()}
    {renderPayrollAttendanceRoutes()}
  </>
);
