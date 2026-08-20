import { store } from "@/app/store";
import { baseApi } from "@/services/api/baseApi";
import { connectApi, normalizeConnectMessage, isCurrentUser } from "@/services/api/connectApi";
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
import {
  setUserPresence,
  setBatchUserPresences,
  setCurrentUserPresence,
} from "@/features/connect/presenceSlice";
import { connectAudioManager } from "@/services/connectAudioManager";
import { tabSessionManager } from "@/services/tabSessionManager";
import {
  ConnectMessage,
  ConnectNotification,
  WebSocketEvent,
  WebSocketEventType,
  PresenceStatus,
} from "@/types/connect";

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

    const token = store.getState().auth.token || "";
    const isAuth = store.getState().auth.isAuthenticated;
    if (!token && !isAuth) {
      return;
    }

    this.isExplicitlyClosed = false;
    const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://api.ofc360.com";
    let wsUrl: string;

    try {
      const parsedUrl = new URL(rawBaseUrl);
      const protocol = parsedUrl.protocol === "https:" ? "wss:" : "ws:";
      wsUrl = `${protocol}//${parsedUrl.host}/api/v1/connect/ws${token ? `?token=${encodeURIComponent(token)}` : ""}`;
    } catch {
      const isSecure = window.location.protocol === "https:";
      const protocol = isSecure ? "wss:" : "ws:";
      wsUrl = `${protocol}//api.ofc360.com/api/v1/connect/ws${token ? `?token=${encodeURIComponent(token)}` : ""}`;
    }

    try {
      store.dispatch(setReconnecting(this.reconnectAttempts > 0));
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        console.log("[PRESENCE_CONNECT] WebSocket connection established successfully.");
        store.dispatch(setConnected(true));
        store.dispatch(setCurrentUserPresence("online"));
        this.startHeartbeat();

        // Register active browser tab
        const currentUser = store.getState().auth.user;
        const currentUserId = String(currentUser?.id || currentUser?._id || "");
        if (currentUserId) {
          tabSessionManager.registerTab(currentUserId);

          // Broadcast client online presence to server and connected peers
          const onlinePayload = {
            userId: currentUserId,
            user_id: currentUserId,
            employeeId: currentUser?.employee_id || currentUser?.employeeId,
            employee_id: currentUser?.employee_id || currentUser?.employeeId,
            email: currentUser?.email,
            name: currentUser?.name,
            status: "online",
            lastSeen: new Date().toISOString(),
          };

          this.send("presence:change", onlinePayload);
          this.send("USER_ONLINE", onlinePayload);
          this.send("presence:sync", { userId: currentUserId });
          console.log(`[PRESENCE_ONLINE] Sent client online presence for user: ${currentUserId}`);
        }
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
        console.log("[PRESENCE_DISCONNECT] WebSocket connection closed.", event.reason || "");
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

  public disconnect(isExplicitLogout: boolean = true) {
    const currentUser = store.getState().auth.user;
    const currentUserId = String(currentUser?.id || currentUser?._id || "");

    const { remainingTabsCount } = tabSessionManager.unregisterTab(currentUserId, isExplicitLogout);

    if (isExplicitLogout) {
      this.isExplicitlyClosed = true;
      store.dispatch(setCurrentUserPresence("offline"));
    }

    console.log(
      `[PRESENCE_DISCONNECT] Closing WebSocket (explicit: ${isExplicitLogout}, remainingTabs: ${remainingTabsCount})...`
    );

    this.stopHeartbeat();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      if (this.ws.readyState === WebSocket.OPEN) {
        // Only broadcast USER_OFFLINE if this is an explicit logout OR it's the last active tab
        if (isExplicitLogout || remainingTabsCount === 0) {
          try {
            const offlinePayload = {
              userId: currentUserId,
              user_id: currentUserId,
              employee_id: currentUser?.employee_id || currentUser?.employeeId,
              email: currentUser?.email,
              status: "offline",
              lastSeen: new Date().toISOString(),
            };

            this.ws.send(
              JSON.stringify({
                event: "presence:change",
                data: offlinePayload,
                timestamp: new Date().toISOString(),
              })
            );
            this.ws.send(
              JSON.stringify({
                event: "USER_OFFLINE",
                data: offlinePayload,
                timestamp: new Date().toISOString(),
              })
            );
            console.log(`[PRESENCE_OFFLINE] Sent client offline presence before closing.`);
          } catch {}
        }
      }
      try {
        this.ws.close(1000, isExplicitLogout ? "Explicit logout" : "Tab closed");
      } catch {}
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
        const rawMsg = data.message || data;
        const targetId = String(rawMsg.conversationId || rawMsg.conversation_id || rawMsg.channelId || rawMsg.channel_name || "");
        const message: ConnectMessage = normalizeConnectMessage(rawMsg, targetId);

        console.log(`[CHAT_WEBSOCKET] Received message:new event in room ${targetId}:`, message);
        console.log(`[CHAT_INCOMING_MESSAGE] New message from ${message.senderName || message.senderId}: "${message.content}"`);

        // Targeted cache updates without full app refetching
        if (targetId) {
          store.dispatch(
            connectApi.util.updateQueryData(
              "getConversationMessages",
              { conversationId: targetId },
              (draft) => {
                if (!draft.some((m) => m.id === message.id)) {
                  draft.push(message);
                  draft.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
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
                  draft.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
                }
              }
            )
          );
        }

        // Update Conversations list preview and sorting
        store.dispatch(
          connectApi.util.updateQueryData("getConversations", undefined, (draft) => {
            const conv = draft.find((c) => c.id === targetId || String(c.participant?.id) === String(message.senderId));
            if (conv) {
              conv.lastMessage = message;
              conv.updatedAt = message.timestamp || new Date().toISOString();
              if (message.senderId !== currentUserId) {
                conv.unreadCount = (conv.unreadCount || 0) + 1;
              }
              // Re-sort: Pinned first, then newest message
              draft.sort((a, b) => {
                if (a.isPinned && !b.isPinned) return -1;
                if (!a.isPinned && b.isPinned) return 1;
                return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
              });
            } else {
              store.dispatch(connectApi.util.invalidateTags(["Conversations"]));
            }
          })
        );

        // Sound Chime & Real-time Notification
        if (message.senderId !== currentUserId) {
          const isMention = message.content?.includes("@") || false;
          console.log(`[CHAT_NOTIFICATION] Triggering message sound for event: ${message.id} (sender: ${message.senderName || message.senderId})`);
          console.log(`[NOTIFICATION_EVENT] Received message:new event (ID: ${message.id}, sender: ${message.senderName || message.senderId})`);
          connectAudioManager.playMessage({
            eventId: message.id,
            isMention,
          });

          // Insert notification with sender, location/channel, and message content preview
          const isChannel = Boolean((message as any).channelId || targetId?.startsWith("chn_"));
          const channelName = (message as any).channelName || (message as any).channel_name;
          const senderName = message.senderName || "Colleague";
          const title = isChannel
            ? (channelName ? `${senderName} in #${channelName}` : `New message in channel from ${senderName}`)
            : `New message from ${senderName}`;

          const description =
            message.content ||
            (message.attachments?.length
              ? "Sent an attachment"
              : message.isVoiceMessage
              ? "Sent a voice message"
              : "New message");

          // Background Tab Native Browser Notification (if permission granted and tab in background)
          if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted" && document.hidden) {
            try {
              new Notification(title, {
                body: description,
                icon: "/logo.png",
                tag: `msg_${message.id}`,
              });
            } catch {}
          }

          const channelId = isChannel ? ((message as any).channelId || targetId) : undefined;
          const conversationId = !isChannel ? (message.conversationId || targetId) : undefined;

          store.dispatch(
            connectApi.util.updateQueryData("getNotifications", undefined, (draft) => {
              const existingIdx = draft.findIndex(
                (n) => n.id === `notif_${message.id}` || n.id === message.id
              );
              const notifItem: ConnectNotification = {
                id: `notif_${message.id}`,
                type: isMention ? "mention" : isChannel ? "channel" : "message",
                title,
                description,
                timestamp: message.timestamp || new Date().toISOString(),
                read: false,
                link: isChannel
                  ? `/connect/channels/${channelId}`
                  : `/connect/chat/${conversationId}`,
                sender: {
                  id: message.senderId,
                  name: senderName,
                  email: "",
                  avatar: message.senderAvatar,
                },
                channelId,
                channelName,
                conversationId,
                content: description,
              };

              if (existingIdx > -1) {
                draft[existingIdx] = notifItem;
              } else {
                draft.unshift(notifItem);
              }
            })
          );
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

      // 3. Presence & Status
      case "presence:change":
      case "presence:update":
      case "presence_update":
      case "user:presence":
      case "status:change":
      case "user:online":
      case "USER_ONLINE":
      case "user:offline":
      case "USER_OFFLINE":
      case "batch:presence":
      case "presence:batch": {
        const isBatch =
          eventType === "batch:presence" ||
          eventType === "presence:batch" ||
          Array.isArray(data) ||
          (data && typeof data.presences === "object");

        if (isBatch) {
          const presencesMap: Record<string, PresenceStatus> = {};
          if (Array.isArray(data)) {
            data.forEach((item: any) => {
              const uId = String(item.userId || item.user_id || item.id || "");
              const status: PresenceStatus = item.status || (item.isOnline ? "online" : "offline");
              if (uId) presencesMap[uId] = status;
            });
          } else if (data && typeof data.presences === "object") {
            Object.entries(data.presences).forEach(([uId, val]: [string, any]) => {
              const status: PresenceStatus =
                typeof val === "string" ? (val as PresenceStatus) : val?.status || "offline";
              presencesMap[uId] = status;
            });
          }
          console.log(`[PRESENCE_RECEIVED] Received batch presence update for ${Object.keys(presencesMap).length} users`);
          store.dispatch(setBatchUserPresences(presencesMap));

          // Also update RTK Query caches for getConversations and getColleagues
          store.dispatch(
            connectApi.util.updateQueryData("getConversations", undefined, (draft) => {
              draft.forEach((conv) => {
                const pId = conv.participant?.id;
                if (pId && presencesMap[pId]) {
                  conv.participant.presence = presencesMap[pId];
                }
              });
            })
          );
          store.dispatch(
            connectApi.util.updateQueryData("getColleagues", undefined, (draft) => {
              if (Array.isArray(draft)) {
                draft.forEach((colleague) => {
                  if (colleague.id && presencesMap[colleague.id]) {
                    colleague.presence = presencesMap[colleague.id];
                  }
                });
              }
            })
          );
          break;
        }

        // Single User Presence Update
        const targetUserId = String(
          data.userId || data.user_id || data.id || data.employee_id || data.employeeId || ""
        ).trim();

        let targetStatus: PresenceStatus = "offline";
        if (eventType === "user:online" || eventType === "USER_ONLINE") {
          targetStatus = "online";
        } else if (eventType === "user:offline" || eventType === "USER_OFFLINE") {
          targetStatus = "offline";
        } else if (
          data.status &&
          ["online", "away", "busy", "dnd", "offline"].includes(String(data.status).toLowerCase())
        ) {
          targetStatus = String(data.status).toLowerCase() as PresenceStatus;
        } else if (
          data.presence &&
          ["online", "away", "busy", "dnd", "offline"].includes(String(data.presence).toLowerCase())
        ) {
          targetStatus = String(data.presence).toLowerCase() as PresenceStatus;
        } else if (data.isOnline === true || data.is_online === true || data.online === true) {
          targetStatus = "online";
        }

        if (targetUserId) {
          console.log(`[PRESENCE_RECEIVED] Real-time presence update: user ${targetUserId} -> ${targetStatus}`);
          store.dispatch(
            setUserPresence({
              userId: targetUserId,
              user_id: data.user_id,
              employeeId: data.employeeId || data.employee_id,
              employee_id: data.employee_id || data.employeeId,
              id: data.id || data._id,
              email: data.email,
              status: targetStatus,
            })
          );

          const candidateIds = new Set<string>(
            [
              targetUserId,
              data.user_id,
              data.userId,
              data.id,
              data._id,
              data.employee_id,
              data.employeeId,
            ]
              .filter(Boolean)
              .map((x) => String(x).trim())
          );
          const cleanTargetId = targetUserId.replace(/^conv_/, "").replace(/^usr_/, "");
          if (cleanTargetId) candidateIds.add(cleanTargetId);

          const candidateEmail = data.email ? String(data.email).trim().toLowerCase() : "";

          // Real-time cache updates in RTK Query
          store.dispatch(
            connectApi.util.updateQueryData("getConversations", undefined, (draft) => {
              draft.forEach((conv) => {
                const p = conv.participant;
                if (!p) return;
                const pId = String(p.id || "").trim();
                const pUserId = String(p.userId || "").trim();
                const pEmail = p.email ? p.email.trim().toLowerCase() : "";

                if (
                  candidateIds.has(pId) ||
                  candidateIds.has(pUserId) ||
                  (candidateEmail && pEmail && pEmail === candidateEmail)
                ) {
                  p.presence = targetStatus;
                }
              });
            })
          );

          store.dispatch(
            connectApi.util.updateQueryData("getColleagues", undefined, (draft) => {
              if (Array.isArray(draft)) {
                draft.forEach((colleague) => {
                  const cId = String(colleague.id || "").trim();
                  const cUserId = String(colleague.userId || "").trim();
                  const cEmail = colleague.email ? colleague.email.trim().toLowerCase() : "";

                  if (
                    candidateIds.has(cId) ||
                    candidateIds.has(cUserId) ||
                    (candidateEmail && cEmail && cEmail === candidateEmail)
                  ) {
                    colleague.presence = targetStatus;
                  }
                });
              }
            })
          );
        }
        break;
      }

      // 4. Calls
      case "call:start":
      case "call:incoming": {
        const currentUser = store.getState().auth.user;
        const callerId = String(data.caller_id || data.callerId || data.caller?.id || data.caller?.userId || data.caller?.user_id || "");
        const targetId = String(data.receiver_id || data.receiverId || data.targetUserId || data.target_user_id || data.calleeId || data.callee_id || "");
        const callId = String(data.call_id || data.callId || data.id || `call_${Date.now()}`);
        const callType: CallType = data.call_type || data.callType || data.type || "audio";

        // Don't process incoming event if sent by ourselves (Requirement #13 & #14)
        if (callerId && isCurrentUser(data.caller || callerId, currentUser)) {
          break;
        }

        const isForMe =
          isCurrentUser(targetId, currentUser) ||
          targetId === currentUserId ||
          (data.receiver_email && currentUser?.email && String(data.receiver_email).toLowerCase() === String(currentUser.email).toLowerCase());

        if (isForMe) {
          console.log(`[CALL] incoming received — from: ${data.caller?.name || callerId} (callId: ${callId}, type: ${callType})`);

          const currentCallState = store.getState().connectCall;
          // Duplicate event prevention (Requirement #15)
          if (currentCallState.incomingCall?.id === callId) {
            console.log(`[CALL] Duplicate call:incoming event ignored for callId: ${callId}`);
            break;
          }

          // Busy state detection
          if (currentCallState.activeCall || (currentCallState.incomingCall && currentCallState.incomingCall.id !== callId)) {
            console.log(`[CALL] User busy — rejecting call ${callId}`);
            connectWebSocketService.send("call:rejected", {
              type: "call:rejected",
              event: "call:rejected",
              callId,
              call_id: callId,
              callerId,
              caller_id: callerId,
              reason: "busy",
            });
            break;
          }

          const callerPayload = data.caller || {
            id: callerId,
            userId: callerId,
            name: data.caller_name || data.callerName || "Colleague",
            email: data.caller_email || data.callerEmail || "",
            avatar: data.caller_avatar || data.callerAvatar || "",
            role: data.caller_role || data.callerRole || "Colleague",
            department: data.caller_department || data.callerDepartment || "General",
          };

          store.dispatch(
            receiveIncomingCall({
              caller: callerPayload,
              type: callType,
              callId,
            })
          );
          connectAudioManager.playIncomingCall();

          if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted" && document.hidden) {
            try {
              new Notification(`Incoming ${callType === "video" ? "Video" : "Audio"} Call`, {
                body: `${callerPayload.name} is calling you on OFC360 Connect`,
                icon: "/logo.png",
                tag: `call_${callId}`,
              });
            } catch {}
          }
        }
        break;
      }

      case "call:accepted": {
        const callId = String(data.call_id || data.callId || "");
        console.log(`[CALL] accepted — callId: ${callId}`);
        connectAudioManager.stopOutgoingCall();
        connectAudioManager.playCallConnected();
        store.dispatch(setCallConnected({ callId }));
        break;
      }

      case "call:rejected": {
        const callId = String(data.call_id || data.callId || "");
        console.log(`[CALL] rejected — callId: ${callId} (reason: ${data.reason || "rejected"})`);
        connectAudioManager.stopOutgoingCall();
        connectAudioManager.stopIncomingCall();
        connectAudioManager.playCallRejected();
        store.dispatch(endCall());
        break;
      }

      case "call:cancel":
      case "call:cancelled": {
        const callId = String(data.call_id || data.callId || "");
        console.log(`[CALL] cancelled — callId: ${callId}`);
        connectAudioManager.stopOutgoingCall();
        connectAudioManager.stopIncomingCall();
        connectAudioManager.playCallEnded();
        store.dispatch(endCall());
        break;
      }

      case "call:ended": {
        const callId = String(data.call_id || data.callId || "");
        console.log(`[CALL] ended — callId: ${callId} (reason: ${data.reason || "ended"})`);
        connectAudioManager.stopOutgoingCall();
        connectAudioManager.stopIncomingCall();
        connectAudioManager.playCallEnded();
        store.dispatch(endCall());
        break;
      }

      case "webrtc:signal": {
        console.log(`[WEBRTC] signal received — type: ${data.signal?.type || data.type || "unknown"}`);
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
