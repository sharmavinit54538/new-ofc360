import { toast } from "sonner";
import { useMfaState } from "./useMfaState";
import { useMfaActions } from "./useMfaActions";
import { useMfaVerifyDisable } from "./useMfaVerifyDisable";

export function useMfaSettings() {
  const state = useMfaState();
  const actions = useMfaActions(state);
  const verifyDisable = useMfaVerifyDisable(state, actions);

  const handleCopySecret = (secret: string) => {
    navigator.clipboard.writeText(secret);
    state.setCopiedSecret(true);
    toast.success("MFA Secret key copied to clipboard.");
    setTimeout(() => state.setCopiedSecret(false), 2500);
  };

  return { ...state, ...actions, ...verifyDisable, handleCopySecret };
}
