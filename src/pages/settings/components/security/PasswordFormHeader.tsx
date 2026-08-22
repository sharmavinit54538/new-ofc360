import { KeyRound, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PasswordFormHeader({ isChangingPassword }: { isChangingPassword: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border/40 pb-4">
      <div>
        <h3 className="text-base font-bold text-foreground">Password & Access Security</h3>
        <p className="text-xs text-muted-foreground">Update your account credentials and multi-factor authentication preferences.</p>
      </div>
      <Button type="submit" size="sm" disabled={isChangingPassword} className="gradient-bg gap-1.5 text-xs text-primary-foreground font-semibold">
        {isChangingPassword ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <KeyRound className="w-3.5 h-3.5" />}
        Update Password
      </Button>
    </div>
  );
}
