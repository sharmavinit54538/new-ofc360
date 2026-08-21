export type PresenceStatus =
  | "online"
  | "idle"
  | "dnd"
  | "offline"
  | "in-meeting"
  | "in-call"
  | "away"
  | "busy"
  | (string & {});
