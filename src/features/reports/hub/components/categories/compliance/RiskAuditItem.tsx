export function RiskAuditItem({ risk }: { risk: any }) {
  const isCrit = risk.severity === "high" || risk.severity === "critical";
  return (
    <div className="p-4 bg-slate-900/60 rounded-lg border border-slate-800 flex justify-between items-center">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">{risk.id}</span>
          <span className="text-sm font-semibold text-white">{risk.title}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${isCrit ? "bg-rose-500/20 text-rose-300" : "bg-amber-500/20 text-amber-300"}`}>{risk.severity}</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">{risk.description}</p>
      </div>
      <span className="text-xs text-slate-500">{risk.department}</span>
    </div>
  );
}