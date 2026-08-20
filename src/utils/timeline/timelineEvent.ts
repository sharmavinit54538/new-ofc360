import type { TimelineCategory, TimelineEventDetails } from "./types";

export interface TimelineEvent {
  id: string;
  employeeId: string;
  employeeName: string;
  category: TimelineCategory;
  title: string;
  date: string;
  badge?: string;
  description: string;
  details?: TimelineEventDetails;
}
