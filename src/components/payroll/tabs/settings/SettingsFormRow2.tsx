import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { usePayrollContext } from "../../PayrollContext";

export function SettingsFormRow2() {
  const c = usePayrollContext();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
        <div><Label className="text-xs font-bold text-foreground block">Auto-generate PDF Payslips</Label><span className="text-[10px] text-muted-foreground">Generates payslips automatically.</span></div>
        <Switch checked={c.backendSettings.auto_generate_payslips} onCheckedChange={(val) => c.handleSaveSettings({ auto_generate_payslips: val })} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5"><Label className="text-xs font-bold text-foreground">Sign-off Approval Levels</Label><Input type="number" min={1} max={5} value={c.backendSettings.approval_levels} onChange={(e) => c.handleSaveSettings({ approval_levels: parseInt(e.target.value) || 3 })} className="text-xs h-9 bg-card" /></div>
      </div>
    </div>
  );
}
