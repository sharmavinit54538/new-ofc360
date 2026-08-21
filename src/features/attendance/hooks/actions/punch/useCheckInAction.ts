import { toast } from "sonner";
import { evaluateArrivalStatus } from "@/utils/attendanceCalculations";
import type { CameraCaptureResult, PunchRecord, ShiftTemplate } from "../../../types/attendance.types";

export function useCheckInAction(p: {
  user?: { id?: string; name?: string } | null; shifts: ShiftTemplate[]; currentTime: Date;
  taskNotes: string; capturedSelfie: CameraCaptureResult | null;
  setIsClockedIn: (v: boolean) => void; setIsOnBreak: (v: boolean) => void;
  addPunch: (p: PunchRecord) => void; faceCheckIn: (a: Record<string, unknown>) => { unwrap: () => Promise<unknown> }; refetchFeeds: () => void;
}) {
  return async () => {
    if (!p.capturedSelfie) { toast.error("Please capture your live verification selfie before clocking in."); return; }
    const loc = `Main HQ Facial Station (Face Match ID: ${p.capturedSelfie.faceHash})`;
    const shift = p.shifts[0] || { startTime: "09:00", gracePeriodMins: 15 };
    const curTime24 = `${String(p.currentTime.getHours()).padStart(2, "0")}:${String(p.currentTime.getMinutes()).padStart(2, "0")}`;
    const arrival = evaluateArrivalStatus(curTime24, shift.startTime, shift.gracePeriodMins);
    const timeStr = p.currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    try {
      await p.faceCheckIn({ location: loc, device_info: navigator.userAgent, method: "Selfie Camera", verificationMethod: "face_id", notes: p.taskNotes || undefined, image: p.capturedSelfie.dataUrl, file: p.capturedSelfie.blob }).unwrap();
      p.addPunch({ id: `punch_${Date.now()}`, employeeId: p.user?.id || "EMP-CURRENT", employeeName: p.user?.name || "Alex Mercer", department: "Human Resources", timestamp: timeStr, date: new Date().toISOString().split("T")[0], type: "Check-In", method: "Selfie Camera", location: loc, taskNotes: p.taskNotes || undefined, status: arrival.isLate ? "Late" : "On Time", lateMinutes: arrival.lateMinutes });
      p.setIsClockedIn(true); p.setIsOnBreak(false); p.refetchFeeds();
      toast.success(`Clocked In at ${timeStr} via Selfie Camera${arrival.isLate ? ` (${arrival.lateMinutes}m Late)` : ""}`);
    } catch (e: unknown) { toast.error((e as { data?: { message?: string } })?.data?.message || "Failed to check in."); }
  };
}
