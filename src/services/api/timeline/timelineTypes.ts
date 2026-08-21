export interface TimelineEvent {
  id: string;
  employeeId: string;
  type: "promotion" | "award" | "project" | "skill" | "anniversary" | "role_change" | "certification";
  title: string;
  description: string;
  date: string;
  category: string;
  metadata?: Record<string, unknown>;
}

export interface AddTimelineEventInput {
  employeeId: string;
  type: TimelineEvent["type"];
  title: string;
  description: string;
  date?: string;
  category?: string;
  metadata?: Record<string, unknown>;
}
