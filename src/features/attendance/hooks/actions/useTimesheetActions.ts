import { useCreateTimesheetAction } from "./timesheets/useCreateTimesheetAction";
import { useApproveTimesheetAction } from "./timesheets/useApproveTimesheetAction";
import type { TimesheetEntry } from "../../types/attendance.types";

export function useTimesheetActions(p: {
  user?: { id?: string; name?: string } | null;
  timesheetModal: { tsProject: string; tsTask: string; tsHours: string; tsBillable: boolean; setTsProject: (v: string) => void; setTsTask: (v: string) => void; setIsTimesheetModalOpen: (v: boolean) => void };
  addLocalTimesheet: (ts: TimesheetEntry) => void; updateLocalTimesheetStatus: (id: string, status: string) => void;
  createTimesheetApi: (a: Record<string, unknown>) => { unwrap: () => Promise<unknown> };
  reviewTimesheetApi: (a: Record<string, unknown>) => { unwrap: () => Promise<unknown> }; refetchTimesheets: () => void;
}) {
  const handleCreateTimesheet = useCreateTimesheetAction(p);
  const handleApproveTimesheet = useApproveTimesheetAction(p);
  return { handleCreateTimesheet, handleApproveTimesheet };
}
