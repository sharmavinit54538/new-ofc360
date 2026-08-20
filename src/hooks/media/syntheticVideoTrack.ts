import { renderSyntheticFrame } from "./syntheticVideoCanvas";

export function createSyntheticVideoTrack(_label = "HD Camera"): MediaStreamTrack {
  const canvas = document.createElement("canvas");
  canvas.width = 640; canvas.height = 480;
  const ctx = canvas.getContext("2d");
  let hue = 210;
  const timer = setInterval(() => {
    if (ctx) { hue = (hue + 0.8) % 360; renderSyntheticFrame(ctx, canvas.width, canvas.height, hue); }
  }, 1000 / 30);
  const stream = canvas.captureStream(30);
  const track = stream.getVideoTracks()[0];
  const origStop = track.stop.bind(track);
  track.stop = () => { clearInterval(timer); origStop(); };
  return track;
}
