import { store } from "@/app/store";
import { unlockAudioContext } from "./connectAudioContext";
import { setAudioUnlocked } from "@/features/connect/soundSettingsSlice";
import { checkAndLogEvent } from "./connectAudioEvents";
import { ConnectAudioCallManager } from "./connectAudioCalls";

export class ConnectAudioManager {
  private calls = new ConnectAudioCallManager();

  public getSoundSettings() { return store.getState().connectSound; }
  public async unlockAudio() { console.log("[NOTIFICATION_AUDIO] Unlocking audio context"); const ok = await unlockAudioContext(); store.dispatch(setAudioUnlocked(true)); return ok; }
  public playIncomingCall() { this.calls.playIncomingCall(); }
  public stopIncomingCall() { this.calls.stopIncomingCall(); }
  public playOutgoingCall() { this.calls.playOutgoingCall(); }
  public stopOutgoingCall() { this.calls.stopOutgoingCall(); }
  public stopAllSounds() { this.calls.stopAllSounds(); }
  public playMessage(opts?: { eventId?: string; isMention?: boolean }) { if (!checkAndLogEvent(opts?.eventId, "message")) return; console.log(`[MESSAGE_SOUND] Playing message sound (${opts?.isMention ? "mention" : "message"})`); }
  public playMention(opts?: { eventId?: string }) { this.playMessage({ isMention: true, ...opts }); }
  public playCallConnected() { console.log("[CALL_RINGTONE] Playing call connected chime"); }
  public playCallRejected() { console.log("[CALL_RINGTONE] Playing call rejected chime"); }
  public playCallEnded() { console.log("[CALL_RINGTONE] Playing call ended chime"); }
  public playCallFailed() { console.log("[CALL_RINGTONE] Playing call failed chime"); }
  public playNotification() { console.log("[NOTIFICATION_AUDIO] Playing notification sound"); }
  public playParticipantJoined(opts?: any) { console.log("[MEETING_AUDIO] Participant joined"); }
  public playParticipantLeft(opts?: any) { console.log("[MEETING_AUDIO] Participant left"); }
  public playScreenShareStarted() { console.log("[MEETING_AUDIO] Screen share started"); }
  public playScreenShareStopped() { console.log("[MEETING_AUDIO] Screen share stopped"); }
}
