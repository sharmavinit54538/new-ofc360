export * from "./departments/departmentApiTypes";
export * from "./departments/normalizeDepartment";
export * from "./departments/departmentCrudEndpoints";
export * from "./departments/departmentAssignmentEndpoints";

import { departmentCrudApi } from "./departments/departmentCrudEndpoints";
import { departmentAssignmentApi } from "./departments/departmentAssignmentEndpoints";

export const departmentApi = {
  ...departmentCrudApi,
  ...departmentAssignmentApi,
};