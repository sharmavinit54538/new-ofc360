import { ArrowUpRight } from "lucide-react";

export function WorkforceCards({ wfDashboardRes, wfLeavesRes }: { wfDashboardRes: any; wfLeavesRes: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5"><p className="text-xs text-slate-400">Total Workforce</p><p className="text-3xl font-bold text-white mt-1">{wfDashboardRes?.data?.totalEmployees ?? 0}</p><p className="text-xs text-emerald-400 mt-2 flex items-center gap-1"><ArrowUpRight className="w-3.5 h-3.5" />{wfDashboardRes?.data?.newHiresThisMonth ?? 0} new hires this month</p></div>
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5"><p className="text-xs text-slate-400">Annual Retention Rate</p><p className="text-3xl font-bold text-white mt-1">{wfDashboardRes?.data?.retentionRate ?? 0}%</p><p className="text-xs text-slate-400 mt-2">Turnover rate: {wfDashboardRes?.data?.turnoverRate ?? 0}%</p></div>
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5"><p className="text-xs text-slate-400">Leave Conflict Alert Index</p><p className="text-3xl font-bold text-amber-400 mt-1">{wfLeavesRes?.data?.leaveConflicts ?? 0}</p><p className="text-xs text-slate-400 mt-2">Peak month: {wfLeavesRes?.data?.peakLeaveMonth ?? "N/A"}</p></div>
    </div>
  );
}
