import { QrCode } from "lucide-react";
import type { EnableMFAResponse } from "@/types/api/settings";

export function MfaQrCodeSection({ mfaSetupData }: { mfaSetupData: EnableMFAResponse | null }) {
  const qr = mfaSetupData?.qrCodeUri || mfaSetupData?.qrCode;
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-secondary/30 rounded-xl border border-border/50">
      {qr ? (
        <img src={qr} alt="MFA QR Code" className="w-44 h-44 rounded-lg bg-white p-2 border border-border/40 shadow-xs object-contain" />
      ) : (
        <div className="w-44 h-44 rounded-lg bg-white p-4 border border-border/40 flex flex-col items-center justify-center text-center space-y-1 text-slate-800">
          <QrCode className="w-12 h-12 text-primary" />
          <p className="text-[11px] font-bold text-foreground">Scan via Authenticator</p>
          <p className="text-[9px] text-muted-foreground">Use the secret key below</p>
        </div>
      )}
    </div>
  );
}
