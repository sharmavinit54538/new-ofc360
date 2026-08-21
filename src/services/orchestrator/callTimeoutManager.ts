import { store } from "@/app/store";
import { setCallStatus, resetCallState } from "@/features/connect/callSlice";
import { connectAudioManager } from "../connectAudioManager";
import { connectWebSocketService } from "../connectWebSocketService";
import { connectApi } from "../api/connectApi";
import { ConnectUser } from "@/types/connect";
import { toast } from "sonner";

export class CallTimeoutManager {
  private timer: ReturnType<typeof setTimeout> | null = null;

  public startTimeout(callId: string, targetUser: ConnectUser, onCleanup: () => void) {
    this.clear();
    this.timer = setTimeout(() => {
      const state = store.getState().connectCall;
      if (state.status === "calling" || state.status === "ringing") {
        connectAudioManager.stopOutgoingCall(); connectAudioManager.stopIncomingCall(); connectAudioManager.playCallFailed();
        toast.info(`No answer from ${targetUser.name}`);
        store.dispatch(connectApi.endpoints.updateCallStatus.initiate({ callId, status: "missed" } as any));
        connectWebSocketService.send("call:ended", { type: "call:ended", event: "call:ended", callId, reason: "missed", targetUserId: targetUser.id });
        onCleanup();
        store.dispatch(setCallStatus("missed"));
        setTimeout(() => store.dispatch(resetCallState()), 3000);
      }
    }, 30000);
  }

  public clear() { if (this.timer) { clearTimeout(this.timer); this.timer = null; } }
}
