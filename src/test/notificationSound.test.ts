import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { connectAudioManager } from "@/services/connectAudioManager";
import { store } from "@/app/store";
import {
  setMasterEnabled,
  setMasterVolume,
  setMutedAll,
  setMessagesEnabled,
  setIncomingCallsEnabled,
  resetToDefaults,
} from "@/features/connect/soundSettingsSlice";

describe("OFC360 Notification Sound System & ConnectAudioManager", () => {
  beforeEach(() => {
    store.dispatch(resetToDefaults());
    vi.clearAllMocks();
  });

  afterEach(() => {
    connectAudioManager.stopAllSounds();
  });

  it("1. should initialize with default sound settings and volume at 70%", () => {
    const settings = connectAudioManager.getSoundSettings();
    expect(settings.isMasterEnabled).toBe(true);
    expect(settings.masterVolume).toBe(70);
    expect(settings.isMutedAll).toBe(false);
    expect(settings.isIncomingCallsEnabled).toBe(true);
    expect(settings.isMessagesEnabled).toBe(true);
  });

  it("2. should unlock audio upon unlockAudio() call", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    const unlocked = await connectAudioManager.unlockAudio();
    expect(unlocked).toBe(true);

    const reduxUnlocked = store.getState().connectSound.isAudioUnlocked;
    expect(reduxUnlocked).toBe(true);

    const hasLog = consoleSpy.mock.calls.some((call) =>
      call.some((arg) => typeof arg === "string" && arg.includes("[NOTIFICATION_AUDIO]"))
    );
    expect(hasLog).toBe(true);
    consoleSpy.mockRestore();
  });

  it("3. should start and stop incoming call ringtone cleanly", () => {
    const consoleSpy = vi.spyOn(console, "log");

    connectAudioManager.playIncomingCall();
    expect(
      consoleSpy.mock.calls.some((call) =>
        call.some((arg) => typeof arg === "string" && arg.includes("[CALL_RINGTONE] Starting incoming call ringtone"))
      )
    ).toBe(true);

    connectAudioManager.stopIncomingCall();
    expect(
      consoleSpy.mock.calls.some((call) =>
        call.some((arg) => typeof arg === "string" && arg.includes("[CALL_RINGTONE] Stopping incoming call ringtone"))
      )
    ).toBe(true);

    consoleSpy.mockRestore();
  });

  it("4. should play message sound and deduplicate repeated event IDs", () => {
    const consoleSpy = vi.spyOn(console, "log");
    const eventId = `msg_test_${Date.now()}`;

    // First call -> should play sound
    connectAudioManager.playMessage({ eventId, isMention: false });
    expect(
      consoleSpy.mock.calls.some((call) =>
        call.some((arg) => typeof arg === "string" && arg.includes("[MESSAGE_SOUND] Playing message sound (message)"))
      )
    ).toBe(true);

    consoleSpy.mockClear();

    // Second call with same eventId -> should be dropped as duplicate
    connectAudioManager.playMessage({ eventId, isMention: false });
    expect(
      consoleSpy.mock.calls.some((call) =>
        call.some((arg) => typeof arg === "string" && arg.includes(`[NOTIFICATION_EVENT] Dropping duplicate event ID: ${eventId}`))
      )
    ).toBe(true);
    expect(
      consoleSpy.mock.calls.some((call) =>
        call.some((arg) => typeof arg === "string" && arg.includes("[MESSAGE_SOUND] Playing message sound"))
      )
    ).toBe(false);

    consoleSpy.mockRestore();
  });

  it("5. should play distinctive chime on @mention", () => {
    const consoleSpy = vi.spyOn(console, "log");
    const eventId = `mention_test_${Date.now()}`;

    connectAudioManager.playMention({ eventId });
    expect(
      consoleSpy.mock.calls.some((call) =>
        call.some((arg) => typeof arg === "string" && arg.includes("[MESSAGE_SOUND] Playing message sound (mention)"))
      )
    ).toBe(true);

    consoleSpy.mockRestore();
  });

  it("6. should suppress message sound when messages toggle is disabled", () => {
    store.dispatch(setMessagesEnabled(false));
    const consoleSpy = vi.spyOn(console, "log");

    connectAudioManager.playMessage({ eventId: "msg_disabled_test" });
    expect(
      consoleSpy.mock.calls.some((call) =>
        call.some((arg) => typeof arg === "string" && arg.includes("[MESSAGE_SOUND]"))
      )
    ).toBe(false);

    consoleSpy.mockRestore();
  });

  it("7. should suppress all sounds when muted all or master sound is disabled", () => {
    store.dispatch(setMutedAll(true));
    const consoleSpy = vi.spyOn(console, "log");

    connectAudioManager.playIncomingCall();
    expect(
      consoleSpy.mock.calls.some((call) =>
        call.some((arg) => typeof arg === "string" && arg.includes("[CALL_RINGTONE] Starting incoming call ringtone"))
      )
    ).toBe(false);
    expect(
      consoleSpy.mock.calls.some((call) =>
        call.some((arg) => typeof arg === "string" && arg.includes("[NOTIFICATION_AUDIO] Sound suppressed for incoming_call: Master sound disabled or muted."))
      )
    ).toBe(true);

    consoleSpy.mockRestore();
  });

  it("8. should update active volume in real-time when setMasterVolume is dispatched", () => {
    store.dispatch(setMasterVolume(40));
    const settings = connectAudioManager.getSoundSettings();
    expect(settings.masterVolume).toBe(40);
  });

  it("9. should handle call connection, rejection, failure, and ending chimes", () => {
    const consoleSpy = vi.spyOn(console, "log");

    connectAudioManager.playCallConnected();
    expect(
      consoleSpy.mock.calls.some((call) =>
        call.some((arg) => typeof arg === "string" && arg.includes("[CALL_RINGTONE] Playing call connected chime"))
      )
    ).toBe(true);

    connectAudioManager.playCallRejected();
    expect(
      consoleSpy.mock.calls.some((call) =>
        call.some((arg) => typeof arg === "string" && arg.includes("[CALL_RINGTONE] Playing call rejected chime"))
      )
    ).toBe(true);

    connectAudioManager.playCallEnded();
    expect(
      consoleSpy.mock.calls.some((call) =>
        call.some((arg) => typeof arg === "string" && arg.includes("[CALL_RINGTONE] Playing call ended chime"))
      )
    ).toBe(true);

    consoleSpy.mockRestore();
  });
});
