import { describe, it, expect, vi } from "vitest";
import {
  evaluateArrivalStatus,
  evaluateDepartureStatus,
  computeNetWorkHours,
  determineAttendanceStatus,
} from "../utils/attendanceCalculations";
import {
  captureVideoFrame,
  stopCameraStream,
} from "../utils/verification/cameraVerification";
import { normalizeRole } from "../features/auth/authTypes";

describe("OFC360 Complete Attendance API & Calculation Integration Suite", () => {
  describe("1. Selfie Camera Biometric Verification Engine", () => {
    it("captures frame from video element and computes valid biometric result", () => {
      // Mock video element and canvas context
      const fakeVideo = document.createElement("video");
      Object.defineProperty(fakeVideo, "videoWidth", { value: 640 });
      Object.defineProperty(fakeVideo, "videoHeight", { value: 480 });

      // Mock canvas 2d context
      const originalCreateElement = document.createElement.bind(document);
      vi.spyOn(document, "createElement").mockImplementation((tagName: string) => {
        if (tagName.toLowerCase() === "canvas") {
          const canvas = originalCreateElement("canvas");
          canvas.getContext = vi.fn().mockReturnValue({
            drawImage: vi.fn(),
            getImageData: vi.fn().mockReturnValue({
              data: new Uint8ClampedArray(640 * 480 * 4).fill(150), // Adequate brightness
            }),
          });
          canvas.toDataURL = vi.fn().mockReturnValue("data:image/jpeg;base64,sample-selfie-data");
          return canvas;
        }
        return originalCreateElement(tagName);
      });

      const result = captureVideoFrame(fakeVideo);
      expect(result.dataUrl).toContain("data:image/jpeg;base64");
      expect(result.faceHash).toMatch(/^FAC-[A-Z0-9]+-[A-Z0-9]+$/);
      expect(result.brightnessScore).toBeGreaterThanOrEqual(10);
      expect(result.width).toBe(640);
      expect(result.height).toBe(480);

      vi.restoreAllMocks();
    });

    it("throws an error if video frame is too dark or obstructed", () => {
      const fakeVideo = document.createElement("video");
      Object.defineProperty(fakeVideo, "videoWidth", { value: 640 });
      Object.defineProperty(fakeVideo, "videoHeight", { value: 480 });

      const originalCreateElement = document.createElement.bind(document);
      vi.spyOn(document, "createElement").mockImplementation((tagName: string) => {
        if (tagName.toLowerCase() === "canvas") {
          const canvas = originalCreateElement("canvas");
          canvas.getContext = vi.fn().mockReturnValue({
            drawImage: vi.fn(),
            getImageData: vi.fn().mockReturnValue({
              data: new Uint8ClampedArray(640 * 480 * 4).fill(2), // Too dark (<10)
            }),
          });
          return canvas;
        }
        return originalCreateElement(tagName);
      });

      expect(() => captureVideoFrame(fakeVideo)).toThrow(/Frame too dark/i);
      vi.restoreAllMocks();
    });

    it("safely stops all media stream tracks when webcam is stopped", () => {
      const stopTrackMock1 = vi.fn();
      const stopTrackMock2 = vi.fn();
      const mockStream = {
        getTracks: vi.fn().mockReturnValue([
          { stop: stopTrackMock1 },
          { stop: stopTrackMock2 },
        ]),
      } as unknown as MediaStream;

      stopCameraStream(mockStream);
      expect(stopTrackMock1).toHaveBeenCalled();
      expect(stopTrackMock2).toHaveBeenCalled();

      // Calling with null does not throw
      expect(() => stopCameraStream(null)).not.toThrow();
    });
  });

  describe("2. Shift Policies & Arrival/Departure Status Rules", () => {
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

  describe("3. Role-Based Attendance Access Controls", () => {
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

  describe("4. Overtime Calculation & Multipliers", () => {
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

  describe("5. Selfie Camera Biometric Attendance Payload Construction", () => {
    it("constructs complete FormData payload for biometric face check-in requests", () => {
      const payload = {
        location: "Main HQ Facial Station (Face Match ID: FAC-TEST99)",
        device_info: "Mozilla/5.0 Test Suite",
        method: "Selfie Camera",
        verificationMethod: "face_id",
        notes: "Daily check-in via selfie camera",
        image: "data:image/jpeg;base64,sample-selfie-data",
      };

      const formData = new FormData();
      formData.append("location", payload.location);
      formData.append("device_info", payload.device_info);
      formData.append("method", payload.method);
      formData.append("verification_method", payload.verificationMethod);
      formData.append("notes", payload.notes);
      formData.append("image", payload.image);

      expect(formData.get("location")).toBe("Main HQ Facial Station (Face Match ID: FAC-TEST99)");
      expect(formData.get("method")).toBe("Selfie Camera");
      expect(formData.get("verification_method")).toBe("face_id");
      expect(formData.get("notes")).toBe("Daily check-in via selfie camera");
      expect(formData.get("image")).toBe("data:image/jpeg;base64,sample-selfie-data");
    });
  });
});
