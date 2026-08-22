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
  const basic = useBasicInfoState();
  const contact = useContactInfoState();
  const job = useJobDetailsState();
  const meta = useJobMetaState();
  const comp = useCompensationState();
  const lists = useNestedListsState();
  const state: EmployeeFormState = { basic, contact, job, meta, comp, lists };
  useEmployeeFormSync(employee, open, state);
  return state;
}
