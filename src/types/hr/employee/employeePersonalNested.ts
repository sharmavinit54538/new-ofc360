import type { EmployeePersonalFields } from "./employeePersonalFields";
import type { EmployeeNestedArrays } from "./employeeNestedArrays";

export * from "./employeePersonalFields";
export * from "./employeeNestedArrays";

export interface EmployeePersonalNested extends EmployeePersonalFields, EmployeeNestedArrays {}
