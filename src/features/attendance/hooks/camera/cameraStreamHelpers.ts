import { startCameraStream, stopCameraStream } from "@/utils/verification/cameraVerification";

export async function initCamera(video: HTMLVideoElement, currStream: MediaStream | null) {
  if (currStream) stopCameraStream(currStream);
  return await startCameraStream(video);
}

export function releaseCamera(stream: MediaStream | null) {
  if (stream) stopCameraStream(stream);
}
