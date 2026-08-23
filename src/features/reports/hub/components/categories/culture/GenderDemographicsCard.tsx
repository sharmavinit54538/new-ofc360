export function GenderDemographicsCard({ cultureRes }: { cultureRes: any }) {
  const dist = cultureRes?.data?.genderDistribution;
  return (
    <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-slate-200 mb-3">Gender Demographics</h3>
      {Array.isArray(dist) && dist.length > 0 ? (
        <div className="space-y-2">
          {dist.map((g: any, idx: number) => (
            <div key={idx} className="flex justify-between items-center text-xs"><span className="text-slate-300">{g.label}</span><span className="font-bold text-slate-100">{g.value}%</span></div>
          ))}
        </div>
      ) : <p className="text-xs text-slate-500">No gender demographics recorded</p>}
    </div>
  );
}
