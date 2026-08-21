export type ConnectAudioEventType =
  | "incoming_call" | "outgoing_call" | "message" | "mention" | "group_message" | "channel_message"
  | "call_connecting" | "call_connected" | "call_rejected" | "call_failed" | "call_ended"
  | "busy" | "participant_joined" | "participant_left" | "meeting_start" | "meeting_end"
  | "screen_share_start" | "screen_share_stop" | "notification";

export interface PlaySoundOptions {
  eventId?: string; conversationId?: string; isMention?: boolean; isGroup?: boolean; isChannel?: boolean; force?: boolean;
}

export const SOUND_PRIORITIES: Record<ConnectAudioEventType, number> = {
  incoming_call: 1, outgoing_call: 2, call_connecting: 2, call_connected: 2, call_rejected: 2, call_failed: 2, call_ended: 2, busy: 2,
  mention: 3, message: 4, group_message: 5, channel_message: 5, notification: 6,
  meeting_start: 7, meeting_end: 7, screen_share_start: 7, screen_share_stop: 7, participant_joined: 8, participant_left: 8,
};
