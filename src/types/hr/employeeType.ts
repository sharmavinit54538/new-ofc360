import type { EmployeeBaseFields } from "./employee/employeeBaseFields";
import type { EmployeeCompDetails } from "./employee/employeeCompDetails";
import type { EmployeePersonalNested } from "./employee/employeePersonalNested";

export * from "./employee/employeeBaseFields";
export * from "./employee/employeeCompDetails";
export * from "./employee/employeePersonalNested";

export interface Employee
  extends EmployeeBaseFields,
    EmployeeCompDetails,
    EmployeePersonalNested {
  [key: string]: any;
}