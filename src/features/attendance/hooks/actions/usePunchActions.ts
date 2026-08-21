import { toast } from "sonner";
import { evaluateArrivalStatus } from "@/utils/attendanceCalculations";
import { formatSecs } from "../../utils/attendance.utils";
import type {
  CameraCaptureResult,
  PunchRecord,
  ShiftTemplate,
} from "../../types/attendance.types";

interface UsePunchActionsProps {
  user: { id?: string; name?: string } | null | undefined;
  shifts: ShiftTemplate[];
  currentTime: Date;
  isClockedIn: boolean;
  isOnBreak: boolean;
  workSeconds: number;
  breakSeconds: number;
  taskNotes: string;
  capturedSelfie: CameraCaptureResult | null;
  setIsClockedIn: (val: boolean) => void;
  setIsOnBreak: (val: boolean) => void;
  setTaskNotes: (val: string) => void;
  addPunch: (punch: Omit<PunchRecord, "id"> | PunchRecord) => void;
  faceCheckIn: (args: Record<string, unknown>) => { unwrap: () => Promise<unknown> };
  faceCheckOut: (args: Record<string, unknown>) => { unwrap: () => Promise<unknown> };
  refetchFeeds: () => void;
}

export function usePunchActions({
  user,
  shifts,
  currentTime,
  isClockedIn,
  isOnBreak,
  workSeconds,
  breakSeconds,
  taskNotes,
  capturedSelfie,
  setIsClockedIn,
  setIsOnBreak,
  setTaskNotes,
  addPunch,
  faceCheckIn,
  faceCheckOut,
  refetchFeeds,
}: UsePunchActionsProps) {
  const punchMethod: PunchRecord["method"] = "Selfie Camera";

  const handleCheckIn = async () => {
    if (!capturedSelfie) {
      toast.error("Please capture your live verification selfie before clocking in.");
      return;
    }
    const locationStr = `Main HQ Facial Station (Face Match ID: ${capturedSelfie.faceHash})`;
    let statusNote: PunchRecord["status"] = "On Time";

    const activeShift = shifts[0] || {
      startTime: "09:00",
      gracePeriodMins: 15,
      halfDayHours: 4.5,
      fullDayHours: 8.0,
    };
    const currentTime24 = `${String(currentTime.getHours()).padStart(2, "0")}:${String(currentTime.getMinutes()).padStart(2, "0")}`;
    const arrivalCheck = evaluateArrivalStatus(
      currentTime24,
      activeShift.startTime,
      activeShift.gracePeriodMins
    );

    if (arrivalCheck.isLate) {
      statusNote = "Late";
    }

    const timeStr = currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    try {
      await faceCheckIn({
        location: locationStr,
        device_info: navigator.userAgent,
        method: punchMethod,
        verificationMethod: "face_id",
        notes: taskNotes || undefined,
        image: capturedSelfie.dataUrl,
        file: capturedSelfie.blob,
      }).unwrap();

      addPunch({
        employeeId: user?.id || "EMP-CURRENT",
        employeeName: user?.name || "Alex Mercer",
        department: "Human Resources",
        timestamp: timeStr,
        date: new Date().toISOString().split("T")[0],
        type: "Check-In",
        method: punchMethod,
        location: locationStr,
        taskNotes: taskNotes || undefined,
        status: statusNote,
        lateMinutes: arrivalCheck.lateMinutes,
      });

      setIsClockedIn(true);
      setIsOnBreak(false);
      refetchFeeds();

      toast.success(
        `Clocked In successfully at ${timeStr} via Selfie Camera${arrivalCheck.isLate ? ` (${arrivalCheck.lateMinutes}m Late)` : ""}`
      );
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string }; message?: string };
      const errMsg =
        errorObj?.data?.message || errorObj?.message || "Failed to submit check-in to server.";
      toast.error(errMsg);
    }
  };

  const handleToggleBreak = () => {
    if (!isClockedIn) return;
    const timeStr = currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (isOnBreak) {
      setIsOnBreak(false);
      addPunch({
        employeeId: user?.id || "EMP-CURRENT",
        employeeName: user?.name || "Alex Mercer",
        department: "Human Resources",
        timestamp: timeStr,
        date: new Date().toISOString().split("T")[0],
        type: "Break-Resume",
        method: punchMethod,
        location: "Main HQ Office",
        status: "On Time",
      });
      toast.success("Resumed work from break");
    } else {
      setIsOnBreak(true);
      addPunch({
        employeeId: user?.id || "EMP-CURRENT",
        employeeName: user?.name || "Alex Mercer",
        department: "Human Resources",
        timestamp: timeStr,
        date: new Date().toISOString().split("T")[0],
        type: "Break-Start",
        method: punchMethod,
        location: "Main HQ Office",
        status: "On Time",
      });
      toast.info("Break started");
    }
  };

  const handleCheckOut = async () => {
    if (!isClockedIn) return;
    const timeStr = currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const grossSecs = workSeconds;
    const breakSecs = breakSeconds;
    const netSecs = Math.max(0, grossSecs - breakSecs);
    const netHoursDecimal = netSecs / 3600;

    let checkoutStatus: PunchRecord["status"] = "On Time";
    if (netHoursDecimal < 4.5) {
      checkoutStatus = "Half Day";
    } else if (netHoursDecimal > 8.5) {
      checkoutStatus = "Overtime";
    }

    try {
      await faceCheckOut({
        location: "Main HQ Facial Station",
        device_info: navigator.userAgent,
        method: punchMethod,
        notes: taskNotes || "Daily scheduled tasks completed.",
        image: capturedSelfie?.dataUrl,
        file: capturedSelfie?.blob,
      }).unwrap();

      addPunch({
        employeeId: user?.id || "EMP-CURRENT",
        employeeName: user?.name || "Alex Mercer",
        department: "Human Resources",
        timestamp: timeStr,
        date: new Date().toISOString().split("T")[0],
        type: "Check-Out",
        method: punchMethod,
        location: "Main HQ Facial Station",
        workHours: formatSecs(grossSecs),
        breakHours: formatSecs(breakSecs),
        breakDurationMins: Math.round(breakSecs / 60),
        netWorkHours: formatSecs(netSecs),
        taskNotes: taskNotes || "Daily scheduled tasks completed.",
        status: checkoutStatus,
      });

      setIsClockedIn(false);
      setIsOnBreak(false);
      setTaskNotes("");
      refetchFeeds();

      toast.success(`Clocked Out successfully at ${timeStr}. Net Worked: ${formatSecs(netSecs)}`);
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string }; message?: string };
      const errMsg =
        errorObj?.data?.message || errorObj?.message || "Failed to submit check-out to server.";
      toast.error(errMsg);
    }
  };

  return {
    handleCheckIn,
    handleToggleBreak,
    handleCheckOut,
  };
}
