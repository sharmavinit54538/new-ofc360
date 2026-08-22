import type { Employee } from "@/types/hr";
import type { EmployeeFormState } from "../types/employeeFormState";
import { EmployeeFormDialogHeader } from "./EmployeeFormDialogHeader";
import { EmployeeFormBody } from "./EmployeeFormBody";
import { EmployeeFormDialogFooter } from "./EmployeeFormDialogFooter";

export function EmployeeFormDialogInner({ employee, state, onCancel }: { employee: Employee | null; state: EmployeeFormState; onCancel: () => void }) {
  return (
    <>
      <EmployeeFormDialogHeader employee={employee} />
      <EmployeeFormBody state={state} />
      <EmployeeFormDialogFooter isEdit={Boolean(employee)} onCancel={onCancel} />
    </>
  );
}
