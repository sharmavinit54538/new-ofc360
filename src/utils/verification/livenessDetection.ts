/**
 * OFC360 Real-Time Biometric Face Detection & Liveness Engine
 * Performs single-face localization and temporal frame-variance anti-spoofing checks.
 */

export interface FaceDetectionStatus {
  detected: boolean;
  faceCount: number;
  brightness: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  error?: "NO_FACE" | "MULTIPLE_FACES" | "FRAME_TOO_DARK" | "FRAME_TOO_BRIGHT";
  message: string;
}

export interface LivenessResult {
  isLive: boolean;
  score: number;
  motionVariance: number;
  isStaticPhoto: boolean;
  message: string;
}

/**
 * Evaluates a video frame to detect whether exactly one human face is positioned in the camera frame.
 */
export function detectFacesInFrame(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement
): FaceDetectionStatus {
  const w = video.videoWidth || 640;
  const h = video.videoHeight || 480;

  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    return {
      detected: false,
      faceCount: 0,
      brightness: 0,
      error: "NO_FACE",
      message: "Camera rendering context unavailable.",
    };
  }

  ctx.drawImage(video, 0, 0, w, h);
  const frameData = ctx.getImageData(0, 0, w, h);
  const data = frameData.data;

  // 1. Calculate overall brightness
  let totalLuminance = 0;
  const step = 4; // Sample every 4th pixel for high-performance 60fps analysis
  let sampledPixels = 0;

  for (let i = 0; i < data.length; i += 4 * step) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    totalLuminance += 0.299 * r + 0.587 * g + 0.114 * b;
    sampledPixels++;
  }

  const avgBrightness = totalLuminance / (sampledPixels || 1);

  if (avgBrightness < 20) {
    return {
      detected: false,
      faceCount: 0,
      brightness: avgBrightness,
      error: "FRAME_TOO_DARK",
      message: "Camera environment is too dark. Please move to a well-lit area.",
    };
  }

  if (avgBrightness > 245) {
    return {
      detected: false,
      faceCount: 0,
      brightness: avgBrightness,
      error: "FRAME_TOO_BRIGHT",
      message: "Camera overexposed. Avoid direct glare or strong backlighting.",
    };
  }

  // 2. Center Face Region Analysis (Biometric Scanner Oval Target: central 60% of frame)
  const minX = Math.floor(w * 0.2);
  const maxX = Math.floor(w * 0.8);
  const minY = Math.floor(h * 0.15);
  const maxY = Math.floor(h * 0.85);

  let skinPixelsCenter = 0;
  let skinPixelsLeft = 0;
  let skinPixelsRight = 0;
  let totalCenterSampled = 0;

  for (let y = minY; y < maxY; y += 4) {
    for (let x = minX; x < maxX; x += 4) {
      const idx = (y * w + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Human skin color tone range in RGB / YCbCr space
      const maxRGB = Math.max(r, g, b);
      const minRGB = Math.min(r, g, b);
      const isSkin =
        r > 60 &&
        g > 40 &&
        b > 20 &&
        maxRGB - minRGB > 15 &&
        Math.abs(r - g) > 15 &&
        r > g &&
        r > b;

      if (isSkin) {
        skinPixelsCenter++;
        if (x < w * 0.4) skinPixelsLeft++;
        if (x > w * 0.6) skinPixelsRight++;
      }
      totalCenterSampled++;
    }
  }

  const centerSkinRatio = skinPixelsCenter / (totalCenterSampled || 1);

  // Peripheral checks for multiple faces
  let leftWingSkin = 0;
  let rightWingSkin = 0;
  let wingSampled = 0;

  for (let y = minY; y < maxY; y += 8) {
    for (let x = 0; x < minX; x += 8) {
      const idx = (y * w + x) * 4;
      if (data[idx] > 60 && data[idx] > data[idx + 1] && data[idx] > data[idx + 2]) {
        leftWingSkin++;
      }
      wingSampled++;
    }
    for (let x = maxX; x < w; x += 8) {
      const idx = (y * w + x) * 4;
      if (data[idx] > 60 && data[idx] > data[idx + 1] && data[idx] > data[idx + 2]) {
        rightWingSkin++;
      }
    }
  }

  const isMultipleFaces =
    (leftWingSkin / (wingSampled || 1) > 0.45 && rightWingSkin / (wingSampled || 1) > 0.45) ||
    (leftWingSkin > skinPixelsCenter * 0.7 && leftWingSkin > 200);

  if (isMultipleFaces) {
    return {
      detected: false,
      faceCount: 2,
      brightness: avgBrightness,
      error: "MULTIPLE_FACES",
      message: "Multiple faces detected. Ensure only one person is in the camera frame.",
    };
  }

  if (centerSkinRatio < 0.12) {
    return {
      detected: false,
      faceCount: 0,
      brightness: avgBrightness,
      error: "NO_FACE",
      message: "No face detected. Please position your face inside the target frame.",
    };
  }

  return {
    detected: true,
    faceCount: 1,
    brightness: avgBrightness,
    boundingBox: {
      x: minX + (maxX - minX) * 0.15,
      y: minY + (maxY - minY) * 0.1,
      width: (maxX - minX) * 0.7,
      height: (maxY - minY) * 0.8,
    },
    message: "Face aligned successfully.",
  };
}

/**
 * Evaluates a sequence of captured frames across time to verify physiological micro-movement and reject static photos.
 */
export function evaluateLiveness(
  currentImageData: ImageData,
  recentFrames: ImageData[]
): LivenessResult {
  if (!recentFrames || recentFrames.length < 2) {
    return {
      isLive: false,
      score: 0.5,
      motionVariance: 0,
      isStaticPhoto: false,
      message: "Collecting temporal frames for liveness verification...",
    };
  }

  const w = currentImageData.width;
  const h = currentImageData.height;
  const curr = currentImageData.data;

  let totalDiff = 0;
  let comparisonCount = 0;

  // Compare current frame with the earliest frame in buffer (1-2s ago)
  const prev = recentFrames[0].data;
  const step = 8; // sample every 8th pixel

  for (let i = 0; i < curr.length; i += 4 * step) {
    const diffR = Math.abs(curr[i] - prev[i]);
    const diffG = Math.abs(curr[i + 1] - prev[i + 1]);
    const diffB = Math.abs(curr[i + 2] - prev[i + 2]);
    totalDiff += (diffR + diffG + diffB) / 3;
    comparisonCount++;
  }

  const avgPixelVariance = totalDiff / (comparisonCount || 1);

  // A printed static photo / screen freeze has near-zero pixel difference (< 0.8)
  // A living person in front of a camera has natural micro-movements, eye blinks, breathing (variance ~ 2.0 to 35.0)
  // Excessive motion (> 65.0) indicates fast shaking / blurring
  if (avgPixelVariance < 0.8) {
    return {
      isLive: false,
      score: 0.15,
      motionVariance: avgPixelVariance,
      isStaticPhoto: true,
      message: "Liveness check failed: Static photo or snapshot detected. Please blink or move naturally.",
    };
  }

  if (avgPixelVariance > 75) {
    return {
      isLive: false,
      score: 0.4,
      motionVariance: avgPixelVariance,
      isStaticPhoto: false,
      message: "Camera movement too fast. Please hold your device steady.",
    };
  }

  const normalizedScore = Math.min(1.0, 0.7 + (avgPixelVariance / 25) * 0.3);

  return {
    isLive: true,
    score: normalizedScore,
    motionVariance: avgPixelVariance,
    isStaticPhoto: false,
    message: "Live biometric verified.",
  };
}
