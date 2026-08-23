import { BarChart3, Plus } from "lucide-react";
import { ReportsHubDateFilter } from "./ReportsHubDateFilter";

export function ReportsHubHeader({ dateFrom, setDateFrom, dateTo, setDateTo, onOpenCreate }: {
  dateFrom: string; setDateFrom: (d: string) => void; dateTo: string; setDateTo: (d: string) => void; onOpenCreate: () => void;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30"><BarChart3 className="w-7 h-7" /></div>
        <div><h1 className="text-2xl font-bold text-white tracking-tight">Reports Hub</h1><p className="text-sm text-slate-400">Unified enterprise intelligence, AI analytics & risk audit register</p></div>
      </div>
      <div className="flex items-center gap-3">
        <ReportsHubDateFilter dateFrom={dateFrom} setDateFrom={setDateFrom} dateTo={dateTo} setDateTo={setDateTo} />
        <button onClick={onOpenCreate} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"><Plus className="w-4 h-4" /> Generate Report</button>
      </div>
    </div>
  );
}
