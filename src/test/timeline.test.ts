import { describe, it, expect, beforeEach } from "vitest";
import { calculateWorkAnniversaries } from "../utils/timelineEngine";
import { useTimelineStore } from "../stores/timelineStore";

describe("OFC360 Employee Timeline System", () => {
  describe("Dynamic Work Anniversary Calculation Engine", () => {
    it("calculates joining event and correct work anniversary milestones from joining date", () => {
      // Employee joined 3.5 years ago
      const joiningDate = "2022-01-15";
      const events = calculateWorkAnniversaries("EMP-101", "Alex Mercer", joiningDate);

      expect(events.length).toBeGreaterThanOrEqual(4); // Day 1 + 1Yr + 2Yr + 3Yr
      expect(events[0].title).toBe("Joined Company");
      expect(events[1].title).toBe("1 Year Work Anniversary");
      expect(events[2].title).toBe("2 Year Work Anniversary");
      expect(events[3].title).toBe("3 Year Work Anniversary");
    });

    it("returns empty list for invalid or future joining date", () => {
      const events = calculateWorkAnniversaries("EMP-999", "Future Employee", "2030-01-01");
      expect(events.length).toBe(0);
    });
  });

  describe("Timeline Store & Master Timeline Aggregator", () => {
    it("retrieves combined chronological timeline events for employee", () => {
      const events = useTimelineStore.getState().getEventsForEmployee("EMP-101", "2024-01-10", "Alex Mercer");

      expect(events.length).toBeGreaterThan(0);
      expect(events[0].employeeName).toBeTruthy();

      // Check chronological sorting (newest first)
      for (let i = 0; i < events.length - 1; i++) {
        const d1 = new Date(events[i].date).getTime();
        const d2 = new Date(events[i + 1].date).getTime();
        expect(d1).toBeGreaterThanOrEqual(d2);
      }
    });

    it("records a new kudos recognition event and persists to store", () => {
      const initialCount = useTimelineStore.getState().events.length;

      useTimelineStore.getState().addEvent({
        employeeId: "EMP-101",
        employeeName: "Alex Mercer",
        category: "Recognition",
        title: "Peer Excellence Award",
        date: "2026-08-12",
        badge: "Spot Award",
        description: "Recognized for exceptional cross-team collaboration.",
        details: {
          givenBy: "Vinit Sharma",
        },
      });

      const updatedCount = useTimelineStore.getState().events.length;
      expect(updatedCount).toBe(initialCount + 1);
    });
  });
});
