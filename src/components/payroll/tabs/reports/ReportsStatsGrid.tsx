import { IndianRupee, Landmark, ShieldAlert, BarChart3 } from "lucide-react";
import { usePayrollContext } from "../../PayrollContext";

export function ReportsStatsGrid() {
  const { fmt } = usePayrollContext();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-2"><Landmark className="w-8 h-8 text-primary" /><p className="text-xs font-medium text-muted-foreground">Gross Salary Budget</p><h4 className="text-xl font-mono font-extrabold">{fmt(850000)}</h4></div>
      <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-2"><ShieldAlert className="w-8 h-8 text-amber-500" /><p className="text-xs font-medium text-muted-foreground">Statutory Provident Fund</p><h4 className="text-xl font-mono font-extrabold">{fmt(102000)}</h4></div>
      <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-2"><IndianRupee className="w-8 h-8 text-emerald-500" /><p className="text-xs font-medium text-muted-foreground">Income Tax Withheld (TDS)</p><h4 className="text-xl font-mono font-extrabold">{fmt(22500)}</h4></div>
      <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-2"><BarChart3 className="w-8 h-8 text-primary" /><p className="text-xs font-medium text-muted-foreground">Month-on-Month Variance</p><h4 className="text-xl font-mono font-extrabold">+1.2%</h4></div>
    </div>
  );
}
