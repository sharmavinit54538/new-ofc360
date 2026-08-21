import { useState, useEffect } from "react";

export function useClockStopwatch(isClockedIn: boolean, isOnBreak: boolean) {
  const [workSeconds, setWorkSeconds] = useState(0);
  const [breakSeconds, setBreakSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isClockedIn && !isOnBreak) setWorkSeconds((p) => p + 1);
      else if (isClockedIn && isOnBreak) setBreakSeconds((p) => p + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isClockedIn, isOnBreak]);

  return { workSeconds, setWorkSeconds, breakSeconds, setBreakSeconds };
}
