import { toast } from "sonner";
import { evaluateCheckOut } from "./checkOutHelpers";
import type { CameraCaptureResult, PunchRecord } from "../../../types/attendance.types";

export function useCheckOutAction(p: {
  isClockedIn: boolean; currentTime: Date; workSeconds: number; breakSeconds: number;
  faceCheckOut: (args: Record<string, unknown>) => { unwrap: () => Promise<unknown> };
  taskNotes: string; capturedSelfie: CameraCaptureResult | null; addPunch: (punch: PunchRecord) => void;
  user?: { id?: string; name?: string } | null;
  setIsClockedIn: (v: boolean) => void; setIsOnBreak: (v: boolean) => void; setTaskNotes: (v: string) => void; refetchFeeds: () => void;
}) {
  return async () => {
    if (!p.isClockedIn) return;
    const timeStr = p.currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const ev = evaluateCheckOut(p.workSeconds, p.breakSeconds);
    try {
      await p.faceCheckOut({ location: "Main HQ Facial Station", device_info: navigator.userAgent, method: "Selfie Camera", notes: p.taskNotes || "Tasks completed.", image: p.capturedSelfie?.dataUrl, file: p.capturedSelfie?.blob }).unwrap();
      p.addPunch({ id: `punch_${Date.now()}`, employeeId: p.user?.id || "EMP-CURRENT", employeeName: p.user?.name || "Alex Mercer", department: "Human Resources", timestamp: timeStr, date: new Date().toISOString().split("T")[0], type: "Check-Out", method: "Selfie Camera", location: "Main HQ Facial Station", workHours: ev.grossFormatted, breakHours: ev.breakFormatted, breakDurationMins: Math.round(p.breakSeconds / 60), netWorkHours: ev.netFormatted, taskNotes: p.taskNotes || "Tasks completed.", status: ev.status });
      p.setIsClockedIn(false); p.setIsOnBreak(false); p.setTaskNotes(""); p.refetchFeeds();
      toast.success(`Clocked Out at ${timeStr}. Net Worked: ${ev.netFormatted}`);
    } catch (e: unknown) { const err = e as { data?: { message?: string } }; toast.error(err?.data?.message || "Failed to check out."); }
  };
}
