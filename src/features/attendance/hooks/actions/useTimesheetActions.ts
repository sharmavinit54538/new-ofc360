import { toast } from "sonner";
import type { TimesheetEntry } from "../../types/attendance.types";

interface TimesheetModalState {
  tsProject: string;
  tsTask: string;
  tsHours: string;
  tsBillable: boolean;
  setTsProject: (val: string) => void;
  setTsTask: (val: string) => void;
  setIsTimesheetModalOpen: (val: boolean) => void;
}

interface UseTimesheetActionsProps {
  user: { id?: string; name?: string } | null | undefined;
  timesheetModal: TimesheetModalState;
  addLocalTimesheet: (ts: Omit<TimesheetEntry, "id"> | TimesheetEntry) => void;
  updateLocalTimesheetStatus: (id: string, status: string) => void;
  createTimesheetApi: (args: Record<string, unknown>) => { unwrap: () => Promise<unknown> };
  reviewTimesheetApi: (args: Record<string, unknown>) => { unwrap: () => Promise<unknown> };
  refetchTimesheets: () => void;
}

export function useTimesheetActions({
  user,
  timesheetModal,
  addLocalTimesheet,
  updateLocalTimesheetStatus,
  createTimesheetApi,
  reviewTimesheetApi,
  refetchTimesheets,
}: UseTimesheetActionsProps) {
  const handleCreateTimesheet = async () => {
    if (!timesheetModal.tsProject.trim() || !timesheetModal.tsTask.trim()) {
      toast.error("Project and Task details are required.");
      return;
    }
    const payload = {
      employeeId: user?.id || "EMP-CURRENT",
      employeeName: user?.name || "Alex Mercer",
      projectName: timesheetModal.tsProject.trim(),
      taskDescription: timesheetModal.tsTask.trim(),
      loggedHours: parseFloat(timesheetModal.tsHours) || 8,
      billable: timesheetModal.tsBillable,
      date: new Date().toISOString().split("T")[0],
      status: "Submitted" as const,
    };
    try {
      await createTimesheetApi(payload).unwrap();
      refetchTimesheets();
    } catch {
      // Local sync fallback
    }
    addLocalTimesheet(payload);
    timesheetModal.setTsProject("");
    timesheetModal.setTsTask("");
    timesheetModal.setIsTimesheetModalOpen(false);
    toast.success("Timesheet entry submitted for approval!");
  };

  const handleApproveTimesheet = async (id: string) => {
    try {
      await reviewTimesheetApi({ timesheet_id: id, status: "approved" }).unwrap();
      refetchTimesheets();
    } catch {
      // Local fallback
    }
    updateLocalTimesheetStatus(id, "Approved");
    toast.success("Timesheet entry approved!");
  };

  return {
    handleCreateTimesheet,
    handleApproveTimesheet,
  };
}
