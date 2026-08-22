import type { JobAssignmentState } from "./jobAssignmentState";
import type { JobScheduleState } from "./jobScheduleState";

export interface JobDetailsState extends JobAssignmentState, JobScheduleState {}