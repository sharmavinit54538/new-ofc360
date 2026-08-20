import { create } from "zustand";
import type { TimelineEvent } from "@/utils/timelineEngine";

export const useTimelineStore = create<{
  events: TimelineEvent[]; activeCategory: string;
  setActiveCategory: (c: string) => void; addEvent: (e: TimelineEvent) => void;
  setEvents: (e: TimelineEvent[]) => void;
}>((set) => ({
  events: [], activeCategory: "ALL",
  setActiveCategory: (activeCategory) => set({ activeCategory }),
  addEvent: (e) => set((s) => ({ events: [e, ...s.events] })),
  setEvents: (events) => set({ events }),
}));