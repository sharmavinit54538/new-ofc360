import type { EmployeeIdentityFields } from "./employeeIdentityFields";
import type { EmployeeOrgFields } from "./employeeOrgFields";

export * from "./employeeIdentityFields";
export * from "./employeeOrgFields";

export interface EmployeeBaseFields extends EmployeeIdentityFields, EmployeeOrgFields {}
