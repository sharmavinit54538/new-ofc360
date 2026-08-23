import { ReportsTableHead } from "./ReportsTableHead";
import { ReportsTableRow } from "./ReportsTableRow";

export function ReportsTable({ reportsList, loading, isRefreshing, isDeleting, onRefresh, onDelete }: any) {
  return (
    <div className="overflow-x-auto border border-slate-700/50 rounded-lg">
      <table className="w-full text-left text-xs text-slate-300">
        <ReportsTableHead />
        <tbody className="divide-y divide-slate-800 bg-slate-900/30">
          {loading ? <tr><td colSpan={7} className="p-6 text-center text-slate-500">Loading reports list...</td></tr> : reportsList.length === 0 ? <tr><td colSpan={7} className="p-6 text-center text-slate-500">No reports generated yet. Click "Generate Report" above.</td></tr> : (
            reportsList.map((r: any) => <ReportsTableRow key={r.id} report={r} isRefreshing={isRefreshing} isDeleting={isDeleting} onRefresh={onRefresh} onDelete={onDelete} />)
          )}
        </tbody>
      </table>
    </div>
  );
}
