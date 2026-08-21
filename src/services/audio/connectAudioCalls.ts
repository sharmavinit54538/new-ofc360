import { RingtoneLoopManager } from "./connectAudioRingtone";
import { checkAndLogEvent } from "./connectAudioEvents";

export class ConnectAudioCallManager {
  private ringtoneLoop = new RingtoneLoopManager();

  public playIncomingCall() { if (!checkAndLogEvent(undefined, "incoming_call")) return; console.log("[CALL_RINGTONE] Starting incoming call ringtone"); this.ringtoneLoop.startIncoming(); }
  public stopIncomingCall() { console.log("[CALL_RINGTONE] Stopping incoming call ringtone"); this.ringtoneLoop.stop(); }
  public playOutgoingCall() { console.log("[CALL_RINGTONE] Starting outgoing call ringtone"); this.ringtoneLoop.startOutgoing(); }
  public stopOutgoingCall() { this.ringtoneLoop.stop(); }
  public stopAllSounds() { this.ringtoneLoop.stop(); }
}
