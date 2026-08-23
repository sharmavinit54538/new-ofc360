export function DepartmentShareCard({ deptRes, loading }: { deptRes: any; loading: boolean }) {
  const list = deptRes?.data || [];
  return (
    <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-slate-200 mb-4">Department Share</h3>
      {loading ? <p className="text-xs text-slate-400">Loading department share...</p> : list.length > 0 ? (
        <div className="space-y-3">
          {list.map((dept: any, idx: number) => (
            <div key={idx} className="flex justify-between items-center text-xs"><span className="text-slate-300">{dept.name}</span><span className="font-semibold text-slate-100">{dept.value}%</span></div>
          ))}
        </div>
      ) : <p className="text-xs text-slate-500">No department share recorded</p>}
    </div>
  );
}
