import { RefObject } from "react";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCw, Loader2 } from "lucide-react";

export function CheckinWebcamStream(p: {
  videoRef: RefObject<HTMLVideoElement | null>; isCameraActive: boolean; cameraLoading: boolean; onStartCamera: () => void; onCapture: () => void;
}) {
  return (
    <div className="relative aspect-video w-full max-w-sm mx-auto bg-black/90 rounded-xl overflow-hidden flex items-center justify-center border border-border/80 shadow-inner">
      <video ref={p.videoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${!p.isCameraActive ? "hidden" : ""}`} />
      {!p.isCameraActive ? (
        <Button onClick={p.onStartCamera} disabled={p.cameraLoading} size="sm" className="h-8 text-xs gap-1.5">{p.cameraLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />} Start Webcam</Button>
      ) : (
        <div className="absolute bottom-2 right-2 flex gap-1.5">
          <Button onClick={p.onCapture} size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1"><Camera className="h-3 w-3" /> Capture</Button>
          <Button onClick={p.onStartCamera} size="sm" variant="secondary" className="h-7 px-2"><RefreshCw className="h-3 w-3" /></Button>
        </div>
      )}
    </div>
  );
}
