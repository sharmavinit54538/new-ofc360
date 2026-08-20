import { describe, it, expect, beforeEach } from "vitest";
import {
  timeStringToMinutes,
  minutesToTimeString,
  calculateDurationMinutes,
  evaluateArrivalStatus,
  evaluateDepartureStatus,
  computeNetWorkHours,
  determineAttendanceStatus,
  type ShiftTiming,
} from "../utils/attendanceCalculations";
import { useAttendanceStore } from "../stores/attendanceStore";

describe("OFC360 Attendance & Shift Calculation Engine", () => {
  describe("Time Conversion & Formatting", () => {
    it("converts 24-hour time strings to minutes correctly", () => {
      expect(timeStringToMinutes("00:00")).toBe(0);
      expect(timeStringToMinutes("09:00")).toBe(540);
      expect(timeStringToMinutes("09:15")).toBe(555);
      expect(timeStringToMinutes("18:00")).toBe(1080);
      expect(timeStringToMinutes("23:59")).toBe(1439);
    });

    it("converts minutes to formatted 24-hour time string", () => {
      expect(minutesToTimeString(0)).toBe("00:00");
      expect(minutesToTimeString(540)).toBe("09:00");
      expect(minutesToTimeString(555)).toBe("09:15");
      expect(minutesToTimeString(1080)).toBe("18:00");
    });
  });

  describe("Shift Duration & Overnight Cross-Midnight Handling", () => {
    it("calculates normal daytime shift duration", () => {
      const durationMins = calculateDurationMinutes("09:00", "18:00");
      expect(durationMins).toBe(540); // 9 hours
    });

    it("accurately calculates overnight / cross-midnight shift duration (21:00 to 06:00)", () => {
      const durationMins = calculateDurationMinutes("21:00", "06:00");
      expect(durationMins).toBe(540); // 9 hours (3h before midnight + 6h after midnight)
    });

    it("handles early morning shift (06:00 to 15:00)", () => {
      const durationMins = calculateDurationMinutes("06:00", "15:00");
      expect(durationMins).toBe(540); // 9 hours
    });
  });

  describe("Grace Period & Arrival Evaluation", () => {
    const shiftStart = "09:00";
    const graceMins = 15;

    it("identifies punctual arrival (09:00) as On Time", () => {
      const result = evaluateArrivalStatus("09:00", shiftStart, graceMins);
      expect(result.isLate).toBe(false);
      expect(result.lateMinutes).toBe(0);
      expect(result.graceBoundaryTimeStr).toBe("09:15");
    });

    it("identifies arrival within grace period (09:10) as On Time", () => {
      const result = evaluateArrivalStatus("09:10", shiftStart, graceMins);
      expect(result.isLate).toBe(false);
      expect(result.lateMinutes).toBe(0);
    });

    it("identifies exact grace boundary arrival (09:15) as On Time", () => {
      const result = evaluateArrivalStatus("09:15", shiftStart, graceMins);
      expect(result.isLate).toBe(false);
      expect(result.lateMinutes).toBe(0);
    });

    it("identifies post-grace boundary arrival (09:16) as Late with 16 late minutes", () => {
      const result = evaluateArrivalStatus("09:16", shiftStart, graceMins);
      expect(result.isLate).toBe(true);
      expect(result.lateMinutes).toBe(16);
    });

    it("calculates substantial late arrival (10:30) with 90 late minutes", () => {
      const result = evaluateArrivalStatus("10:30", shiftStart, graceMins);
      expect(result.isLate).toBe(true);
      expect(result.lateMinutes).toBe(90);
    });
  });

  describe("Break Management & Net Working Hours", () => {
    it("deducts break duration from gross working minutes", () => {
      const grossMinutes = 540; // 9 hours
      const breakMinutes = 45;  // 45 mins
      const net = computeNetWorkHours(grossMinutes, breakMinutes);

      expect(net.netMinutes).toBe(495); // 8h 15m
      expect(net.netHoursDecimal).toBe(8.25);
      expect(net.formattedNetDuration).toBe("08h 15m");
    });

    it("handles zero break correctly", () => {
      const grossMinutes = 480; // 8 hours
      const net = computeNetWorkHours(grossMinutes, 0);

      expect(net.netMinutes).toBe(480);
      expect(net.netHoursDecimal).toBe(8.0);
      expect(net.formattedNetDuration).toBe("08h 00m");
    });
  });

  describe("Attendance Status Engine", () => {
    const shift: ShiftTiming = {
      startTime: "09:00",
      endTime: "18:00",
      gracePeriodMins: 15,
      halfDayHours: 4.5,
      fullDayHours: 8.0,
      breakDurationMins: 45,
    };

    it("returns 'On Leave' when leave is approved", () => {
      const status = determineAttendanceStatus({
        shift,
        isOnLeave: true,
      });
      expect(status).toBe("On Leave");
    });

    it("returns 'Holiday' when date is a corporate holiday", () => {
      const status = determineAttendanceStatus({
        shift,
        isHoliday: true,
      });
      expect(status).toBe("Holiday");
    });

    it("returns 'Half Day' when net worked is less than halfDay threshold", () => {
      const status = determineAttendanceStatus({
        checkInTimeStr: "09:00",
        checkOutTimeStr: "13:00", // 4 hours gross
        shift,
        breakDurationMinutes: 30, // 3.5h net < 4.5h
      });
      expect(status).toBe("Half Day");
    });

    it("returns 'Overtime' when net worked exceeds full day threshold + overtime margin", () => {
      const status = determineAttendanceStatus({
        checkInTimeStr: "09:00",
        checkOutTimeStr: "19:30", // 10.5 hours gross
        shift,
        breakDurationMinutes: 45, // 9.75h net > 8.5h
      });
      expect(status).toBe("Overtime");
    });

    it("returns 'Regularized' when punch has been approved via regularization", () => {
      const status = determineAttendanceStatus({
        shift,
        isRegularized: true,
      });
      expect(status).toBe("Regularized");
    });
  });
});

