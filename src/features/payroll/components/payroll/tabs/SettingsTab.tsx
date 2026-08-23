import { SettingsHeader } from "./settings/SettingsHeader";
import { SettingsForm } from "./settings/SettingsForm";

export function SettingsTab() {
  return (
    <div className="space-y-6">
      <SettingsHeader />
      <SettingsForm />
    </div>
  );
}
