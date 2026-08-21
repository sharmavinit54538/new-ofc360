import { useEffect } from "react";
import { useCameraStream } from "./camera/useCameraStream";
import { useCameraCapture } from "./camera/useCameraCapture";
import type { AttendanceTabType } from "../types/attendance.types";

export function useAttendanceCamera(activeTab?: AttendanceTabType) {
  const stream = useCameraStream();
  const capture = useCameraCapture(stream.videoRef);

  useEffect(() => {
    if (activeTab === "checkin" && !stream.isCameraActive && !capture.capturedSelfie) {
      stream.startLiveCamera();
    }
  }, [activeTab, stream.isCameraActive, capture.capturedSelfie, stream.startLiveCamera]);

  return {
    ...stream,
    ...capture,
  };
}
