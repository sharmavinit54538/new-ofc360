import { useRefreshReportMutation, useDeleteReportMutation } from "../reportsCoreApi";

export function useReportActions() {
  const [refreshReport, { isLoading: isRefreshing }] = useRefreshReportMutation();
  const [deleteReport, { isLoading: isDeleting }] = useDeleteReportMutation();

  const handleRefresh = async (id: string) => {
    try { await refreshReport(id).unwrap(); } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this report record?")) {
      try { await deleteReport(id).unwrap(); } catch (err) { console.error(err); }
    }
  };

  return { isRefreshing, isDeleting, handleRefresh, handleDelete };
}

