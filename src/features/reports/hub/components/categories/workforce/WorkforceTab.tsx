import { Users, RefreshCw } from "lucide-react";
import { WorkforceCards } from "./WorkforceCards";
import { HeadcountTrendCard } from "./HeadcountTrendCard";
import { DepartmentShareCard } from "./DepartmentShareCard";

export function WorkforceTab({ wfDashboardRes, wfLeavesRes, wfLoading, headcountRes, headcountLoading, deptRes, deptLoading, onSnapshot, isSnapshotting }: any) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2"><Users className="w-5 h-5 text-indigo-400" />Executive Workforce & Headcount Overview</h2>
        <button onClick={onSnapshot} disabled={isSnapshotting} className="flex items-center gap-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer"><RefreshCw className={`w-3.5 h-3.5 ${isSnapshotting ? "animate-spin" : ""}`} />{isSnapshotting ? "Computing..." : "Trigger Analytics Snapshot"}</button>
      </div>
      {wfLoading ? <div className="p-8 text-center text-slate-400 text-sm">Loading workforce metrics...</div> : <WorkforceCards wfDashboardRes={wfDashboardRes} wfLeavesRes={wfLeavesRes} />}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <HeadcountTrendCard headcountRes={headcountRes} loading={headcountLoading} /><DepartmentShareCard deptRes={deptRes} loading={deptLoading} />
      </div>
    </div>
  );
}
