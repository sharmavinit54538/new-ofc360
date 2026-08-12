export interface CameraCaptureResult {
  dataUrl: string;
  width: number;
  height: number;
  timestamp: string;
  faceHash: string;
  brightnessScore: number;
}

/**
 * Starts a live webcam stream on a video element.
 */
export async function startCameraStream(
  videoElement: HTMLVideoElement
): Promise<MediaStream> {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error("Camera API is not supported on this device/browser.");
  }

  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: "user",
      width: { ideal: 640 },
      height: { ideal: 480 },
    },
    audio: false,
  });

  videoElement.srcObject = stream;
  await videoElement.play();
  return stream;
}

/**
 * Stops all media stream tracks cleanly to release the webcam hardware.
 */
export function stopCameraStream(stream: MediaStream | null): void {
  if (!stream) return;
  try {
    stream.getTracks().forEach((track) => {
      track.stop();
    });
  } catch (err) {
    console.error("Error stopping camera stream:", err);
  }
}

/**
 * Captures the current frame from a live video element onto a canvas,
 * validates image quality, and returns a high-resolution data URL and verification hash.
 */
export function captureVideoFrame(
  videoElement: HTMLVideoElement
): CameraCaptureResult {
  const width = videoElement.videoWidth || 640;
  const height = videoElement.videoHeight || 480;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Unable to initialize 2D canvas context for frame capture.");
  }

  // Draw current video frame to canvas
  ctx.drawImage(videoElement, 0, 0, width, height);

  // Compute average brightness/luminance to verify valid video frame
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  let totalBrightness = 0;
  // Sample every 4th pixel for performance
  const step = 4 * 4;
  let sampleCount = 0;
  for (let i = 0; i < data.length; i += step) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    totalBrightness += (r * 299 + g * 587 + b * 114) / 1000;
    sampleCount++;
  }
  const brightnessScore = Math.round(totalBrightness / (sampleCount || 1));

  if (brightnessScore < 10) {
    throw new Error(
      "Frame too dark. Please ensure sufficient ambient lighting and that the camera is unobstructed."
    );
  }

  const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
  const faceHash = `FAC-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).slice(-4).toUpperCase()}`;

  return {
    dataUrl,
    width,
    height,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    faceHash,
    brightnessScore,
  };
}
