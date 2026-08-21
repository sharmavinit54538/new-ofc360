import { useState, useEffect } from "react";
import { useClockTicker } from "./clock/useClockTicker";
import { useClockStopwatch } from "./clock/useClockStopwatch";

export function useAttendanceClock(myFaceStatus?: { status?: string }) {
  const { currentTime } = useClockTicker();
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [taskNotes, setTaskNotes] = useState("");
  const stopwatch = useClockStopwatch(isClockedIn, isOnBreak);

  useEffect(() => {
    if (myFaceStatus?.status === "checked_in") setIsClockedIn(true);
    else if (myFaceStatus?.status === "checked_out") setIsClockedIn(false);
  }, [myFaceStatus]);

  return {
    currentTime, isClockedIn, setIsClockedIn, isOnBreak, setIsOnBreak,
    taskNotes, setTaskNotes, ...stopwatch,
  };
}
