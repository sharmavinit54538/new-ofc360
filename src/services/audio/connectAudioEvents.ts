import { store } from "@/app/store";

const processedEvents = new Set<string>();

export function checkAndLogEvent(eventId?: string, type = "message"): boolean {
  const s = store.getState().connectSound;
  if (!s.isMasterEnabled || s.isMutedAll) { console.log(`[NOTIFICATION_AUDIO] Sound suppressed for ${type}: Master sound disabled or muted.`); return false; }
  if (type === "message" && !s.isMessagesEnabled) return false;
  if (type === "incoming_call" && !s.isIncomingCallsEnabled) return false;
  if (eventId) {
    if (processedEvents.has(eventId)) { console.log(`[NOTIFICATION_EVENT] Dropping duplicate event ID: ${eventId}`); return false; }
    processedEvents.add(eventId);
    if (processedEvents.size > 100) { const first = processedEvents.values().next().value; if (first) processedEvents.delete(first); }
  }
  return true;
}
