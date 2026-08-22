import { useEffect } from "react";
import type { Employee } from "@/types/hr";
import type { EmployeeFormState } from "../types/employeeFormState";
import { syncBasicAndContact } from "../utils/syncBasicInfo";
import { syncJobAndMeta } from "../utils/syncJobInfo";
import { syncCompAndLists } from "../utils/syncCompInfo";
import { syncNewEmployeeDefaults } from "../utils/syncNewEmployee";

export function useEmployeeFormSync(employee: Employee | null, open: boolean, state: EmployeeFormState) {
  useEffect(() => {
    if (employee) {
      syncBasicAndContact(employee, state.basic, state.contact);
      syncJobAndMeta(employee, state.job, state.meta);
      syncCompAndLists(employee, state.comp, state.lists);
    } else {
      syncNewEmployeeDefaults(state);
    }
  }, [employee, open]);
}
