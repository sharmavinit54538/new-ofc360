import { Award } from "lucide-react";
import { PerformanceCards } from "./PerformanceCards";
import { TopPerformersCard } from "./TopPerformersCard";
import { SkillGapsCard } from "./SkillGapsCard";
import { KpiAttainmentCard } from "./KpiAttainmentCard";

export function PerformanceTab({ perfDashboardRes, perfLoading, perfError, perfTopRes, perfSkillGapsRes, perfKpiRes }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-white flex items-center gap-2"><Award className="w-5 h-5 text-indigo-400" />AI Performance & Appraisal Analytics</h2>
      {perfLoading ? <div className="p-8 text-center text-slate-400 text-sm">Loading performance analytics...</div> : perfError ? <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">Unable to load performance telemetry.</div> : (
        <>
          <PerformanceCards perfDashboardRes={perfDashboardRes} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><TopPerformersCard perfTopRes={perfTopRes} /><SkillGapsCard perfSkillGapsRes={perfSkillGapsRes} /></div>
          <KpiAttainmentCard perfKpiRes={perfKpiRes} />
        </>
      )}
    </div>
  );
}