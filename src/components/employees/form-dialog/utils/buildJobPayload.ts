import type { JobDetailsState } from "../types/jobDetailsTypes";
import type { JobMetaState } from "../types/jobMetaTypes";

export function buildJobPayload(job: JobDetailsState, meta: JobMetaState) {
  return {
    employmentType: job.employmentType,
    reportingManager: job.reportingManager,
    shift: job.shift,
    team: job.team,
    branchOffice: job.branchOffice,
    workLocation: job.workLocation,
    probationPeriod: meta.probationPeriod,
    capacity: meta.capacity,
    costCenterId: meta.costCenterId,
    leaveGroup: meta.leaveGroup,
  };
}
