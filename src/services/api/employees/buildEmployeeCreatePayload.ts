import { extractEmployeeBaseInfo } from "./create/employeeBaseInfoPayload";
import { extractEmployeeCompAndOrg } from "./create/employeeCompPayload";
import { extractEmployeeSubArrays } from "./create/employeeArraysPayload";

export function buildEmployeeCreatePayload(input: any): Record<string, any> {
  const b = input || {};
  const payload = extractEmployeeBaseInfo(b);
  extractEmployeeCompAndOrg(b, payload);
  extractEmployeeSubArrays(b, payload);
  return payload;
}
