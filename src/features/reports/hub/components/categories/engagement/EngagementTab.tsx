import { Heart } from "lucide-react";
import { EngagementCards } from "./EngagementCards";
import { EnpsTrendCard } from "./EnpsTrendCard";
import { EngagementBreakdownCard } from "./EngagementBreakdownCard";
import { EngagementSurveysCard } from "./EngagementSurveysCard";

export function EngagementTab({ engagementRes, engagementLoading, engagementError, enpsTrendRes, engagementBreakdownRes, engagementSurveysRes }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-white flex items-center gap-2"><Heart className="w-5 h-5 text-indigo-400" />Employee Engagement & eNPS Telemetry</h2>
      {engagementLoading ? <div className="p-8 text-center text-slate-400 text-sm">Loading engagement data...</div> : engagementError ? <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">Unable to load engagement metrics.</div> : (
        <>
          <EngagementCards engagementRes={engagementRes} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><EnpsTrendCard enpsTrendRes={enpsTrendRes} /><EngagementBreakdownCard engagementBreakdownRes={engagementBreakdownRes} /></div>
          <EngagementSurveysCard engagementSurveysRes={engagementSurveysRes} />
        </>
      )}
    </div>
  );
}