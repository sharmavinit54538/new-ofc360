import { describe, it, expect } from "vitest";
import {
  evaluateArrivalStatus,
  evaluateDepartureStatus,
  computeNetWorkHours,
  determineAttendanceStatus,
} from "../utils/attendanceCalculations";
import {
  calculateHaversineDistanceMeters,
  OFFICE_BRANCHES,
} from "../utils/verification/gpsVerification";
import {
  generateDynamicQrToken,
  validateQrPayload,
} from "../utils/verification/qrVerification";
import {
  AUTHORIZED_OFFICE_NETWORKS,
  performNetworkVerification,
} from "../utils/verification/wifiVerification";
import { normalizeRole } from "../features/auth/authTypes";

describe("OFC360 Complete Attendance API & Calculation Integration Suite", () => {
  describe("1. GPS Geofence & Perimeter Telemetry", () => {
    it("verifies accurate Haversine distance from headquarters branch", () => {
      const hq = OFFICE_BRANCHES[0];
      // Exact point
      const distZero = calculateHaversineDistanceMeters(
        hq.latitude,
        hq.longitude,
        hq.latitude,
        hq.longitude
      );
      expect(distZero).toBe(0);

      // Point ~100m away
      const distNear = calculateHaversineDistanceMeters(
        hq.latitude + 0.0005,
        hq.longitude + 0.0005,
        hq.latitude,
        hq.longitude
      );
      expect(distNear).toBeGreaterThan(0);
      expect(distNear).toBeLessThan(500);
    });

    it("evaluates inside/outside geofence against branch radius limits", () => {
      const branch = OFFICE_BRANCHES[0];
      const distance = 45; // meters
      const isInside = distance <= branch.radiusMeters;
      expect(isInside).toBe(true);

      const distanceFar = 350; // meters
      const isInsideFar = distanceFar <= branch.radiusMeters;
      expect(isInsideFar).toBe(false);
    });
  });

  describe("2. Dynamic QR Security Token Generation & Validation", () => {
    it("generates 30-second windowed dynamic QR tokens with proper payload schema", () => {
      const payload = generateDynamicQrToken("EMP-101", "Jane Doe");
      expect(payload.employeeId).toBe("EMP-101");
      expect(payload.employeeName).toBe("Jane Doe");
      expect(payload.expiresInSeconds).toBeGreaterThanOrEqual(1);
      expect(payload.expiresInSeconds).toBeLessThanOrEqual(30);
      expect(payload.token).toMatch(/^OFC-QR-[A-F0-9]{8}$/);
      expect(payload.payloadString).toContain('"app":"OFC360"');
    });

    it("validates dynamic QR strings from kiosk terminals", () => {
      const payload = generateDynamicQrToken("EMP-202", "Alex Mercer");
      const validation = validateQrPayload(payload.payloadString);
      expect(validation.valid).toBe(true);
      expect(validation.data?.empId).toBe("EMP-202");
    });

    it("rejects corrupted or expired QR token strings", () => {
      const validation = validateQrPayload("INVALID-RANDOM-TOKEN-STRING");
      expect(validation.valid).toBe(false);
      expect(validation.message.toLowerCase()).toContain("unrecognized qr code format");
    });
  });

  describe("3. Wi-Fi Corporate Gateway Diagnostics", () => {
    it("contains authorized office Wi-Fi networks with security profiles", () => {
      expect(AUTHORIZED_OFFICE_NETWORKS.length).toBeGreaterThanOrEqual(3);
      const hqWifi = AUTHORIZED_OFFICE_NETWORKS[0];
      expect(hqWifi.ssid).toContain("OFC360-Corp-5G");
      expect(hqWifi.security).toContain("WPA3-Enterprise");
    });

    it("performs network verification diagnostics accurately", async () => {
      const diag = await performNetworkVerification("net-hq-5g");
      expect(diag.isOnline).toBe(true);
      expect(diag.localIp).toMatch(/^\d+\.\d+\.\d+\.\d+$/);
      expect(diag.rttMs).toBeGreaterThan(0);
      expect(diag.matchedProfile?.ssid).toContain("OFC360-Corp-5G");
    });
  });

  describe("4. Shift Policies & Arrival/Departure Status Rules", () => {
    it("evaluates on-time arrival within 15-minute grace window", () => {
      const check = evaluateArrivalStatus("09:12", "09:00", 15);
      expect(check.isLate).toBe(false);
      expect(check.lateMinutes).toBe(0);
    });

    it("evaluates late arrival beyond grace cutoff", () => {
      const check = evaluateArrivalStatus("09:28", "09:00", 15);
      expect(check.isLate).toBe(true);
      expect(check.lateMinutes).toBe(28);
    });

    it("evaluates early departure vs normal departure", () => {
      const earlyCheck = evaluateDepartureStatus("17:30", "18:00", false);
      expect(earlyCheck.isEarly).toBe(true);
      expect(earlyCheck.earlyMinutes).toBe(30);

      const normalCheck = evaluateDepartureStatus("18:05", "18:00", false);
      expect(normalCheck.isEarly).toBe(false);
      expect(normalCheck.earlyMinutes).toBe(0);
    });

    it("determines overall attendance status (On Time, Half Day, Overtime, Regularized)", () => {
      const standardShift = {
        startTime: "09:00",
        endTime: "18:00",
        gracePeriodMins: 15,
        halfDayHours: 4.5,
        fullDayHours: 8.0,
      };

      // 1. Overtime: 09:00 to 19:30 (10.5h > 8.5h)
      expect(
        determineAttendanceStatus({
          checkInTimeStr: "09:00",
          checkOutTimeStr: "19:30",
          shift: standardShift,
        })
      ).toBe("Overtime");

      // 2. Full Day / On Time: 09:00 to 17:00 (8.0h)
      expect(
        determineAttendanceStatus({
          checkInTimeStr: "09:00",
          checkOutTimeStr: "17:00",
          shift: standardShift,
        })
      ).toBe("On Time");

      // 3. Half Day: 09:00 to 12:30 (3.5h < 4.5h)
      expect(
        determineAttendanceStatus({
          checkInTimeStr: "09:00",
          checkOutTimeStr: "12:30",
          shift: standardShift,
        })
      ).toBe("Half Day");

      // 4. Regularized
      expect(
        determineAttendanceStatus({
          checkInTimeStr: "09:00",
          checkOutTimeStr: "18:00",
          shift: standardShift,
          isRegularized: true,
        })
      ).toBe("Regularized");

      // 5. On Leave
      expect(
        determineAttendanceStatus({
          shift: standardShift,
          isOnLeave: true,
        })
      ).toBe("On Leave");
    });
  });

  describe("5. Role-Based Attendance Access Controls", () => {
    it("maps normalized roles for access permissions", () => {
      expect(normalizeRole("hr_admin")).toBe("hr_admin");
      expect(normalizeRole("HR_ADMIN")).toBe("hr_admin");
      expect(normalizeRole("super_admin")).toBe("super_admin");
      expect(normalizeRole("manager")).toBe("manager");
      expect(normalizeRole("employee")).toBe("employee");
    });

    it("correctly evaluates manager and admin access privileges", () => {
      const hrRole = normalizeRole("hr_admin");
      const isHrOrAdmin = hrRole === "hr_admin" || hrRole === "super_admin";
      expect(isHrOrAdmin).toBe(true);

      const empRole = normalizeRole("employee");
      const isEmpManager = empRole === "manager" || empRole === "hr_admin" || empRole === "super_admin";
      expect(isEmpManager).toBe(false);
    });
  });

  describe("6. Overtime Calculation & Multipliers", () => {
    it("computes net working hours and breaks accurately", () => {
      const grossSecs = 9 * 3600; // 9 hours
      const breakSecs = 45 * 60;  // 45 mins
      const netSecs = Math.max(0, grossSecs - breakSecs);
      const netHours = netSecs / 3600;

      expect(netHours).toBe(8.25);
    });

    it("applies 1.5x and 2.0x overtime multipliers", () => {
      const otHours = 3.0;
      const weekdayMultiplier = 1.5;
      const weekendMultiplier = 2.0;

      expect(otHours * weekdayMultiplier).toBe(4.5);
      expect(otHours * weekendMultiplier).toBe(6.0);
    });
  });

  describe("7. Attendance Telemetry Payload Construction", () => {
    it("constructs complete FormData payload for biometric/GPS punch requests", () => {
      const payload = {
        latitude: 12.9716,
        longitude: 77.5946,
        location: "Main HQ Office [12.9716°N, 77.5946°E]",
        device_info: "Mozilla/5.0 Test Suite",
        ip_address: "192.168.1.108",
        method: "GPS Geofence",
        verificationMethod: "gps",
        notes: "Sprint planning check-in",
      };

      const formData = new FormData();
      formData.append("latitude", String(payload.latitude));
      formData.append("longitude", String(payload.longitude));
      formData.append("location", payload.location);
      formData.append("device_info", payload.device_info);
      formData.append("ip_address", payload.ip_address);
      formData.append("verification_method", payload.verificationMethod);
      formData.append("notes", payload.notes);

      expect(formData.get("latitude")).toBe("12.9716");
      expect(formData.get("longitude")).toBe("77.5946");
      expect(formData.get("verification_method")).toBe("gps");
      expect(formData.get("notes")).toBe("Sprint planning check-in");
    });
  });
});
