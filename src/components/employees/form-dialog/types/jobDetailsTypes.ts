import type { JobAssignmentState, JobScheduleState } from "./jobStateSubTypes";

export interface JobDetailsState extends JobAssignmentState, JobScheduleState {}
