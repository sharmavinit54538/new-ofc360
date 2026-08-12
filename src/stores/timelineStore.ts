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

const INITIAL_TIMELINE_EVENTS: TimelineEvent[] = [
  // CAREER MILESTONES
  {
    id: "EV-CAREER-101",
    employeeId: "EMP-101",
    employeeName: "Alex Mercer",
    category: "Career",
    title: "Promoted to Senior Fullstack Lead Engineer",
    date: "2025-06-01",
    badge: "Promotion",
    description: "Promoted in recognition of stellar technical leadership in micro-frontend architecture and core AI integration.",
    details: {
      previousRole: "Software Engineer",
      newRole: "Senior Fullstack Lead Engineer",
      previousDepartment: "Engineering",
      newDepartment: "Engineering",
      actor: "Vinit Sharma (VP Engineering)"
    }
  },
  {
    id: "EV-CAREER-102",
    employeeId: "EMP-102",
    employeeName: "Sarah Jenkins",
    category: "Career",
    title: "Promoted to Principal Product Designer",
    date: "2025-04-15",
    badge: "Promotion",
    description: "Elevated to Principal Designer to oversee OFC360 enterprise design systems and accessibility compliance.",
    details: {
      previousRole: "Senior Product Designer",
      newRole: "Principal Product Designer",
      previousDepartment: "Product Design",
      newDepartment: "Product Design",
      actor: "Banoth Siddarth (Chief Design Officer)"
    }
  },

  // RECOGNITION & KUDOS
  {
    id: "EV-KUDOS-101",
    employeeId: "EMP-101",
    employeeName: "Alex Mercer",
    category: "Recognition",
    title: "Quarterly Engineering Star Award",
    date: "2025-09-30",
    badge: "Spot Award",
    description: "Awarded for zero-downtime deployment of the AI Neural Router and attendance verification engine.",
    details: {
      givenBy: "Vinit Sharma",
      awardType: "Spot Honor",
      impact: "Reduced system latency by 38% across 45,000+ daily active users."
    }
  },
  {
    id: "EV-KUDOS-102",
    employeeId: "EMP-102",
    employeeName: "Sarah Jenkins",
    category: "Recognition",
    title: "Design Excellence Peer Kudos",
    date: "2025-11-12",
    badge: "Peer Kudos",
    description: "Recognized by cross-functional team for designing sleek WCAG 2.1 AA accessible UI components.",
    details: {
      givenBy: "Engineering Team",
      awardType: "Kudos Badge"
    }
  },

  // PROJECT ACHIEVEMENTS
  {
    id: "EV-PROJ-101",
    employeeId: "EMP-101",
    employeeName: "Alex Mercer",
    category: "Projects",
    title: "OFC360 Enterprise HRMS V2 Launch",
    date: "2026-01-15",
    badge: "Product Launch",
    description: "Successfully delivered major V2 release featuring real-time attendance verification, statutory payroll calculations, and 73 AI models.",
    details: {
      projectName: "OFC360 Enterprise Platform",
      impact: "Delivered 100% on-time with zero critical launch bugs."
    }
  },

  // SKILL GROWTH LOG
  {
    id: "EV-SKILL-101",
    employeeId: "EMP-101",
    employeeName: "Alex Mercer",
    category: "Skills",
    title: "AWS Certified Solutions Architect - Associate",
    date: "2025-08-20",
    badge: "Certification",
    description: "Achieved official AWS cloud architectural certification.",
    details: {
      skillName: "AWS Cloud Infrastructure",
      previousLevel: "Intermediate",
      newLevel: "Certified Architect",
      source: "Amazon Web Services Training"
    }
  },
  {
    id: "EV-SKILL-102",
    employeeId: "EMP-102",
    employeeName: "Sarah Jenkins",
    category: "Skills",
    title: "Advanced Figma Token Architecture Certification",
    date: "2025-07-10",
    badge: "Skill Level-Up",
    description: "Mastered multi-brand design tokens and variable themes.",
    details: {
      skillName: "Design Systems",
      previousLevel: "Proficient",
      newLevel: "Design System Lead",
      source: "Figma Academy"
    }
  },

  // ACTIVITY AUDIT HISTORY
  {
    id: "EV-AUDIT-101",
    employeeId: "EMP-101",
    employeeName: "Alex Mercer",
    category: "Audit",
    title: "Annual Performance Appraisal Completed",
    date: "2025-12-20",
    badge: "Audit Event",
    description: "Annual 360-degree performance evaluation finalized by HR Management.",
    details: {
      actor: "HR Super Admin",
      impact: "Rated Exceeds Expectations (4.9 / 5.0)"
    }
  }
];

export const useTimelineStore = create<TimelineState>((set, get) => ({
  events: getStoredData<TimelineEvent[]>(STORAGE_KEY, INITIAL_TIMELINE_EVENTS),
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
