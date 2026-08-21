export * from "./employees/employeeApiTypes";
export * from "./employees/normalizeEmployee";
export * from "./employees/buildEmployeeCreatePayload";
export * from "./employees/buildEmployeeUpdatePayload";
export * from "./employees/employeeCrudEndpoints";
export * from "./employees/employeeStatsAndExportEndpoints";
export * from "./employees/employeeActivationEndpoints";
export * from "./employees/employeeOnboardingStatusEndpoints";

import { employeeCrudApi } from "./employees/employeeCrudEndpoints";
import { employeeStatsAndExportApi } from "./employees/employeeStatsAndExportEndpoints";
import { employeeActivationApi } from "./employees/employeeActivationEndpoints";
import { employeeOnboardingStatusApi } from "./employees/employeeOnboardingStatusEndpoints";

export const employeeApi = {
  ...employeeCrudApi,
  ...employeeStatsAndExportApi,
  ...employeeActivationApi,
  ...employeeOnboardingStatusApi,
};