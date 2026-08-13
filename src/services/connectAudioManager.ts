import { useConnectSoundStore } from "@/stores/connectSoundStore";
import { useConnectStore } from "@/stores/connectStore";

export type ConnectAudioEventType =
  | "incoming_call"
  | "outgoing_call"
  | "message"
  | "mention"
  | "group_message"
  | "channel_message"
  | "call_connecting"
  | "call_connected"
  | "call_rejected"
  | "call_failed"
  | "call_ended"
  | "busy"
  | "participant_joined"
  | "participant_left"
  | "meeting_start"
  | "meeting_end"
  | "screen_share_start"
  | "screen_share_stop"
  | "notification";

export interface PlaySoundOptions {
  eventId?: string;
  conversationId?: string;
  isMention?: boolean;
  isGroup?: boolean;
  isChannel?: boolean;
  force?: boolean;
}

// Priority mapping (lower number = higher priority)
const SOUND_PRIORITIES: Record<ConnectAudioEventType, number> = {
  incoming_call: 1,
  outgoing_call: 2,
  call_connecting: 2,
  call_connected: 2,
  call_rejected: 2,
  call_failed: 2,
  call_ended: 2,
  busy: 2,
  mention: 3,
  message: 4,
  group_message: 5,
  channel_message: 5,
  notification: 6,
  meeting_start: 7,
  meeting_end: 7,
  screen_share_start: 7,
  screen_share_stop: 7,
  participant_joined: 8,
  participant_left: 8,
};

class ConnectAudioManager {
  private audioCtx: AudioContext | null = null;
  private incomingCallTimer: number | null = null;
  private outgoingCallTimer: number | null = null;
  private isIncomingRinging = false;
  private isOutgoingRinging = false;
  private processedEvents = new Map<string, number>(); // eventId -> timestamp
  private currentPriority = 999;

