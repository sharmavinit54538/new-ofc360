export interface BatchPresenceRequest {
  userIds: string[];
}

export interface BatchPresenceResponse {
  presences: Record<string, { presence: string; lastSeen?: string; customStatus?: string }>;
}

export interface AITransformRequest {
  text: string;
  mode: "summarize" | "professional" | "concise" | "action_items" | "translate";
  targetLanguage?: string;
}

export interface AITransformResponse {
  transformedText: string;
  mode: string;
  keyPoints?: string[];
}
