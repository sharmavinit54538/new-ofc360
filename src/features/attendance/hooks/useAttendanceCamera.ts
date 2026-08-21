import { useEffect } from "react";
import { useCameraStream } from "./camera/useCameraStream";
import { useCameraCapture } from "./camera/useCameraCapture";
import type { AttendanceTabType } from "../types/attendance.types";

export function useAttendanceCamera(activeTab?: AttendanceTabType) {
  const stream = useCameraStream();
  const capture = useCameraCapture(stream.videoRef);
  const { isCameraActive, startLiveCamera } = stream;
  const { capturedSelfie } = capture;

  useEffect(() => {
    if (activeTab === "checkin" && !isCameraActive && !capturedSelfie) {
      startLiveCamera();
    }
  }, [activeTab, isCameraActive, capturedSelfie, startLiveCamera]);

  return { ...stream, ...capture };
}
