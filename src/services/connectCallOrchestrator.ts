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
 * 
 * This eliminates scattered call logic and ensures every step
 * of the call flow executes in the correct order.
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
      console.error("[CALL_ORCHESTRATOR] Cannot initiate call: no authenticated user");
      return null;
    }

    if (!targetUser?.id) {
      console.error("[CALL_ORCHESTRATOR] Cannot initiate call: no target user ID");
      return null;
    }

    console.log(`[CALL_INITIATED] Caller: ${callerId} (${currentUser?.name}) → Target: ${targetUser.id} (${targetUser.name}), Type: ${type}`);

    let callId = `call_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Step 1: Notify backend via API (backend should push call:incoming to receiver's socket)
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
      console.log(`[CALL_TARGET_RESOLVED] Backend acknowledged call initiation. callId: ${callId}`);
    } catch (err) {
      console.warn("[CALL_ORCHESTRATOR] Backend initiateCall failed (continuing with WebSocket fallback):", err);
    }

    // Step 2: Update Redux state (this causes CallScreen/VideoCallModal to mount)
    store.dispatch(startOutgoingCall({ targetUser, type, callId }));
    console.log(`[CALL_ORCHESTRATOR] Redux state updated: outgoing call started`);

    // Step 3: Send call:incoming event via WebSocket as fallback/redundant signal
    const callerPayload = {
      id: callerId,
      name: currentUser?.name || "Colleague",
      email: currentUser?.email || "",
      avatar: currentUser?.avatar || currentUser?.photoUrl || currentUser?.photo_url || "",
      role: currentUser?.role || currentUser?.designation || "",
      department: currentUser?.department || "",
    };

    const sent = connectWebSocketService.send("call:incoming", {
      callId,
      type,
      callerId,
      targetUserId: targetUser.id,
      calleeId: targetUser.id,
      caller: callerPayload,
    });
    console.log(`[CALL_SIGNAL_SENT] call:incoming event ${sent ? "sent" : "FAILED to send"} via WebSocket to target: ${targetUser.id}`);

    // Step 4: Play outgoing ringtone
    connectAudioManager.playOutgoingCall();

    // Step 5: Start missed call timeout
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
      console.error("[CALL_ORCHESTRATOR] Cannot accept: no incoming call data");
      return;
    }

    const callId = incomingCall.id;
    const callerId = incomingCall.targetUser?.id;

    console.log(`[CALL_ACCEPTED] Accepting call ${callId} from ${incomingCall.targetUser?.name} (${callerId})`);

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
        console.log(`[CALL_ORCHESTRATOR] Backend notified: call ${callId} accepted`);
      } catch (err) {
        console.warn("[CALL_ORCHESTRATOR] Backend accept status update failed:", err);
      }
    }

    // Step 4: Update Redux state
    store.dispatch(acceptIncomingCall());

    // Step 5: Notify caller via WebSocket that call was accepted
    connectWebSocketService.send("call:accepted", {
      callId,
      callerId,
      type: incomingCall.type,
    });
    console.log(`[CALL_SIGNAL_SENT] call:accepted event sent to caller: ${callerId}`);

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

    console.log(`[CALL_REJECTED] Rejecting call ${callId} from ${incomingCall.targetUser?.name}`);

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
        console.warn("[CALL_ORCHESTRATOR] Backend reject status update failed:", err);
      }
    }

    // Step 4: Update Redux state
    store.dispatch(rejectIncomingCall());

    // Step 5: Notify caller via WebSocket
    connectWebSocketService.send("call:rejected", {
      callId,
      callerId,
    });
    console.log(`[CALL_SIGNAL_SENT] call:rejected event sent to caller: ${callerId}`);
  }

  // ──────────────────────────────────────────────
  // BOTH SIDES: End active call
  // ──────────────────────────────────────────────
  public async endActiveCall(): Promise<void> {
    const state = store.getState().connectCall;
    const activeCall = state.activeCall;
    const remoteUserId = state.remoteUser?.id;

    console.log(`[CALL_ENDED] Ending call ${activeCall?.id}, remote: ${remoteUserId}`);

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
        console.warn("[CALL_ORCHESTRATOR] Backend end call status update failed:", err);
      }
    }

    // Step 4: Notify other party via WebSocket
    if (remoteUserId) {
      connectWebSocketService.send("call:ended", {
        callId: activeCall?.id,
        targetUserId: remoteUserId,
      });
      console.log(`[CALL_SIGNAL_SENT] call:ended event sent to remote: ${remoteUserId}`);
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
    console.log(`[WEBRTC_INIT] Initializing WebRTC for CALLER, target: ${targetUserId}, type: ${type}`);

    try {
      // Initialize peer connection with signal listener
      await connectWebRTCService.init({
        targetUserId,
        callId,
        onRemoteStream: (stream) => {
          console.log("[WEBRTC_REMOTE_STREAM] Received remote stream from receiver");
          this.attachRemoteAudio(stream);
          // When remote stream arrives, call is truly connected
          store.dispatch(setCallConnected({ callId }));
        },
        onConnectionStateChange: (state) => {
          console.log(`[WEBRTC_STATE] Peer connection state: ${state}`);
          if (state === "connected") {
            connectAudioManager.stopOutgoingCall();
            connectAudioManager.playCallConnected();
          } else if (state === "failed" || state === "disconnected") {
            console.warn(`[WEBRTC_STATE] Connection ${state}`);
          }
        },
      });
      this.isWebRTCInitialized = true;

      // Get local media
      const isVideo = type === "video";
      const localStream = await connectWebRTCService.getLocalMedia(true, isVideo);
      if (localStream) {
        console.log(`[WEBRTC_MEDIA] Local media acquired: audio=true, video=${isVideo}`);
      } else {
        console.warn("[WEBRTC_MEDIA] Failed to acquire local media");
      }

      // Create and send offer
      const offer = await connectWebRTCService.createOffer();
      if (offer) {
        console.log("[WEBRTC_OFFER_SENT] SDP offer created and sent to receiver via signaling");
      } else {
        console.warn("[WEBRTC_OFFER_SENT] Failed to create SDP offer");
      }
    } catch (err) {
      console.error("[WEBRTC_INIT] Caller WebRTC initialization failed:", err);
    }
  }

  // ──────────────────────────────────────────────
  // WebRTC: Receiver side initialization
  // ──────────────────────────────────────────────
  private async initWebRTCForReceiver(callerUserId: string, callId: string, type: CallType): Promise<void> {
    console.log(`[WEBRTC_INIT] Initializing WebRTC for RECEIVER, caller: ${callerUserId}, type: ${type}`);

    try {
      // Initialize peer connection with signal listener
      // When the offer arrives via signaling, handleIncomingSignal will auto-create answer
      await connectWebRTCService.init({
        targetUserId: callerUserId,
        callId,
        onRemoteStream: (stream) => {
          console.log("[WEBRTC_REMOTE_STREAM] Received remote stream from caller");
          this.attachRemoteAudio(stream);
          store.dispatch(setCallConnected({ callId }));
        },
        onConnectionStateChange: (state) => {
          console.log(`[WEBRTC_STATE] Peer connection state: ${state}`);
          if (state === "connected") {
            connectAudioManager.stopIncomingCall();
          } else if (state === "failed" || state === "disconnected") {
            console.warn(`[WEBRTC_STATE] Connection ${state}`);
          }
        },
      });
      this.isWebRTCInitialized = true;

      // Get local media for receiver
      const isVideo = type === "video";
      const localStream = await connectWebRTCService.getLocalMedia(true, isVideo);
      if (localStream) {
        console.log(`[WEBRTC_MEDIA] Receiver local media acquired: audio=true, video=${isVideo}`);
      } else {
        console.warn("[WEBRTC_MEDIA] Receiver failed to acquire local media");
      }

      // Answer will be automatically created when offer is received via signaling
      // (handled by connectWebRTCService.handleIncomingSignal)
      console.log("[WEBRTC_INIT] Receiver ready. Waiting for SDP offer from caller...");
    } catch (err) {
      console.error("[WEBRTC_INIT] Receiver WebRTC initialization failed:", err);
    }
  }

  // ──────────────────────────────────────────────
  // Remote audio playback helper
  // ──────────────────────────────────────────────
  private attachRemoteAudio(stream: MediaStream): void {
    // Remove any existing remote audio element
    const existingAudio = document.getElementById("ofc360-remote-audio") as HTMLAudioElement;
    if (existingAudio) {
      existingAudio.srcObject = null;
      existingAudio.remove();
    }

    // Create a new audio element for remote audio playback
    const audioEl = document.createElement("audio");
    audioEl.id = "ofc360-remote-audio";
    audioEl.autoplay = true;
    audioEl.setAttribute("playsinline", "true");
    // Don't set muted=true — we need to hear the remote audio
    audioEl.srcObject = stream;
    audioEl.volume = 1.0;
    document.body.appendChild(audioEl);

    // Attempt to play (may fail without user gesture, but we're in a call context)
    audioEl.play().catch((err) => {
      console.warn("[WEBRTC_AUDIO] Remote audio autoplay blocked:", err);
    });

    console.log("[WEBRTC_AUDIO] Remote audio element attached and playing");
  }

  // ──────────────────────────────────────────────
  // Missed call timeout
  // ──────────────────────────────────────────────
  private startMissedCallTimeout(callId: string, targetUser: ConnectUser): void {
    this.clearMissedCallTimeout();

    this.missedCallTimer = setTimeout(() => {
      const currentState = store.getState().connectCall;
      // Only trigger missed if still in calling/ringing state
      if (currentState.status === "calling" || currentState.status === "ringing") {
        console.log(`[CALL_MISSED] Call ${callId} to ${targetUser.name} timed out after ${MISSED_CALL_TIMEOUT_MS / 1000}s`);

        connectAudioManager.stopOutgoingCall();
        connectAudioManager.stopIncomingCall();
        connectAudioManager.playCallFailed();

        // Notify backend
        store.dispatch(
          connectApi.endpoints.updateCallStatus.initiate({
            callId,
            status: "missed",
          })
        );

        // Notify other party via WebSocket
        connectWebSocketService.send("call:ended", {
          callId,
          reason: "missed",
          targetUserId: targetUser.id,
        });

        // Cleanup WebRTC
        this.cleanupWebRTC();

        // Update Redux - set status to missed, then reset after brief display
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
  private cleanupWebRTC(): void {
    connectWebRTCService.cleanup();
    this.isWebRTCInitialized = false;

    // Remove remote audio element
    const existingAudio = document.getElementById("ofc360-remote-audio") as HTMLAudioElement;
    if (existingAudio) {
      existingAudio.srcObject = null;
      existingAudio.remove();
    }
    console.log("[WEBRTC_CLEANUP] WebRTC resources released");
  }

  /**
   * Get whether WebRTC is currently initialized.
   */
  public get isInitialized(): boolean {
    return this.isWebRTCInitialized;
  }
}

export const connectCallOrchestrator = new ConnectCallOrchestrator();
