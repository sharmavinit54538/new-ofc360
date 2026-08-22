import type { Employee } from "@/types/hr";
import type { EmployeeFormState } from "../types/employeeFormState";
import { useBasicInfoState } from "./useBasicInfoState";
import { useContactInfoState } from "./useContactInfoState";
import { useJobDetailsState } from "./useJobDetailsState";
import { useJobMetaState } from "./useJobMetaState";
import { useCompensationState } from "./useCompensationState";
import { useNestedListsState } from "./useNestedListsState";
import { useEmployeeFormSync } from "./useEmployeeFormSync";

export function useEmployeeFormState(employee: Employee | null, open: boolean): EmployeeFormState {
  const state: EmployeeFormState = { basic: useBasicInfoState(), contact: useContactInfoState(), job: useJobDetailsState(), meta: useJobMetaState(), comp: useCompensationState(), lists: useNestedListsState() };
  useEmployeeFormSync(employee, open, state);
  return state;
}
