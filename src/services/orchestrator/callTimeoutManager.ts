import { store } from "@/app/store";
import { setCallMissed, resetCallState } from "@/features/connect/callSlice";
import { connectAudioManager } from "../connectAudioManager";
import { connectWebSocketService } from "../connectWebSocketService";
import { connectCallsApi } from "../api/connect/connectCallsEndpoints";
import { ConnectUser } from "@/types/connect";
import { toast } from "sonner";

export class CallTimeoutManager {
  private timer: ReturnType<typeof setTimeout> | null = null;

  public startTimeout(
    callId: string,
    targetUser: ConnectUser,
    onCleanup: () => void
  ) {
    this.clear();
    this.timer = setTimeout(() => {
      const state = store.getState().connectCall;
      if (
        state.status === "OUTGOING_CALLING" ||
        state.status === "OUTGOING_RINGING" ||
        state.status === "INCOMING_RINGING" ||
        state.status === "calling" ||
        state.status === "ringing"
      ) {
        connectAudioManager.stopOutgoingCall();
        connectAudioManager.stopIncomingCall();
        connectAudioManager.playCallFailed();
        toast.info(`No answer from ${targetUser.name}`);

        try {
          store.dispatch(
            connectCallsApi.endpoints.updateCallStatus.initiate({
              callId,
              status: "missed",
            })
          );
        } catch {}

        connectWebSocketService.send("call:missed", {
          type: "call:missed",
          callId,
          reason: "timeout",
          targetUserId: targetUser.id,
          receiverId: targetUser.id,
        });

        connectWebSocketService.send("call:ended", {
          type: "call:ended",
          callId,
          reason: "missed",
          targetUserId: targetUser.id,
        });

        onCleanup();
        store.dispatch(setCallMissed());

        setTimeout(() => {
          const currentState = store.getState().connectCall;
          if (currentState.status === "MISSED" || currentState.status === "missed") {
            store.dispatch(resetCallState());
          }
        }, 3000);
      }
    }, 30000);
  }

  public clear() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
