import { Button } from "@/components/ui/button";
import { Camera, RefreshCw, Loader2 } from "lucide-react";

export function CheckinWebcamStream({ videoRef, isCameraActive, cameraLoading, onStartCamera, onCapture }: any) {
  return (
    <div className="relative aspect-video w-full max-w-sm mx-auto bg-black/90 rounded-xl overflow-hidden flex items-center justify-center border border-border/80 shadow-inner">
      <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${!isCameraActive ? "hidden" : ""}`} />
      {!isCameraActive && (
        <div className="text-center p-4">
          <Button onClick={onStartCamera} disabled={cameraLoading} size="sm" className="h-8 text-xs gap-1.5">
            {cameraLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
            Start Webcam Stream
          </Button>
        </div>
      )}
      {isCameraActive && (
        <div className="absolute bottom-2 right-2 flex gap-1.5">
          <Button onClick={onCapture} size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1"><Camera className="h-3 w-3" /> Capture Selfie</Button>
          <Button onClick={onStartCamera} size="sm" variant="secondary" className="h-7 px-2"><RefreshCw className="h-3 w-3" /></Button>
        </div>
      )}
    </div>
  );
}
