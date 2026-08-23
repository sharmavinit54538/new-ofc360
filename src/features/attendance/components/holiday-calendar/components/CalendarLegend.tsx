export function CalendarLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-border/40 text-[11px] text-muted-foreground">
      <span className="font-semibold text-foreground">Holiday Types:</span>
      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /><span>National (Mandatory)</span></div>
      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /><span>Public Closure</span></div>
      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /><span>Regional</span></div>
      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /><span>Optional Floating</span></div>
    </div>
  );
}
