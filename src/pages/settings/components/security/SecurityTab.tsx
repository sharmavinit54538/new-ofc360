import { TabsContent } from "@/components/ui/tabs";
import { usePasswordSettings } from "../../hooks/usePasswordSettings";
import { useMfaSettings } from "../../hooks/useMfaSettings";
import { PasswordFormHeader } from "./PasswordFormHeader";
import { PasswordInputFields } from "./PasswordInputFields";
import { MfaSecuritySwitch } from "./MfaSecuritySwitch";
import { MfaDialogs } from "./MfaDialogs";

export function SecurityTab() {
  const p = usePasswordSettings();
  const m = useMfaSettings();
  return (
    <TabsContent value="password">
      <form onSubmit={p.handleUpdatePassword} className="glass-card rounded-2xl p-6 border border-border/50 bg-card space-y-6 shadow-sm max-w-2xl">
        <PasswordFormHeader isChangingPassword={p.isChangingPassword} /><PasswordInputFields passData={p.passData} setPassData={p.setPassData} /><MfaSecuritySwitch mfaEnabled={m.mfaEnabled} disabled={m.isEnablingMFA || m.isDisablingMFA || m.isLoadingMFA} onToggle={m.handleToggleMFA} />
      </form>
      <MfaDialogs m={m} />
    </TabsContent>
  );
}