describe("Attendance Store & Regularization Synchronization", () => {
  beforeEach(() => {
    const store = useAttendanceStore.getState();
    // Clean up store state before each test
    store.punches.forEach((p) => store.deletePunch(p.id));
  });

  it("prevents consecutive duplicate check-ins on the same day", () => {
    const store = useAttendanceStore.getState();
    const today = new Date().toISOString().split("T")[0];

    const first = store.addPunch({
      employeeId: "EMP-TEST-01",
      employeeName: "John Doe",
      department: "Engineering",
      timestamp: "09:00 AM",
      date: today,
      type: "Check-In",
      method: "Selfie Camera",
      location: "Office HQ",
      status: "On Time",
    });
    expect(first.success).toBe(true);

    const second = store.addPunch({
      employeeId: "EMP-TEST-01",
      employeeName: "John Doe",
      department: "Engineering",
      timestamp: "09:05 AM",
      date: today,
      type: "Check-In",
      method: "Selfie Camera",
      location: "Office HQ",
      status: "On Time",
    });
    expect(second.success).toBe(false);
    expect(second.message).toContain("already recorded");
  });

  it("automatically creates a regularized punch record when regularization is approved", () => {
    const store = useAttendanceStore.getState();
    const testDate = "2026-08-10";

    // 1. Submit regularization request
    store.addRegularization({
      employeeId: "EMP-TEST-02",
      employeeName: "Sarah Jenkins",
      department: "Design",
      date: testDate,
      missedPunchType: "Check-In",
      requestedTime: "09:10 AM",
      reason: "Biometric kiosk reader maintenance",
      status: "Pending",
    });

    const pendingReq = useAttendanceStore.getState().regularizations[0];
    expect(pendingReq).toBeDefined();
    expect(pendingReq.status).toBe("Pending");

    // 2. Manager approves the request
    useAttendanceStore.getState().updateRegularizationStatus(
      pendingReq.id,
      "Approved",
      "Vinit Sharma (Manager)",
      "Approved after verifying system logs"
    );

    const updatedReq = useAttendanceStore.getState().regularizations.find((r) => r.id === pendingReq.id);
    expect(updatedReq?.status).toBe("Approved");
    expect(updatedReq?.approverName).toBe("Vinit Sharma (Manager)");

    // 3. Verify that the punch record was automatically inserted in punches state
    const createdPunch = useAttendanceStore.getState().punches.find(
      (p) => p.employeeId === "EMP-TEST-02" && p.date === testDate
    );
    expect(createdPunch).toBeDefined();
    expect(createdPunch?.status).toBe("Regularized");
    expect(createdPunch?.regularized).toBe(true);
    expect(createdPunch?.timestamp).toBe("09:10 AM");
  });

  it("preserves regularization request without modifying punch state when rejected", () => {
    const store = useAttendanceStore.getState();
    const testDate = "2026-08-09";

    store.addRegularization({
      employeeId: "EMP-TEST-03",
      employeeName: "Mike Taylor",
      department: "Marketing",
      date: testDate,
      missedPunchType: "Check-Out",
      requestedTime: "06:00 PM",
      reason: "Left without punching",
      status: "Pending",
    });

    const pendingReq = useAttendanceStore.getState().regularizations[0];

    useAttendanceStore.getState().updateRegularizationStatus(
      pendingReq.id,
      "Rejected",
      "HR Compliance",
      "No corroborating access card records"
    );

    const updatedReq = useAttendanceStore.getState().regularizations.find((r) => r.id === pendingReq.id);
    expect(updatedReq?.status).toBe("Rejected");

    const punch = useAttendanceStore.getState().punches.find(
      (p) => p.employeeId === "EMP-TEST-03" && p.date === testDate
    );
    expect(punch).toBeUndefined();
  });
});
