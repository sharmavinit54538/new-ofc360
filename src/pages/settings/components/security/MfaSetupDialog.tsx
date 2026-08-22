import { ShieldCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { EnableMFAResponse } from "@/types/api/settings";
import { MfaQrCodeSection } from "./MfaQrCodeSection";
import { MfaSecretCopyField } from "./MfaSecretCopyField";
import { MfaOtpForm } from "./MfaOtpForm";

export function MfaSetupDialog({ open, onOpenChange, data, otpCode, setOtpCode, copiedSecret, isVerifying, onCopySecret, onVerify }: {
  open: boolean; onOpenChange: (o: boolean) => void; data: EnableMFAResponse | null; otpCode: string; setOtpCode: (c: string) => void; copiedSecret: boolean; isVerifying: boolean; onCopySecret: (s: string) => void; onVerify: (e: React.FormEvent) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border/80 shadow-2xl rounded-2xl">
        <DialogHeader><DialogTitle className="text-base font-bold text-foreground flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary" /><span>Set Up Two-Factor Authentication</span></DialogTitle><DialogDescription className="text-xs text-muted-foreground">Scan this QR code with Google Authenticator, Authy, or Microsoft Authenticator.</DialogDescription></DialogHeader>
        <div className="space-y-4 py-2">
          <MfaQrCodeSection mfaSetupData={data} />
          {data?.secret && <MfaSecretCopyField secret={data.secret} copied={copiedSecret} onCopy={() => onCopySecret(data.secret!)} />}
          <MfaOtpForm otpCode={otpCode} setOtpCode={setOtpCode} isVerifying={isVerifying} onVerify={onVerify} onCancel={() => onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
