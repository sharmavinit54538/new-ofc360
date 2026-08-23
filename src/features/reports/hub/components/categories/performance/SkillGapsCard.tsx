export function SkillGapsCard({ perfSkillGapsRes }: { perfSkillGapsRes: any }) {
  const list = perfSkillGapsRes?.data || [];
  return (
    <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-slate-200 mb-4">AI Skill Gap Analysis</h3>
      {list.length > 0 ? (
        <div className="space-y-3">
          {list.map((gap: any, idx: number) => (
            <div key={idx} className="p-3 bg-slate-900/50 rounded-lg border border-slate-800 text-xs">
              <div className="flex justify-between font-medium text-slate-200 mb-1"><span>{gap.skill}</span><span className="text-amber-400">{gap.affectedEmployees} affected</span></div>
              <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden"><div className="bg-indigo-500 h-full rounded-full" style={{ width: `${Math.min(100, (gap.currentLevel / (gap.requiredLevel || 1)) * 100)}%` }} /></div>
            </div>
          ))}
        </div>
      ) : <p className="text-xs text-slate-500">No skill gaps recorded</p>}
    </div>
  );
}
