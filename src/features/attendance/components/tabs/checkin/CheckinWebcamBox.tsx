import { CheckinWebcamStream } from "./CheckinWebcamStream";
import { CheckinWebcamCaptured } from "./CheckinWebcamCaptured";
import type { useAttendanceCamera } from "../../../hooks/useAttendanceCamera";

export function CheckinWebcamBox({ camera }: { camera: ReturnType<typeof useAttendanceCamera> }) {
  if (camera.capturedSelfie) {
    return <CheckinWebcamCaptured capturedSelfie={camera.capturedSelfie} onClear={camera.clearCapturedSelfie} />;
  }
  return (
    <CheckinWebcamStream
      videoRef={camera.videoRef}
      isCameraActive={camera.isCameraActive}
      cameraLoading={camera.cameraLoading}
      onStartCamera={camera.startLiveCamera}
      onCapture={camera.capturePhoto}
    />
  );
}
