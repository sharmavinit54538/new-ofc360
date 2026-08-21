import { toast } from "sonner";
import { formatSecs } from "../../../utils/attendance.utils";
import type { CameraCaptureResult, PunchRecord } from "../../../types/attendance.types";

export function useCheckOutAction(p: {
  user?: { id?: string; name?: string } | null; currentTime: Date; isClockedIn: boolean; workSeconds: number;
  breakSeconds: number; taskNotes: string; capturedSelfie: CameraCaptureResult | null;
  setIsClockedIn: (v: boolean) => void; setIsOnBreak: (v: boolean) => void; setTaskNotes: (v: string) => void;
  addPunch: (p: PunchRecord) => void; faceCheckOut: (a: Record<string, unknown>) => { unwrap: () => Promise<unknown> }; refetchFeeds: () => void;
}) {
  return async () => {
    if (!p.isClockedIn) return;
    const timeStr = p.currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const gross = p.workSeconds; const brk = p.breakSeconds; const net = Math.max(0, gross - brk);
    const netHrs = net / 3600;
    const status: PunchRecord["status"] = netHrs < 4.5 ? "Half Day" : netHrs > 8.5 ? "Overtime" : "On Time";
    try {
      await p.faceCheckOut({ location: "Main HQ Facial Station", device_info: navigator.userAgent, method: "Selfie Camera", notes: p.taskNotes || "Tasks completed.", image: p.capturedSelfie?.dataUrl, file: p.capturedSelfie?.blob }).unwrap();
      p.addPunch({ id: `punch_${Date.now()}`, employeeId: p.user?.id || "EMP-CURRENT", employeeName: p.user?.name || "Alex Mercer", department: "Human Resources", timestamp: timeStr, date: new Date().toISOString().split("T")[0], type: "Check-Out", method: "Selfie Camera", location: "Main HQ Facial Station", workHours: formatSecs(gross), breakHours: formatSecs(brk), breakDurationMins: Math.round(brk / 60), netWorkHours: formatSecs(net), taskNotes: p.taskNotes || "Tasks completed.", status });
      p.setIsClockedIn(false); p.setIsOnBreak(false); p.setTaskNotes(""); p.refetchFeeds();
      toast.success(`Clocked Out at ${timeStr}. Net Worked: ${formatSecs(net)}`);
    } catch (e: unknown) { toast.error((e as { data?: { message?: string } })?.data?.message || "Failed to check out."); }
  };
}
