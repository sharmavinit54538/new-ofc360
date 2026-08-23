export function EngagementSurveysCard({ engagementSurveysRes }: { engagementSurveysRes: any }) {
  const list = engagementSurveysRes?.data;
  if (!list || list.length === 0) return null;
  return (
    <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-slate-200 mb-4">Live & Completed Pulse Surveys</h3>
      <div className="space-y-2.5">
        {list.map((survey: any) => (
          <div key={survey.id} className="flex justify-between items-center p-3.5 bg-slate-900/50 rounded-lg border border-slate-800 text-xs">
            <div><p className="font-semibold text-white">{survey.title}</p><p className="text-[11px] text-slate-400 mt-0.5">Responses: {survey.responses} {survey.totalEligible ? `/ ${survey.totalEligible}` : ""}</p></div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${survey.status === "active" ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-800 text-slate-400"}`}>{survey.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
