import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, RotateCcw } from "lucide-react";
import type { CameraCaptureResult } from "../../../types/attendance.types";

export function CheckinWebcamCaptured({ capturedSelfie, onClear }: { capturedSelfie: CameraCaptureResult; onClear: () => void }) {
  return (
    <div className="relative aspect-video w-full max-w-sm mx-auto bg-black rounded-xl overflow-hidden border-2 border-emerald-500 shadow-md">
      <img src={capturedSelfie.dataUrl} alt="Verified Selfie" className="w-full h-full object-cover" />
      <div className="absolute top-2 left-2"><Badge className="bg-emerald-600 text-white text-[10px] gap-1"><CheckCircle2 className="h-2.5 w-2.5" /> Biometrics Match</Badge></div>
      <div className="absolute bottom-2 right-2"><Button onClick={onClear} size="sm" variant="secondary" className="h-7 text-xs bg-background/80 hover:bg-background gap-1"><RotateCcw className="h-3 w-3" /> Retake</Button></div>
    </div>
  );
}
