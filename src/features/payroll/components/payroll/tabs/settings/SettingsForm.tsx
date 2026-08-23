import { Button } from "@/components/ui/button";
import { usePayrollContext } from "../../PayrollContext";
import { SettingsFormRow1 } from "./SettingsFormRow1";
import { SettingsFormRow2 } from "./SettingsFormRow2";

export function SettingsForm() {
  const { handleSaveSettings, isSettingsLoading } = usePayrollContext();
  return (
    <div className="glass-card rounded-2xl p-6 border border-border/60 bg-card space-y-6 max-w-2xl">
      <SettingsFormRow1 />
      <SettingsFormRow2 />
      <div className="flex justify-end pt-4 border-t border-border/40">
        <Button onClick={() => handleSaveSettings({})} disabled={isSettingsLoading} className="gradient-bg text-primary-foreground font-bold text-xs h-9">
          Save System Configurations
        </Button>
      </div>
    </div>
  );
}
