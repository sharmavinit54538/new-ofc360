import { store } from "@/app/store";
import { baseApi } from "@/services/api/baseApi";
import { connectApi } from "@/services/api/connectApi";
import {
  setConnected,
  setReconnecting,
  setConnectionError,
  setLastEvent,
  setTypingStart,
  setTypingStop,
} from "@/features/connect/websocketSlice";
import {
  receiveIncomingCall,
  setCallConnected,
  rejectIncomingCall,
  endCall,
} from "@/features/connect/callSlice";
import {
  addParticipant,
  removeParticipant,
} from "@/features/connect/meetingSlice";
import { setUserPresence } from "@/features/connect/presenceSlice";
import { connectAudioManager } from "@/services/connectAudioManager";
import { ConnectMessage, WebSocketEvent, WebSocketEventType } from "@/types/connect";

class ConnectWebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectTimer: any = null;
  private heartbeatTimer: any = null;
  private isExplicitlyClosed = false;
  private signalListeners = new Set<(payload: any) => void>();

  public connect() {
    if (typeof window === "undefined") return;

    // Check if already connecting or open
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.isExplicitlyClosed = false;
    const state = store.getState();
    const token = state.auth.token || localStorage.getItem("ofc360_access_token");

    if (!token) {
      return;
    }

    const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://api.ofc360.com";
    let wsUrl: string;

    try {
      const parsedUrl = new URL(rawBaseUrl);
      const protocol = parsedUrl.protocol === "https:" ? "wss:" : "ws:";
      wsUrl = `${protocol}//${parsedUrl.host}/api/v1/connect/ws?token=${encodeURIComponent(token)}`;
    } catch {
      const isSecure = window.location.protocol === "https:";
      const protocol = isSecure ? "wss:" : "ws:";
      wsUrl = `${protocol}//api.ofc360.com/api/v1/connect/ws?token=${encodeURIComponent(token)}`;
    }

    try {
      store.dispatch(setReconnecting(this.reconnectAttempts > 0));
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        store.dispatch(setConnected(true));
        this.startHeartbeat();
      };

      this.ws.onmessage = (event) => {
        try {
          const raw = JSON.parse(event.data);
          if (raw.type === "pong" || raw.event === "pong") {
            return;
          }
          this.handleIncomingEvent(raw);
        } catch (e) {
          console.warn("WebSocket parse error:", e);
        }
      };

      this.ws.onerror = (error) => {
        console.warn("WebSocket connection error:", error);
        store.dispatch(setConnectionError("Real-time connection interrupted."));
      };

      this.ws.onclose = (event) => {
        store.dispatch(setConnected(false));
        this.stopHeartbeat();

        if (!this.isExplicitlyClosed) {
          this.scheduleReconnect();
        }
      };
    } catch (err: any) {
      console.warn("WebSocket failed to initiate:", err);
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.isExplicitlyClosed) return;
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      store.dispatch(setConnectionError("Unable to establish real-time connection."));
      return;
    }

    this.reconnectAttempts += 1;
    const delay = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts), 20000);

    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      store.dispatch(setReconnecting(true));
      this.connect();
    }, delay);
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: "ping", timestamp: new Date().toISOString() }));
      }
    }, 25000);
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  public disconnect() {
    this.isExplicitlyClosed = true;
    this.stopHeartbeat();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    store.dispatch(setConnected(false));
  }

  public send(event: WebSocketEventType | string, data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          event,
          data,
          timestamp: new Date().toISOString(),
        })
      );
      return true;
    }
    return false;
  }

  public sendTyping(targetId: string, isTyping: boolean) {
    const event = isTyping ? "typing:start" : "typing:stop";
    const user = store.getState().auth.user?.name || "User";
    this.send(event, { targetId, user });
  }

  public onSignal(callback: (payload: any) => void) {
    this.signalListeners.add(callback);
    return () => {
      this.signalListeners.delete(callback);
    };
  }

  private handleIncomingEvent(eventObj: any) {
    const eventType: WebSocketEventType = eventObj.event || eventObj.type;
    const data = eventObj.data || eventObj.payload || eventObj;
    const currentUserId = String(store.getState().auth.user?.id || "");

    store.dispatch(
      setLastEvent({
        event: eventType,
        data,
        timestamp: eventObj.timestamp || new Date().toISOString(),
      })
    );

    switch (eventType) {
      // 1. Messages
      case "message:new": {
        const message: ConnectMessage = data.message || data;
        const targetId = message.conversationId;

        // Targeted cache updates without full app refetching
        if (targetId) {
          store.dispatch(
            connectApi.util.updateQueryData(
              "getConversationMessages",
              { conversationId: targetId },
              (draft) => {
                if (!draft.some((m) => m.id === message.id)) {
                  draft.push(message);
                }
              }
            )
          );

          store.dispatch(
            connectApi.util.updateQueryData(
              "getChannelMessages",
              { channelId: targetId },
              (draft) => {
                if (!draft.some((m) => m.id === message.id)) {
                  draft.push(message);
                }
              }
            )
          );
        }

        // Update Conversations list preview
        store.dispatch(
          connectApi.util.updateQueryData("getConversations", undefined, (draft) => {
            const conv = draft.find((c) => c.id === targetId);
            if (conv) {
              conv.lastMessage = message;
              conv.updatedAt = message.timestamp || new Date().toISOString();
              if (message.senderId !== currentUserId) {
                conv.unreadCount = (conv.unreadCount || 0) + 1;
              }
            }
          })
        );

        // Sound Chime
        if (message.senderId !== currentUserId) {
          const isMention = message.content?.includes("@") || false;
          connectAudioManager.playMessage({
            eventId: message.id,
            isMention,
          });
        }
        break;
      }

      case "message:update": {
        const updatedMsg: ConnectMessage = data.message || data;
        const targetId = updatedMsg.conversationId;

        if (targetId) {
          store.dispatch(
            connectApi.util.updateQueryData(
              "getConversationMessages",
              { conversationId: targetId },
              (draft) => {
                const idx = draft.findIndex((m) => m.id === updatedMsg.id);
                if (idx !== -1) {
                  draft[idx] = { ...draft[idx], ...updatedMsg };
                }
              }
            )
          );

          store.dispatch(
            connectApi.util.updateQueryData(
              "getChannelMessages",
              { channelId: targetId },
              (draft) => {
                const idx = draft.findIndex((m) => m.id === updatedMsg.id);
                if (idx !== -1) {
                  draft[idx] = { ...draft[idx], ...updatedMsg };
                }
              }
            )
          );
        }
        break;
      }

      case "message:delete": {
        const messageId = data.messageId || data.id;
        const targetId = data.conversationId || data.targetId;

        if (targetId) {
          store.dispatch(
            connectApi.util.updateQueryData(
              "getConversationMessages",
              { conversationId: targetId },
              (draft) => {
                return draft.filter((m) => m.id !== messageId);
              }
            )
          );

          store.dispatch(
            connectApi.util.updateQueryData(
              "getChannelMessages",
              { channelId: targetId },
              (draft) => {
                return draft.filter((m) => m.id !== messageId);
              }
            )
          );
        }
        break;
      }

      case "reaction:toggle": {
        const { messageId, emoji, userId, conversationId } = data;
        if (conversationId) {
          store.dispatch(
            connectApi.util.updateQueryData(
              "getConversationMessages",
              { conversationId },
              (draft) => {
                const msg = draft.find((m) => m.id === messageId);
                if (msg) {
                  const reactions = msg.reactions || [];
                  const existingIdx = reactions.findIndex((r) => r.emoji === emoji);
                  if (existingIdx > -1) {
                    const reaction = reactions[existingIdx];
                    if (reaction.users.includes(userId)) {
                      reaction.users = reaction.users.filter((u) => u !== userId);
                      reaction.count = reaction.users.length;
                      if (reaction.count === 0) reactions.splice(existingIdx, 1);
                    } else {
                      reaction.users.push(userId);
                      reaction.count += 1;
                    }
                  } else {
                    reactions.push({ emoji, count: 1, users: [userId] });
                  }
                  msg.reactions = reactions;
                }
              }
            )
          );
        }
        break;
      }

      // 2. Typing Indicators
      case "typing:start": {
        store.dispatch(setTypingStart({ targetId: data.targetId, user: data.user }));
        break;
      }

      case "typing:stop": {
        store.dispatch(setTypingStop({ targetId: data.targetId, user: data.user }));
        break;
      }

      // 3. Presence
      case "presence:change": {
        store.dispatch(setUserPresence({ userId: data.userId, status: data.status }));
        break;
      }

      // 4. Calls
      case "call:incoming": {
        if (data.targetUserId === currentUserId || data.calleeId === currentUserId) {
          store.dispatch(
            receiveIncomingCall({
              caller: data.caller,
              type: data.type || "audio",
              callId: data.callId,
            })
          );
          connectAudioManager.playIncomingCall();
        }
        break;
      }

      case "call:accepted": {
        store.dispatch(setCallConnected({ callId: data.callId }));
        connectAudioManager.playCallConnected();
        break;
      }

      case "call:rejected": {
        store.dispatch(rejectIncomingCall());
        connectAudioManager.playCallRejected();
        break;
      }

      case "call:ended": {
        store.dispatch(endCall());
        connectAudioManager.playCallEnded();
        break;
      }

      case "webrtc:signal": {
        this.signalListeners.forEach((listener) => listener(data));
        break;
      }

      // 5. Meetings
      case "meeting:participant_joined": {
        store.dispatch(addParticipant(data.user));
        connectAudioManager.playParticipantJoined({ eventId: `join_${data.user?.id}` });
        break;
      }

      case "meeting:participant_left": {
        store.dispatch(removeParticipant(data.userId));
        connectAudioManager.playParticipantLeft({ eventId: `leave_${data.userId}` });
        break;
      }

      case "meeting:screen_share": {
        if (data.isSharing) {
          connectAudioManager.playScreenShareStarted();
        } else {
          connectAudioManager.playScreenShareStopped();
        }
        break;
      }

      default:
        break;
    }
  }
}

export const connectWebSocketService = new ConnectWebSocketService();
