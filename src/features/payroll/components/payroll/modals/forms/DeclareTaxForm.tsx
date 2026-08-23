import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { usePayrollContext } from "../../PayrollContext";

export function DeclareTaxForm() {
  const c = usePayrollContext();
  const flds = [{ l: "Sec 80C", v: c.tax80C, s: c.setTax80C, p: "150000" }, { l: "Sec 80D", v: c.tax80D, s: c.setTax80D, p: "25000" }];
  return (
    <div className="space-y-3 pt-3">
      <div className="space-y-1"><Label className="text-xs font-bold text-foreground">Income Tax Regime Option</Label><Select value={c.taxRegime} onValueChange={c.setTaxRegime}><SelectTrigger className="text-xs h-9 bg-card"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="New Tax Regime (Sec 115BAC)">New Tax Regime (Sec 115BAC)</SelectItem><SelectItem value="Old Tax Regime">Old Tax Regime (With Deductions)</SelectItem></SelectContent></Select></div>
      <div className="grid grid-cols-2 gap-2">{flds.map((f) => <div key={f.l} className="space-y-1"><Label className="text-xs font-bold">{f.l}</Label><Input type="number" placeholder={f.p} value={f.v} onChange={(e) => f.s(e.target.value)} className="text-xs h-9" /></div>)}</div>
      <div className="flex justify-end gap-2 pt-3 border-t border-border/40"><Button onClick={c.handleCreateTaxDeclaration} disabled={c.isCreatingTax} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">{c.isCreatingTax && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Save TDS</Button></div>
    </div>
  );
}