  constructor() {
    // Lazy initialize AudioContext on demand or on unlock
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;

    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }

    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume().catch(() => {});
    }

    return this.audioCtx;
  }

  /**
   * Unlock AudioContext on user interaction
   */
  public async unlockAudio(): Promise<boolean> {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return false;

      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      // Play ultra-short silent buffer to unlock browser audio policy
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);

      useConnectSoundStore.getState().setAudioUnlocked(true);
      return ctx.state === "running";
    } catch (e) {
      console.warn("Failed to unlock Web Audio API context:", e);
      return false;
    }
  }

  public isUnlocked(): boolean {
    if (!this.audioCtx) return false;
    return this.audioCtx.state === "running";
  }

  /**
   * Get effective volume multiplier (0.0 to 1.0) based on settings & state
   */
  private getMasterGain(): number {
    const soundSettings = useConnectSoundStore.getState();
    if (soundSettings.isMutedAll || !soundSettings.isMasterEnabled) {
      return 0;
    }
    return Math.max(0, Math.min(1, soundSettings.masterVolume / 100));
  }

  /**
   * Duplicate Event Check
   */
  private isDuplicateEvent(eventId?: string): boolean {
    if (!eventId) return false;

    const now = Date.now();
    // Clean up old events (> 15s)
    for (const [id, time] of this.processedEvents.entries()) {
      if (now - time > 15000) {
        this.processedEvents.delete(id);
      }
    }

    if (this.processedEvents.has(eventId)) {
      return true;
    }

    this.processedEvents.set(eventId, now);
    return false;
  }

  /**
   * DND & Preference Checks
   */
  private shouldPlaySound(type: ConnectAudioEventType, options: PlaySoundOptions = {}): boolean {
    const soundSettings = useConnectSoundStore.getState();

    if (soundSettings.isMutedAll || !soundSettings.isMasterEnabled) return false;

    // Check specific toggle settings
    switch (type) {
      case "incoming_call":
        if (!soundSettings.isIncomingCallsEnabled) return false;
        break;
      case "outgoing_call":
      case "call_connecting":
        if (!soundSettings.isOutgoingCallsEnabled) return false;
        break;
      case "message":
        if (!soundSettings.isMessagesEnabled) return false;
        break;
      case "mention":
        if (!soundSettings.isMentionsEnabled) return false;
        break;
      case "group_message":
        if (!soundSettings.isGroupMessagesEnabled) return false;
        break;
      case "channel_message":
        if (!soundSettings.isChannelMessagesEnabled) return false;
        break;
      case "meeting_start":
      case "meeting_end":
      case "screen_share_start":
      case "screen_share_stop":
        if (!soundSettings.isMeetingSoundsEnabled) return false;
        break;
      case "participant_joined":
      case "participant_left":
        if (!soundSettings.isParticipantJoinLeaveEnabled) return false;
        break;
      default:
        break;
    }

    // Check DND presence status
    const presence = useConnectStore.getState().currentUserPresence;
    if (presence === "dnd") {
      // DND allows incoming calls, but suppresses messages/mentions/meetings unless forced
      if (type !== "incoming_call" && type !== "call_connected" && type !== "call_ended" && !options.force) {
        return false;
      }
    }

    // Check Sound Priority (if incoming call is ringing, suppress low-priority notification sounds)
    const priority = SOUND_PRIORITIES[type] || 6;
    if (this.isIncomingRinging && priority > SOUND_PRIORITIES.incoming_call) {
      return false;
    }

    return true;
  }

  // ==========================================
  // SYNTHESIZER UTILITIES (Web Audio API)
  // ==========================================

  private playTone(freq: number, duration: number, type: OscillatorType = "sine", delay = 0, gainLevel = 1.0) {
    const masterGain = this.getMasterGain();
    if (masterGain === 0) return;

    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

      const peakGain = gainLevel * masterGain * 0.35;
      gainNode.gain.setValueAtTime(0.001, ctx.currentTime + delay);
      gainNode.gain.exponentialRampToValueAtTime(peakGain, ctx.currentTime + delay + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration + 0.05);
    } catch (e) {
      console.warn("Error playing tone:", e);
    }
  }

  private playChord(freqs: number[], duration: number, delay = 0, gainLevel = 1.0) {
    freqs.forEach((f) => this.playTone(f, duration, "sine", delay, gainLevel / freqs.length));
  }

  // ==========================================
  // PUBLIC AUDIO CONTROL METHODS
  // ==========================================

  /**
   * INCOMING CALL RINGTONE (Looping)
   */
  public playIncomingCall() {
    if (!this.shouldPlaySound("incoming_call")) return;
    if (this.isIncomingRinging) return;

    this.isIncomingRinging = true;

    const runIncomingRingStep = () => {
      if (!this.isIncomingRinging) return;
      // Soft pleasant two-stage marimba ring chime (E5 -> G5 -> C6)
      this.playTone(659.25, 0.15, "sine", 0, 1.0);  // E5
      this.playTone(783.99, 0.15, "sine", 0.12, 1.0); // G5
      this.playTone(1046.5, 0.3, "sine", 0.24, 1.2);  // C6

      this.playTone(659.25, 0.15, "sine", 0.7, 1.0);
      this.playTone(783.99, 0.15, "sine", 0.82, 1.0);
      this.playTone(1046.5, 0.4, "sine", 0.94, 1.2);
    };

    runIncomingRingStep();
    if (this.incomingCallTimer) clearInterval(this.incomingCallTimer);
    this.incomingCallTimer = window.setInterval(runIncomingRingStep, 2200);
  }

  public stopIncomingCall() {
    this.isIncomingRinging = false;
    if (this.incomingCallTimer) {
      clearInterval(this.incomingCallTimer);
      this.incomingCallTimer = null;
    }
  }

  /**
   * OUTGOING CALL RINGBACK TONE (Looping)
   */
  public playOutgoingCall() {
    if (!this.shouldPlaySound("outgoing_call")) return;
    if (this.isOutgoingRinging) return;

    this.isOutgoingRinging = true;

    const runOutgoingRingStep = () => {
      if (!this.isOutgoingRinging) return;
      // Soft classic telecom ringback tone (440Hz + 480Hz dual sine burst)
      this.playChord([440, 480], 1.2, 0, 0.7);
    };

    runOutgoingRingStep();
    if (this.outgoingCallTimer) clearInterval(this.outgoingCallTimer);
    this.outgoingCallTimer = window.setInterval(runOutgoingRingStep, 3200);
  }

  public stopOutgoingCall() {
    this.isOutgoingRinging = false;
    if (this.outgoingCallTimer) {
      clearInterval(this.outgoingCallTimer);
      this.outgoingCallTimer = null;
    }
  }

  /**
   * NEW MESSAGE SOUND
   */
  public playMessage(options: PlaySoundOptions = {}) {
    if (options.eventId && this.isDuplicateEvent(options.eventId)) return;

    const eventType: ConnectAudioEventType = options.isMention
      ? "mention"
      : options.isGroup
      ? "group_message"
      : options.isChannel
      ? "channel_message"
      : "message";

    if (!this.shouldPlaySound(eventType, options)) return;

    if (options.isMention) {
      // Mention: Bright double chime (G5 -> D6)
      this.playTone(783.99, 0.12, "triangle", 0, 1.1);
      this.playTone(1174.66, 0.22, "sine", 0.1, 1.3);
    } else {
      // Standard Message: Soft warm pop chime (E5 -> B5)
      this.playTone(659.25, 0.1, "sine", 0, 0.9);
      this.playTone(987.77, 0.18, "sine", 0.08, 1.0);
    }
  }

  /**
   * MENTION SOUND
   */
  public playMention(options: PlaySoundOptions = {}) {
    this.playMessage({ ...options, isMention: true });
  }

  /**
   * CALL STATE SOUNDS
   */
  public playCallConnecting() {
    if (!this.shouldPlaySound("call_connecting")) return;
    this.playTone(440, 0.2, "sine", 0, 0.6);
  }

  public playCallConnected() {
    this.stopIncomingCall();
    this.stopOutgoingCall();
    if (!this.shouldPlaySound("call_connected")) return;
    // Pleasant ascending chord (C5 -> E5 -> G5)
    this.playTone(523.25, 0.12, "sine", 0, 0.9);
    this.playTone(659.25, 0.12, "sine", 0.09, 1.0);
    this.playTone(783.99, 0.25, "sine", 0.18, 1.2);
  }

  public playCallRejected() {
    this.stopIncomingCall();
    this.stopOutgoingCall();
    if (!this.shouldPlaySound("call_rejected")) return;
    // Soft double descending note
    this.playTone(587.33, 0.15, "sine", 0, 0.9);
    this.playTone(440.0, 0.3, "sine", 0.12, 0.9);
  }

  public playCallFailed() {
    this.stopIncomingCall();
    this.stopOutgoingCall();
    if (!this.shouldPlaySound("call_failed")) return;
    // Low double warning pulse
    this.playTone(220, 0.2, "sawtooth", 0, 0.6);
    this.playTone(180, 0.3, "sawtooth", 0.15, 0.6);
  }

  public playCallEnded() {
    this.stopIncomingCall();
    this.stopOutgoingCall();
    if (!this.shouldPlaySound("call_ended")) return;
    // Gentle end chime (G4 -> D4)
    this.playTone(392.0, 0.15, "sine", 0, 0.8);
    this.playTone(293.66, 0.3, "sine", 0.12, 0.8);
  }

  public playBusy() {
    this.stopIncomingCall();
    this.stopOutgoingCall();
    if (!this.shouldPlaySound("busy")) return;
    // Busy tone cadence
    this.playChord([480, 620], 0.35, 0, 0.7);
    this.playChord([480, 620], 0.35, 0.5, 0.7);
  }

  /**
   * MEETING SOUNDS
   */
  public playParticipantJoined(options: PlaySoundOptions = {}) {
    if (options.eventId && this.isDuplicateEvent(options.eventId)) return;
    if (!this.shouldPlaySound("participant_joined", options)) return;
    // Warm subtle join ding (F5 tone)
    this.playTone(698.46, 0.18, "sine", 0, 0.7);
  }

  public playParticipantLeft(options: PlaySoundOptions = {}) {
    if (options.eventId && this.isDuplicateEvent(options.eventId)) return;
    if (!this.shouldPlaySound("participant_left", options)) return;
    // Soft subtle leave dong (C5 tone)
    this.playTone(523.25, 0.22, "sine", 0, 0.6);
  }

  public playMeetingStarted(options: PlaySoundOptions = {}) {
    if (options.eventId && this.isDuplicateEvent(options.eventId)) return;
    if (!this.shouldPlaySound("meeting_start", options)) return;
    // Inspiring 3-step acoustic chime (A4 -> C#5 -> E5)
    this.playTone(440.0, 0.12, "sine", 0, 0.8);
    this.playTone(554.37, 0.12, "sine", 0.08, 0.9);
    this.playTone(659.25, 0.3, "sine", 0.16, 1.1);
  }

  public playMeetingEnded(options: PlaySoundOptions = {}) {
    if (options.eventId && this.isDuplicateEvent(options.eventId)) return;
    if (!this.shouldPlaySound("meeting_end", options)) return;
    // Gentle resolve chime (E5 -> A4)
    this.playTone(659.25, 0.15, "sine", 0, 0.8);
    this.playTone(440.0, 0.35, "sine", 0.12, 0.8);
  }

  public playScreenShareStarted(options: PlaySoundOptions = {}) {
    if (options.eventId && this.isDuplicateEvent(options.eventId)) return;
    if (!this.shouldPlaySound("screen_share_start", options)) return;
    // High subtle tick-up (A5 -> E6)
    this.playTone(880.0, 0.08, "sine", 0, 0.7);
    this.playTone(1318.51, 0.15, "sine", 0.06, 0.8);
  }

  public playScreenShareStopped(options: PlaySoundOptions = {}) {
    if (options.eventId && this.isDuplicateEvent(options.eventId)) return;
    if (!this.shouldPlaySound("screen_share_stop", options)) return;
    // Soft tick-down (E6 -> A5)
    this.playTone(1318.51, 0.08, "sine", 0, 0.7);
    this.playTone(880.0, 0.18, "sine", 0.06, 0.7);
  }

  public playNotification(options: PlaySoundOptions = {}) {
    if (options.eventId && this.isDuplicateEvent(options.eventId)) return;
    if (!this.shouldPlaySound("notification", options)) return;
    // Soft notification ping
    this.playTone(783.99, 0.15, "sine", 0, 0.8);
  }

  /**
   * STOP ALL SOUNDS & CLEANUP
   */
  public stopAllSounds() {
    this.stopIncomingCall();
    this.stopOutgoingCall();
    if (this.audioCtx && this.audioCtx.state === "running") {
      try {
        this.audioCtx.suspend();
      } catch (e) {}
    }
  }
}

export const connectAudioManager = new ConnectAudioManager();
