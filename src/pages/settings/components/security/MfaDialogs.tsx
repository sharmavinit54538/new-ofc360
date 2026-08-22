import { MfaSetupDialog } from "./MfaSetupDialog";
import { MfaDisableDialog } from "./MfaDisableDialog";

export function MfaDialogs({ m }: { m: any }) {
  return (
    <>
      <MfaSetupDialog open={m.isMfaSetupOpen} onOpenChange={m.setIsMfaSetupOpen} data={m.mfaSetupData} otpCode={m.otpCode} setOtpCode={m.setOtpCode} copiedSecret={m.copiedSecret} isVerifying={m.isVerifyingMFA} onCopySecret={m.handleCopySecret} onVerify={m.handleVerifyMFA} />
      <MfaDisableDialog open={m.isMfaDisableOpen} onOpenChange={m.setIsMfaDisableOpen} isDisabling={m.isDisablingMFA} onConfirm={m.handleConfirmDisableMFA} />
    </>
  );
}