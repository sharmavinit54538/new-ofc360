import { Globe2 } from "lucide-react";
import { CultureOverviewCard } from "./CultureOverviewCard";
import { GenderDemographicsCard } from "./GenderDemographicsCard";
import { CultureDimensionsCard } from "./CultureDimensionsCard";
import { CultureFeedbackCard } from "./CultureFeedbackCard";

export function CultureTab({ cultureRes, cultureLoading, cultureError, cultureBreakdownRes, cultureFeedbackRes }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-white flex items-center gap-2"><Globe2 className="w-5 h-5 text-indigo-400" />Culture & D&I Telemetry</h2>
      {cultureLoading ? <div className="p-8 text-center text-slate-400 text-sm">Loading culture telemetry...</div> : cultureError ? <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">Unable to load culture telemetry.</div> : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><CultureOverviewCard cultureRes={cultureRes} /><GenderDemographicsCard cultureRes={cultureRes} /></div>
          <CultureDimensionsCard cultureBreakdownRes={cultureBreakdownRes} /><CultureFeedbackCard cultureFeedbackRes={cultureFeedbackRes} />
        </>
      )}
    </div>
  );
}
