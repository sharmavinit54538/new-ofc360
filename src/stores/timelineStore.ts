/**
 * OFC360 Employee Timeline Persistent Store
 * Manages career milestones, recognition awards, work anniversaries, project deliverables,
 * skill progression, and historical activity audit logs.
 */

import { create } from "zustand";
import { getStoredData, setStoredData } from "@/utils/storage";
import {
  type TimelineEvent,
  type TimelineCategory,
  calculateWorkAnniversaries,
} from "@/utils/timelineEngine";

interface TimelineState {
  events: TimelineEvent[];
  selectedCategory: "ALL" | TimelineCategory;
  searchQuery: string;

  // Actions
  addEvent: (event: Omit<TimelineEvent, "id">) => void;
  deleteEvent: (id: string) => void;
  setSelectedCategory: (category: "ALL" | TimelineCategory) => void;
  setSearchQuery: (query: string) => void;
  getEventsForEmployee: (employeeId: string, joiningDate?: string, employeeName?: string) => TimelineEvent[];
}

const STORAGE_KEY = "ofc360_employee_timeline_v2";

export const useTimelineStore = create<TimelineState>((set, get) => ({
  events: getStoredData<TimelineEvent[]>(STORAGE_KEY, []),
  selectedCategory: "ALL",
  searchQuery: "",


  addEvent: (newEvent) => {
    const event: TimelineEvent = {
      ...newEvent,
      id: `EV-MANUAL-${Date.now().toString().slice(-6)}`,
    };
    const updated = [event, ...get().events];
    setStoredData(STORAGE_KEY, updated);
    set({ events: updated });
  },

  deleteEvent: (id) => {
    const updated = get().events.filter((e) => e.id !== id);
    setStoredData(STORAGE_KEY, updated);
    set({ events: updated });
  },

  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  getEventsForEmployee: (employeeId, joiningDate, employeeName = "Employee") => {
    // Fetch manual/stored events for employee
    const stored = get().events.filter((e) => e.employeeId === employeeId || e.employeeId === "EMP-101");
    
    // Compute dynamic work anniversary events from joining date
    const anniversaries = joiningDate
      ? calculateWorkAnniversaries(employeeId, employeeName, joiningDate)
      : [];

    // Merge and remove duplicates by ID
    const mergedMap = new Map<string, TimelineEvent>();
    [...anniversaries, ...stored].forEach((e) => {
      mergedMap.set(e.id, e);
    });

    const allEvents = Array.from(mergedMap.values());

    // Sort chronologically (newest first)
    return allEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
}));
