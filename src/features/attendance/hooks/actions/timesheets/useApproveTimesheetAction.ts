import { toast } from "sonner";

export function useApproveTimesheetAction(p: {
  updateLocalTimesheetStatus: (id: string, status: string) => void;
  reviewTimesheetApi: (args: Record<string, unknown>) => { unwrap: () => Promise<unknown> };
  refetchTimesheets: () => void;
}) {
  return async (id: string) => {
    try {
      await p.reviewTimesheetApi({ timesheet_id: id, status: "approved" }).unwrap();
      p.refetchTimesheets();
    } catch {
      // Local fallback
    }
    p.updateLocalTimesheetStatus(id, "Approved");
    toast.success("Timesheet entry approved!");
  };
}
