import { describe, it, expect, beforeEach, vi } from "vitest";
import { store } from "@/app/store";
import {
  startOutgoingCall,
  setOutgoingRinging,
  receiveIncomingCall,
  acceptIncomingCall,
  setCallConnecting,
  setCallConnected,
  setCallDeclined,
  setCallMissed,
  setCallFailed,
  endCall,
  resetCallState,
  incrementCallDuration,
} from "@/features/connect/callSlice";
import {
  selectCallStatus,
  selectActiveCall,
  selectIncomingCall,
  selectOutgoingCall,
  selectRemoteParticipant,
  selectCallDuration,
  selectIsCallActive,
  selectIsCallConnecting,
  selectIsCallRinging,
} from "@/features/connect/selectors";
import { handleWsCallEvent } from "@/services/websocket/handlers/wsCallHandler";
import { ConnectUser } from "@/types/connect";

const mockTargetUser: ConnectUser = {
  id: "usr_alex_789",
  name: "Alex Morgan",
  email: "alex.morgan@company.com",
  role: "Lead Engineer",
  department: "Engineering",
};

const mockCaller: ConnectUser = {
  id: "usr_sarah_456",
  name: "Sarah Connor",
  email: "sarah.connor@company.com",
  role: "Product Manager",
  department: "Product",
};

describe("OFC360 Connect Real-Time Calling System & Canonical State Machine", () => {
  beforeEach(() => {
    store.dispatch(resetCallState());
  });

  it("1. Initializes with IDLE state and empty call references", () => {
    const state = store.getState();
    expect(selectCallStatus(state)).toBe("IDLE");
    expect(selectActiveCall(state)).toBeNull();
    expect(selectIncomingCall(state)).toBeNull();
    expect(selectOutgoingCall(state)).toBeNull();
    expect(selectRemoteParticipant(state)).toBeNull();
    expect(selectCallDuration(state)).toBe(0);
    expect(selectIsCallActive(state)).toBe(false);
  });

  it("2. Outgoing Call Flow: Transitions through OUTGOING_CALLING -> OUTGOING_RINGING -> CONNECTING -> CONNECTED", () => {
    // Step 1: User initiates call
    store.dispatch(startOutgoingCall({ targetUser: mockTargetUser, type: "audio" }));
    let state = store.getState();
    expect(selectCallStatus(state)).toBe("OUTGOING_CALLING");
    expect(selectOutgoingCall(state)).not.toBeNull();
    expect(selectRemoteParticipant(state)?.name).toBe("Alex Morgan");
    expect(selectCallDuration(state)).toBe(0);

    // Increment duration during calling should NOT increase duration
    store.dispatch(incrementCallDuration());
    state = store.getState();
    expect(selectCallDuration(state)).toBe(0);

    // Step 2: Signaling confirms callee is ringing
    store.dispatch(setOutgoingRinging());
    state = store.getState();
    expect(selectCallStatus(state)).toBe("OUTGOING_RINGING");
    expect(selectIsCallRinging(state)).toBe(true);

    // Step 3: Callee answers -> WebRTC negotiating
    store.dispatch(setCallConnecting());
    state = store.getState();
    expect(selectCallStatus(state)).toBe("CONNECTING");
    expect(selectIsCallConnecting(state)).toBe(true);

    // Step 4: WebRTC connected
    store.dispatch(setCallConnected());
    state = store.getState();
    expect(selectCallStatus(state)).toBe("CONNECTED");
    expect(selectIsCallActive(state)).toBe(true);

    // Now duration counter INCREMENTS
    store.dispatch(incrementCallDuration());
    store.dispatch(incrementCallDuration());
    state = store.getState();
    expect(selectCallDuration(state)).toBe(2);

    // Step 5: Call ended
    store.dispatch(endCall());
    state = store.getState();
    expect(selectCallStatus(state)).toBe("ENDED");
    expect(selectIsCallActive(state)).toBe(false);
  });

  it("3. Incoming Call Flow: Transitions through INCOMING_RINGING -> CONNECTING -> CONNECTED", () => {
    // Incoming call arrives
    store.dispatch(receiveIncomingCall({ caller: mockCaller, type: "video" }));
    let state = store.getState();
    expect(selectCallStatus(state)).toBe("INCOMING_RINGING");
    expect(selectIncomingCall(state)).not.toBeNull();
    expect(selectRemoteParticipant(state)?.name).toBe("Sarah Connor");
    expect(selectIsCallRinging(state)).toBe(true);

    // User accepts incoming call
    store.dispatch(acceptIncomingCall());
    state = store.getState();
    expect(selectCallStatus(state)).toBe("CONNECTING");
    expect(selectIncomingCall(state)).toBeNull();
    expect(selectActiveCall(state)).not.toBeNull();

    // WebRTC connection establishes
    store.dispatch(setCallConnected());
    state = store.getState();
    expect(selectCallStatus(state)).toBe("CONNECTED");
    expect(selectIsCallActive(state)).toBe(true);
  });

  it("4. Call Declined Flow: Sets status to DECLINED", () => {
    store.dispatch(startOutgoingCall({ targetUser: mockTargetUser, type: "audio" }));
    store.dispatch(setCallDeclined());
    const state = store.getState();
    expect(selectCallStatus(state)).toBe("DECLINED");
    expect(selectIsCallActive(state)).toBe(false);
  });

  it("5. Missed Call Flow: Sets status to MISSED", () => {
    store.dispatch(startOutgoingCall({ targetUser: mockTargetUser, type: "audio" }));
    store.dispatch(setCallMissed());
    const state = store.getState();
    expect(selectCallStatus(state)).toBe("MISSED");
    expect(selectIsCallActive(state)).toBe(false);
  });

  it("6. Call Failed Flow: Sets status to FAILED with error message", () => {
    store.dispatch(startOutgoingCall({ targetUser: mockTargetUser, type: "audio" }));
    store.dispatch(setCallFailed("ICE negotiation failed"));
    const state = store.getState();
    expect(selectCallStatus(state)).toBe("FAILED");
    expect(state.connectCall.errorMessage).toBe("ICE negotiation failed");
  });

  it("7. WebSocket Call Event Handler: Processes call:ringing, call:accepted, call:rejected, call:ended", () => {
    const signalListeners = new Set<(p: any) => void>();

    // call:incoming
    handleWsCallEvent(
      "call:incoming",
      {
        caller: mockCaller,
        callType: "audio",
        callId: "call_ws_123",
      },
      signalListeners
    );
    let state = store.getState();
    expect(selectCallStatus(state)).toBe("INCOMING_RINGING");
    expect(selectIncomingCall(state)?.id).toBe("call_ws_123");

    // call:accepted
    handleWsCallEvent("call:accepted", { callId: "call_ws_123" }, signalListeners);
    state = store.getState();
    expect(selectCallStatus(state)).toBe("CONNECTING");

    // call:rejected
    handleWsCallEvent("call:rejected", { callId: "call_ws_123" }, signalListeners);
    state = store.getState();
    expect(selectCallStatus(state)).toBe("DECLINED");

    // call:ended
    handleWsCallEvent("call:ended", { callId: "call_ws_123" }, signalListeners);
    state = store.getState();
    expect(selectCallStatus(state)).toBe("ENDED");
  });
});
