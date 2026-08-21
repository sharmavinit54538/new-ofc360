import { useCheckInAction } from "./punch/useCheckInAction";
import { useToggleBreakAction } from "./punch/useToggleBreakAction";
import { useCheckOutAction } from "./punch/useCheckOutAction";
import type { CameraCaptureResult, PunchRecord, ShiftTemplate } from "../../types/attendance.types";

export function usePunchActions(p: {
  user?: { id?: string; name?: string } | null; shifts: ShiftTemplate[]; currentTime: Date;
  isClockedIn: boolean; isOnBreak: boolean; workSeconds: number; breakSeconds: number;
  taskNotes: string; capturedSelfie: CameraCaptureResult | null;
  setIsClockedIn: (v: boolean) => void; setIsOnBreak: (v: boolean) => void; setTaskNotes: (v: string) => void;
  addPunch: (punch: PunchRecord) => void; faceCheckIn: (a: Record<string, unknown>) => { unwrap: () => Promise<unknown> };
  faceCheckOut: (a: Record<string, unknown>) => { unwrap: () => Promise<unknown> }; refetchFeeds: () => void;
}) {
  const handleCheckIn = useCheckInAction(p);
  const handleToggleBreak = useToggleBreakAction(p);
  const handleCheckOut = useCheckOutAction(p);
  return { handleCheckIn, handleToggleBreak, handleCheckOut };
}
