import { Award } from "lucide-react";

export function PerformanceTopPerformers({ list }: { list?: any[] }) {
  return (
    <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
      <h3 className="font-bold text-sm text-foreground flex items-center gap-2"><Award className="w-4 h-4 text-primary" /> Top Performing Talent</h3>
      {list && list.length > 0 ? (
        <div className="space-y-2.5">
          {list.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-secondary/30 border border-border/40 text-xs">
              <div><p className="font-bold text-foreground">{item.name}</p><p className="text-[11px] text-muted-foreground">{item.department} • {item.employeeId}</p></div>
              <div className="text-right"><span className="font-mono font-bold text-emerald-500">{item.score} / 5.0</span><p className="text-[10px] text-primary font-semibold">{item.rating}</p></div>
            </div>
          ))}
        </div>
      ) : <p className="text-xs text-muted-foreground py-4 text-center">No individual high performers recorded</p>}
    </div>
  );
}
