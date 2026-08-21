import { toast } from "sonner";
import { evaluateCheckIn } from "./checkInHelpers";

export function useCheckInAction(p: any) {
  return async () => {
    if (!p.capturedSelfie) { toast.error("Please capture your live verification selfie before clocking in."); return; }
    const { arrival, timeStr } = evaluateCheckIn(p.currentTime, p.shifts);
    const loc = `Main HQ Facial Station (Face Match ID: ${p.capturedSelfie.faceHash})`;
    try {
      await p.faceCheckIn({ location: loc, device_info: navigator.userAgent, method: "Selfie Camera", verificationMethod: "face_id", notes: p.taskNotes || undefined, image: p.capturedSelfie.dataUrl, file: p.capturedSelfie.blob }).unwrap();
      p.addPunch({ id: `punch_${Date.now()}`, employeeId: p.user?.id || "EMP-CURRENT", employeeName: p.user?.name || "Alex Mercer", department: "Human Resources", timestamp: timeStr, date: new Date().toISOString().split("T")[0], type: "Check-In", method: "Selfie Camera", location: loc, taskNotes: p.taskNotes || undefined, status: arrival.isLate ? "Late" : "On Time", lateMinutes: arrival.lateMinutes });
      p.setIsClockedIn(true); p.setIsOnBreak(false); p.refetchFeeds();
      toast.success(`Clocked In at ${timeStr} via Selfie Camera${arrival.isLate ? ` (${arrival.lateMinutes}m Late)` : ""}`);
    } catch (e: any) { toast.error(e?.data?.message || "Failed to check in."); }
  };
}
