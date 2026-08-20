import { createSyntheticVideoTrack } from "./syntheticVideoTrack";

export async function acquireUserMedia(audio: boolean | MediaTrackConstraints, video: boolean | MediaTrackConstraints) {
  try {
    if (navigator?.mediaDevices?.getUserMedia) {
      return await navigator.mediaDevices.getUserMedia({ audio, video });
    }
  } catch {
    // fallback to synthetic tracks
  }
  const stream = new MediaStream();
  if (video) stream.addTrack(createSyntheticVideoTrack());
  return stream;
}
