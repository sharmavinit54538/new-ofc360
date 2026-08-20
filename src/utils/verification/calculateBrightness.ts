export function calculateBrightness(data: Uint8ClampedArray): number {
  let totalBrightness = 0;
  const step = 16;
  let sampleCount = 0;
  for (let i = 0; i < data.length; i += step) {
    totalBrightness += (data[i] * 299 + data[i + 1] * 587 + data[i + 2] * 114) / 1000;
    sampleCount++;
  }
  return Math.round(totalBrightness / (sampleCount || 1));
}
