import { useState, useEffect } from "react";

export function useAttendanceClock(myFaceStatus?: { status?: string }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [workSeconds, setWorkSeconds] = useState(0);
  const [breakSeconds, setBreakSeconds] = useState(0);
  const [taskNotes, setTaskNotes] = useState("");

  // Sync clock status with backend response
  useEffect(() => {
    if (myFaceStatus) {
      if (myFaceStatus.status === "checked_in") {
        setIsClockedIn(true);
      } else if (myFaceStatus.status === "checked_out") {
        setIsClockedIn(false);
      }
    }
  }, [myFaceStatus]);

  // Live clock ticks
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (isClockedIn && !isOnBreak) {
        setWorkSeconds((prev) => prev + 1);
      } else if (isClockedIn && isOnBreak) {
        setBreakSeconds((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isClockedIn, isOnBreak]);

  return {
    currentTime,
    isClockedIn,
    setIsClockedIn,
    isOnBreak,
    setIsOnBreak,
    workSeconds,
    setWorkSeconds,
    breakSeconds,
    setBreakSeconds,
    taskNotes,
    setTaskNotes,
  };
}
