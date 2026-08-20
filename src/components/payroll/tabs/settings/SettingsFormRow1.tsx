import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePayrollContext } from "../../PayrollContext";

export function SettingsFormRow1() {
  const { backendSettings, handleSaveSettings } = usePayrollContext();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <Label className="text-xs font-bold text-foreground">Default Payout Currency</Label>
        <Select value={backendSettings.currency} onValueChange={(val) => handleSaveSettings({ currency: val })}><SelectTrigger className="text-xs h-9"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="INR (₹)">INR (₹) - Indian Rupee</SelectItem><SelectItem value="USD ($)">USD ($) - US Dollar</SelectItem></SelectContent></Select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-bold text-foreground">Default Pay Cycle Period</Label>
        <Select value={backendSettings.default_pay_cycle} onValueChange={(val) => handleSaveSettings({ default_pay_cycle: val })}><SelectTrigger className="text-xs h-9"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Monthly">Monthly</SelectItem><SelectItem value="Bi-weekly">Bi-weekly</SelectItem></SelectContent></Select>
      </div>
    </div>
  );
}
