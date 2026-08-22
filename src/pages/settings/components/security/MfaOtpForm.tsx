import { ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";

export function MfaOtpForm({ otpCode, setOtpCode, isVerifying, onVerify, onCancel }: {
  otpCode: string; setOtpCode: (c: string) => void; isVerifying: boolean; onVerify: (e: React.FormEvent) => void; onCancel: () => void;
}) {
  return (
    <form onSubmit={onVerify} className="space-y-3 pt-2 border-t border-border/30">
      <div className="space-y-1.5"><Label className="text-xs font-semibold text-foreground">6-Digit Verification Code</Label><Input type="text" maxLength={6} placeholder="000000" value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))} className="bg-secondary/30 text-center font-mono text-lg tracking-widest h-11" autoFocus /></div>
      <DialogFooter className="gap-2 sm:gap-0 pt-2">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel} className="text-xs">Cancel</Button>
        <Button type="submit" size="sm" disabled={isVerifying || otpCode.length < 6} className="gradient-bg text-primary-foreground font-semibold text-xs gap-1.5">{isVerifying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />} Verify & Activate</Button>
      </DialogFooter>
    </form>
  );
}
