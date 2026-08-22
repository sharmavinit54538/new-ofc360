import type { BasicInfoState } from "./basicInfoTypes";
import type { ContactInfoState } from "./contactInfoTypes";
import type { JobDetailsState } from "./jobDetailsTypes";
import type { JobMetaState } from "./jobMetaTypes";
import type { CompensationState } from "./compensationTypes";
import type { NestedListsState } from "./nestedListTypes";

export interface EmployeeFormState {
  basic: BasicInfoState;
  contact: ContactInfoState;
  job: JobDetailsState;
  meta: JobMetaState;
  comp: CompensationState;
  lists: NestedListsState;
}
