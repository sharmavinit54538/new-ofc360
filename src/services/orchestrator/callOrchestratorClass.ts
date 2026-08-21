import { ConnectUser, CallType, ActiveCall } from "@/types/connect";
import { CallTimeoutManager } from "./callTimeoutManager";
import { cleanupWebRTC } from "./callWebRTCInit";
import { initiateOutgoingCall } from "./callInitiation";
import { acceptCallLogic, rejectCallLogic } from "./callResponses";
import { cancelCallLogic, endActiveCallLogic } from "./callTermination";

export class ConnectCallOrchestrator {
  private timeoutManager = new CallTimeoutManager();

  public async initiateCall(targetUser: ConnectUser, type: CallType) {
    return initiateOutgoingCall(targetUser, type, (id) => this.timeoutManager.startTimeout(id, targetUser, () => this.cleanupWebRTC()));
  }
  public async acceptCall(call: ActiveCall) { return acceptCallLogic(call, () => this.timeoutManager.clear()); }
  public async rejectCall(call: ActiveCall) { return rejectCallLogic(call, () => this.timeoutManager.clear()); }
  public async cancelCall(callId?: string) { return cancelCallLogic(callId, () => this.timeoutManager.clear()); }
  public async endActiveCall() { return endActiveCallLogic(() => this.timeoutManager.clear()); }
  public cleanupWebRTC() { cleanupWebRTC(); }
}
