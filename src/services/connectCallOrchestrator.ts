/**
 * OFC360 Call Orchestrator
 * 
 * Centralized call lifecycle manager that coordinates:
 * - API calls (backend notification)
 * - WebSocket signaling (real-time peer notification)
 * - Redux state management
 * - WebRTC media and peer connection
 * - Audio/ringtone management
 * - Missed call timeout handling
 * - Self-call prevention and user feedback
 */
import { store } from "@/app/store";
import {
  startOutgoingCall,
  receiveIncomingCall,
  acceptIncomingCall,
  rejectIncomingCall,
  setCallConnected,
  endCall,
  setCallStatus,
  resetCallState,
} from "@/features/connect/callSlice";
import { connectWebSocketService } from "./connectWebSocketService";
import { connectWebRTCService } from "./connectWebRTCService";
import { connectAudioManager } from "./connectAudioManager";
import { connectApi } from "./api/connectApi";
import { ConnectUser, CallType, ActiveCall } from "@/types/connect";
import { toast } from "sonner";

/** Configurable missed-call timeout in milliseconds (default 30s) */
const MISSED_CALL_TIMEOUT_MS = 30_000;

class ConnectCallOrchestrator {
  private missedCallTimer: ReturnType<typeof setTimeout> | null = null;
  private isWebRTCInitialized = false;

