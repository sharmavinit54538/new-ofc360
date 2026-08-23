import { ReportsListSearch } from "./ReportsListSearch";
import { ReportsTable } from "./ReportsTable";

export function ReportsListSection({ searchTerm, setSearchTerm, selectedType, setSelectedType, reportsList, loading, isRefreshing, isDeleting, onRefresh, onDelete }: any) {
  return (
    <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h3 className="text-base font-semibold text-white">Generated Report Logs & Archives</h3><p className="text-xs text-slate-400">Manage, recompute, and export report documents</p></div>
        <ReportsListSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedType={selectedType} setSelectedType={setSelectedType} />
      </div>
      <ReportsTable reportsList={reportsList} loading={loading} isRefreshing={isRefreshing} isDeleting={isDeleting} onRefresh={onRefresh} onDelete={onDelete} />
    </div>
  );
}
