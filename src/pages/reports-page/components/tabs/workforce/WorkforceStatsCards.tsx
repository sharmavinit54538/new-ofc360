export function WorkforceStatsCards({ empCount, deptCount, punchCount, leaveCount }: any) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card"><span className="text-xs text-muted-foreground">Total Headcount</span><p className="text-2xl font-extrabold text-foreground font-mono mt-1">{empCount}</p><span className="text-[11px] text-emerald-500 font-semibold">Active Staff</span></div>
      <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card"><span className="text-xs text-muted-foreground">Departments</span><p className="text-2xl font-extrabold text-primary font-mono mt-1">{deptCount}</p><span className="text-[11px] text-muted-foreground">Configured</span></div>
      <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card"><span className="text-xs text-muted-foreground">Present Today</span><p className="text-2xl font-extrabold text-emerald-500 font-mono mt-1">{punchCount}</p><span className="text-[10px] text-emerald-500 font-semibold">Live punch count</span></div>
      <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card"><span className="text-xs text-muted-foreground">On Leave</span><p className="text-2xl font-extrabold text-blue-500 font-mono mt-1">{leaveCount}</p><span className="text-[11px] text-muted-foreground">Approved Time-Off</span></div>
    </div>
  );
}
