import type { FormEvent } from "react";
import { toast } from "sonner";
import type { Employee } from "@/types/hr";
import type { EmployeeFormState } from "../types/employeeFormState";
import { validateEmployeeForm } from "../utils/validateEmployeeForm";
import { buildEmployeePayload } from "../utils/buildEmployeePayload";

export function useEmployeeFormSubmit(emp: Employee | null, state: EmployeeFormState, onSave: (d: Omit<Employee, "id">) => void, close: (o: boolean) => void) {
  return (e: FormEvent) => {
    e.preventDefault();
    if (!validateEmployeeForm(state.basic, state.contact, state.job)) return;
    const payload = buildEmployeePayload(state);
    onSave(payload);
    toast.success(emp ? `Updated employee profile: ${payload.name}` : `Created new employee record: ${payload.name}`);
    close(false);
  };
}
