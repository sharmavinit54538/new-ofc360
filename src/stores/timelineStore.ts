import { create } from "zustand";
import type { TimelineEvent } from "@/utils/timelineEngine";
import { calculateWorkAnniversaries } from "@/utils/timelineEngine";

export const useTimelineStore = create<any>((set, get) => ({
  events: [], activeCategory: "ALL",
  setActiveCategory: (activeCategory: string) => set({ activeCategory }),
  addEvent: (e: TimelineEvent) => set((s: any) => ({ events: [e, ...s.events] })),
  setEvents: (events: TimelineEvent[]) => set({ events }),
  getEventsForEmployee: (empId: string, joiningDate: string, name: string) => {
    const anniversaries = calculateWorkAnniversaries(empId, name, joiningDate) || [];
    const localEvents = get().events.filter((ev: any) => ev.employeeId === empId);
    return [...anniversaries, ...localEvents].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
}));