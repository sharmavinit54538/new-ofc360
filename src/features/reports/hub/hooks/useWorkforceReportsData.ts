import { useGetExecutiveHrDashboardQuery, useGetLeavesAnalyticsQuery, useCreateSnapshotMutation } from "../workforceReportsApi";
import type { ReportCategory } from "../types";

export function useWorkforceReportsData(activeCategory: ReportCategory) {
  const skip = activeCategory !== "workforce";
  const { data: wfDashboardRes, isLoading: wfLoading } = useGetExecutiveHrDashboardQuery(undefined, { skip });
  const { data: wfLeavesRes } = useGetLeavesAnalyticsQuery(undefined, { skip });
  const [triggerSnapshot, { isLoading: isSnapshotting }] = useCreateSnapshotMutation();

  return { wfDashboardRes, wfLeavesRes, wfLoading, triggerSnapshot, isSnapshotting };
}
