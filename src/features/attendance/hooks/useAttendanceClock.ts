import { useState, useEffect } from "react";
import { useClockTicker } from "./clock/useClockTicker";
import { useClockStopwatch } from "./clock/useClockStopwatch";
import type { AttendanceTodayState, APIResponse } from "../types";

export function useAttendanceClock(myFaceStatus?: APIResponse<AttendanceTodayState> | { status?: string; data?: AttendanceTodayState } | null) {
  const { currentTime } = useClockTicker();
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [taskNotes, setTaskNotes] = useState("");
  const stopwatch = useClockStopwatch(isClockedIn, isOnBreak);

  useEffect(() => {
    const todayData = (myFaceStatus as any)?.data || myFaceStatus;
    if (todayData?.checked_in && !todayData?.checked_out) {
      setIsClockedIn(true);
    } else if (todayData?.checked_out) {
      setIsClockedIn(false);
    } else if ((myFaceStatus as any)?.status === "checked_in") {
      setIsClockedIn(true);
    } else if ((myFaceStatus as any)?.status === "checked_out") {
      setIsClockedIn(false);
    }
  }, [myFaceStatus]);

  return { currentTime, isClockedIn, setIsClockedIn, isOnBreak, setIsOnBreak, taskNotes, setTaskNotes, ...stopwatch };
}