  // ──────────────────────────────────────────────
  // CALLER: Initiate an outgoing call
  // ──────────────────────────────────────────────
  public async initiateCall(targetUser: ConnectUser, type: CallType): Promise<string | null> {
    const currentUser = store.getState().auth.user;
    const callerId = String(currentUser?.id || currentUser?._id || "");

    if (!callerId) {
      console.error("[CALL] Cannot initiate call: no authenticated user");
      toast.error("You must be logged in to make a call.");
      return null;
    }

    if (!targetUser?.id) {
      console.error("[CALL] Cannot initiate call: no target user ID");
      toast.error("Invalid recipient.");
      return null;
    }

    // Prevent self-calling (Requirement #14)
    const targetId = String(targetUser.id || targetUser.userId || targetUser.user_id || "");
    const currentEmail = currentUser?.email ? String(currentUser.email).toLowerCase().trim() : "";
    const targetEmail = targetUser?.email ? String(targetUser.email).toLowerCase().trim() : "";

    if (
      callerId === targetId ||
      String(currentUser?.id) === targetId ||
      String(currentUser?._id) === targetId ||
      (currentEmail && targetEmail && currentEmail === targetEmail)
    ) {
      console.warn("[CALL] Self-call attempt prevented");
      toast.error("You cannot call yourself.");
      return null;
    }

    console.log(`[CALL] outgoing started — Caller: ${callerId} (${currentUser?.name}) → Target: ${targetUser.id} (${targetUser.name}), Type: ${type}`);

    let callId = `call_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Step 1: Notify backend via API (backend routes call:incoming to receiver's socket)
    try {
      const result = await store.dispatch(
        connectApi.endpoints.initiateCall.initiate({
          calleeId: targetUser.id,
          targetUserId: targetUser.id,
          type,
        })
      ).unwrap();

      if (result?.callId) {
        callId = result.callId;
      }
      console.log(`[CALL] backend call target resolved. callId: ${callId}`);
    } catch (err) {
      console.warn("[CALL] backend initiateCall failed (continuing with WebSocket signaling):", err);
    }

    // Step 2: Update Redux state (causes CallScreen/VideoCallModal to mount)
    store.dispatch(startOutgoingCall({ targetUser, type, callId }));

    // Step 3: Send real-time call events via WebSocket (supports both call:start and call:incoming)
    const callerPayload = {
      id: callerId,
      userId: callerId,
      user_id: callerId,
      name: currentUser?.name || "Colleague",
      email: currentUser?.email || "",
      avatar: currentUser?.avatar || currentUser?.photoUrl || currentUser?.photo_url || "",
      role: currentUser?.role || currentUser?.designation || "",
      department: currentUser?.department || "",
    };

    const callPayload = {
      type: "call:start",
      event: "call:start",
      callId,
      call_id: callId,
      callerId,
      caller_id: callerId,
      receiverId: targetUser.id,
      receiver_id: targetUser.id,
      targetUserId: targetUser.id,
      target_user_id: targetUser.id,
      calleeId: targetUser.id,
      callee_id: targetUser.id,
      callType: type,
      call_type: type,
      caller: callerPayload,
      status: "ringing",
      timestamp: new Date().toISOString(),
    };

    connectWebSocketService.send("call:start", callPayload);
    connectWebSocketService.send("call:incoming", { ...callPayload, type: "call:incoming", event: "call:incoming" });
    console.log(`[CALL] websocket call:start and call:incoming sent to target: ${targetUser.id}`);

    // Step 4: Play outgoing ringtone
    connectAudioManager.playOutgoingCall();

    // Step 5: Start missed call timeout (30s)
    this.startMissedCallTimeout(callId, targetUser);

    // Step 6: Initialize WebRTC for caller side
    await this.initWebRTCForCaller(targetUser.id, callId, type);

    return callId;
  }

  // ──────────────────────────────────────────────
  // RECEIVER: Accept incoming call
  // ──────────────────────────────────────────────
  public async acceptCall(incomingCall: ActiveCall): Promise<void> {
    if (!incomingCall) {
      console.error("[CALL] Cannot accept: no incoming call data");
      return;
    }

    const callId = incomingCall.id;
    const callerId = incomingCall.targetUser?.id;

    console.log(`[CALL] accepted — callId: ${callId} from ${incomingCall.targetUser?.name} (${callerId})`);

    // Step 1: Clear missed call timeout
    this.clearMissedCallTimeout();

    // Step 2: Stop incoming ringtone, play connected chime
    connectAudioManager.stopIncomingCall();
    connectAudioManager.playCallConnected();

    // Step 3: Notify backend via API
    if (callId) {
      try {
        await store.dispatch(
          connectApi.endpoints.updateCallStatus.initiate({
            callId,
            status: "connected",
          })
        ).unwrap();
        console.log(`[CALL] backend notified: call ${callId} connected`);
      } catch (err) {
        console.warn("[CALL] backend accept status update failed:", err);
      }
    }

    // Step 4: Update Redux state
    store.dispatch(acceptIncomingCall());

    // Step 5: Notify caller via WebSocket that call was accepted
    connectWebSocketService.send("call:accepted", {
      type: "call:accepted",
      event: "call:accepted",
      callId,
      call_id: callId,
      callerId,
      caller_id: callerId,
      receiverId: store.getState().auth.user?.id,
      receiver_id: store.getState().auth.user?.id,
      callType: incomingCall.type,
      call_type: incomingCall.type,
      status: "connected",
      timestamp: new Date().toISOString(),
    });
    console.log(`[CALL] call:accepted event sent to caller: ${callerId}`);

    // Step 6: Initialize WebRTC for receiver side
    if (callerId) {
      await this.initWebRTCForReceiver(callerId, callId, incomingCall.type);
    }
  }

  // ──────────────────────────────────────────────
  // RECEIVER: Reject incoming call
  // ──────────────────────────────────────────────
  public async rejectCall(incomingCall: ActiveCall): Promise<void> {
    if (!incomingCall) return;

    const callId = incomingCall.id;
    const callerId = incomingCall.targetUser?.id;

    console.log(`[CALL] rejected — callId: ${callId} from ${incomingCall.targetUser?.name}`);

    // Step 1: Clear timeout
    this.clearMissedCallTimeout();

    // Step 2: Stop ringtone, play rejected sound
    connectAudioManager.stopIncomingCall();
    connectAudioManager.playCallRejected();

    // Step 3: Notify backend
    if (callId) {
      try {
        await store.dispatch(
          connectApi.endpoints.updateCallStatus.initiate({
            callId,
            status: "rejected",
          })
        ).unwrap();
      } catch (err) {
        console.warn("[CALL] backend reject status update failed:", err);
      }
    }

    // Step 4: Update Redux state
    store.dispatch(rejectIncomingCall());

    // Step 5: Notify caller via WebSocket
    connectWebSocketService.send("call:rejected", {
      type: "call:rejected",
      event: "call:rejected",
      callId,
      call_id: callId,
      callerId,
      caller_id: callerId,
      receiverId: store.getState().auth.user?.id,
      receiver_id: store.getState().auth.user?.id,
      reason: "rejected",
      timestamp: new Date().toISOString(),
    });
    console.log(`[CALL] call:rejected event sent to caller: ${callerId}`);
  }

  // ──────────────────────────────────────────────
  // CALLER: Cancel outgoing call while ringing
  // ──────────────────────────────────────────────
  public async cancelCall(callIdParam?: string): Promise<void> {
    const state = store.getState().connectCall;
    const callId = callIdParam || state.activeCall?.id;
    const targetUserId = state.remoteUser?.id;

    console.log(`[CALL] cancelled — callId: ${callId}, target: ${targetUserId}`);

    this.clearMissedCallTimeout();
    connectAudioManager.stopOutgoingCall();
    connectAudioManager.stopIncomingCall();
    connectAudioManager.playCallEnded();

    if (callId) {
      try {
        await store.dispatch(
          connectApi.endpoints.updateCallStatus.initiate({
            callId,
            status: "rejected",
          })
        ).unwrap();
      } catch {}
    }

    if (targetUserId) {
      const cancelPayload = {
        type: "call:cancel",
        event: "call:cancel",
        callId,
        call_id: callId,
        targetUserId,
        target_user_id: targetUserId,
        receiverId: targetUserId,
        receiver_id: targetUserId,
        reason: "cancelled",
        timestamp: new Date().toISOString(),
      };
      connectWebSocketService.send("call:cancel", cancelPayload);
      connectWebSocketService.send("call:cancelled", { ...cancelPayload, type: "call:cancelled", event: "call:cancelled" });
    }

    this.cleanupWebRTC();
    store.dispatch(endCall());
  }

  // ──────────────────────────────────────────────
  // BOTH SIDES: End active call
  // ──────────────────────────────────────────────
  public async endActiveCall(): Promise<void> {
    const state = store.getState().connectCall;
    const activeCall = state.activeCall;
    const remoteUserId = state.remoteUser?.id;
    const isRinging = state.status === "calling" || state.status === "ringing";

    if (isRinging) {
      await this.cancelCall(activeCall?.id);
      return;
    }

    console.log(`[CALL] ended — callId: ${activeCall?.id}, remote: ${remoteUserId}`);

    // Step 1: Clear timeout
    this.clearMissedCallTimeout();

    // Step 2: Stop all ringtones, play ended sound
    connectAudioManager.stopIncomingCall();
    connectAudioManager.stopOutgoingCall();
    connectAudioManager.playCallEnded();

    // Step 3: Notify backend
    if (activeCall?.id) {
      try {
        await store.dispatch(
          connectApi.endpoints.updateCallStatus.initiate({
            callId: activeCall.id,
            status: "ended",
            duration: state.duration,
          })
        ).unwrap();
      } catch (err) {
        console.warn("[CALL] backend end call status update failed:", err);
      }
    }

    // Step 4: Notify other party via WebSocket
    if (remoteUserId) {
      connectWebSocketService.send("call:ended", {
        type: "call:ended",
        event: "call:ended",
        callId: activeCall?.id,
        call_id: activeCall?.id,
        targetUserId: remoteUserId,
        receiver_id: remoteUserId,
        reason: "ended",
        timestamp: new Date().toISOString(),
      });
      console.log(`[CALL] call:ended event sent to remote: ${remoteUserId}`);
    }

    // Step 5: Cleanup WebRTC
    this.cleanupWebRTC();

    // Step 6: Update Redux state
    store.dispatch(endCall());
  }

  // ──────────────────────────────────────────────
  // WebRTC: Caller side initialization
  // ──────────────────────────────────────────────
  private async initWebRTCForCaller(targetUserId: string, callId: string, type: CallType): Promise<void> {
    console.log(`[WEBRTC] Initializing WebRTC for CALLER, target: ${targetUserId}, type: ${type}`);

    try {
      // Initialize peer connection with signal listener
      await connectWebRTCService.init({
        targetUserId,
        callId,
        onRemoteStream: (stream) => {
          console.log("[WEBRTC] Remote stream received from receiver");
          this.attachRemoteAudio(stream);
          store.dispatch(setCallConnected({ callId }));
        },
        onConnectionStateChange: (state) => {
          if (state === "connected") {
            connectAudioManager.stopOutgoingCall();
            connectAudioManager.playCallConnected();
            store.dispatch(setCallConnected({ callId }));
          } else if (state === "failed" || state === "disconnected") {
            console.warn(`[WEBRTC] Connection ${state}`);
          }
        },
      });
      this.isWebRTCInitialized = true;

      // Get local media
      const isVideo = type === "video";
      const localStream = await connectWebRTCService.getLocalMedia(true, isVideo);
      if (localStream) {
        console.log(`[WEBRTC] Local media acquired: audio=true, video=${isVideo}`);
      } else {
        console.warn("[WEBRTC] Failed to acquire local media");
      }

      // Create and send offer
      const offer = await connectWebRTCService.createOffer();
      if (offer) {
        console.log("[WEBRTC] offer sent to receiver via signaling");
      } else {
        console.warn("[WEBRTC] Failed to create offer");
      }
    } catch (err) {
      console.error("[WEBRTC] Caller initialization failed:", err);
    }
  }

  // ──────────────────────────────────────────────
  // WebRTC: Receiver side initialization
  // ──────────────────────────────────────────────
  private async initWebRTCForReceiver(callerUserId: string, callId: string, type: CallType): Promise<void> {
    console.log(`[WEBRTC] Initializing WebRTC for RECEIVER, caller: ${callerUserId}, type: ${type}`);

    try {
      await connectWebRTCService.init({
        targetUserId: callerUserId,
        callId,
        onRemoteStream: (stream) => {
          console.log("[WEBRTC] Remote stream received from caller");
          this.attachRemoteAudio(stream);
          store.dispatch(setCallConnected({ callId }));
        },
        onConnectionStateChange: (state) => {
          if (state === "connected") {
            connectAudioManager.stopIncomingCall();
            store.dispatch(setCallConnected({ callId }));
          } else if (state === "failed" || state === "disconnected") {
            console.warn(`[WEBRTC] Connection ${state}`);
          }
        },
      });
      this.isWebRTCInitialized = true;

      // Get local media for receiver
      const isVideo = type === "video";
      const localStream = await connectWebRTCService.getLocalMedia(true, isVideo);
      if (localStream) {
        console.log(`[WEBRTC] Receiver local media acquired: audio=true, video=${isVideo}`);
      } else {
        console.warn("[WEBRTC] Receiver failed to acquire local media");
      }

      console.log("[WEBRTC] Receiver ready. Waiting for SDP offer from caller...");
    } catch (err) {
      console.error("[WEBRTC] Receiver initialization failed:", err);
    }
  }

  // ──────────────────────────────────────────────
  // Remote audio playback helper
  // ──────────────────────────────────────────────
  private attachRemoteAudio(stream: MediaStream): void {
    const existingAudio = document.getElementById("ofc360-remote-audio") as HTMLAudioElement;
    if (existingAudio) {
      existingAudio.srcObject = null;
      existingAudio.remove();
    }

    const audioEl = document.createElement("audio");
    audioEl.id = "ofc360-remote-audio";
    audioEl.autoplay = true;
    audioEl.setAttribute("playsinline", "true");
    audioEl.srcObject = stream;
    audioEl.volume = 1.0;
    document.body.appendChild(audioEl);

    audioEl.play().catch((err) => {
      console.warn("[WEBRTC] Remote audio autoplay blocked:", err);
    });

    console.log("[WEBRTC] Remote audio element attached and playing");
  }

  // ──────────────────────────────────────────────
  // Missed call timeout
  // ──────────────────────────────────────────────
  private startMissedCallTimeout(callId: string, targetUser: ConnectUser): void {
    this.clearMissedCallTimeout();

    this.missedCallTimer = setTimeout(() => {
      const currentState = store.getState().connectCall;
      if (currentState.status === "calling" || currentState.status === "ringing") {
        console.log(`[CALL] missed — Call ${callId} to ${targetUser.name} timed out after ${MISSED_CALL_TIMEOUT_MS / 1000}s`);

        connectAudioManager.stopOutgoingCall();
        connectAudioManager.stopIncomingCall();
        connectAudioManager.playCallFailed();
        toast.info(`No answer from ${targetUser.name}`);

        // Notify backend
        store.dispatch(
          connectApi.endpoints.updateCallStatus.initiate({
            callId,
            status: "missed",
          })
        );

        // Notify other party via WebSocket
        connectWebSocketService.send("call:ended", {
          type: "call:ended",
          event: "call:ended",
          callId,
          call_id: callId,
          reason: "missed",
          targetUserId: targetUser.id,
          receiver_id: targetUser.id,
        });

        this.cleanupWebRTC();
        store.dispatch(setCallStatus("missed"));
        setTimeout(() => {
          store.dispatch(resetCallState());
        }, 3000);
      }
    }, MISSED_CALL_TIMEOUT_MS);
  }

  private clearMissedCallTimeout(): void {
    if (this.missedCallTimer) {
      clearTimeout(this.missedCallTimer);
      this.missedCallTimer = null;
    }
  }

  // ──────────────────────────────────────────────
  // WebRTC cleanup
  // ──────────────────────────────────────────────
  public cleanupWebRTC(): void {
    connectWebRTCService.cleanup();
    this.isWebRTCInitialized = false;

    const existingAudio = document.getElementById("ofc360-remote-audio") as HTMLAudioElement;
    if (existingAudio) {
      existingAudio.srcObject = null;
      existingAudio.remove();
    }
    console.log("[WEBRTC] cleanup completed");
  }

  public get isInitialized(): boolean {
    return this.isWebRTCInitialized;
  }
}

export const connectCallOrchestrator = new ConnectCallOrchestrator();