import { Briefcase } from "lucide-react";
import type { JobDetailsState } from "../types/jobDetailsTypes";
import type { JobMetaState } from "../types/jobMetaTypes";
import { JobOrgRow } from "./JobOrgRow";
import { JobScheduleRow } from "./JobScheduleRow";
import { JobLocationRow } from "./JobLocationRow";

export function JobDetailsSection({ job, meta }: { job: JobDetailsState; meta: JobMetaState }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-bold text-foreground border-b border-border/40 pb-2">
        <Briefcase className="w-4 h-4 text-primary" />
        <span>3. Job Role & Organization Assignment</span>
      </div>
      <JobOrgRow j={job} m={meta} /><JobScheduleRow j={job} /><JobLocationRow j={job} />
    </div>
  );
}