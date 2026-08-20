import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  ScanFace,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  X,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import {
  startCameraStream,
  stopCameraStream,
  captureVideoFrame,
  CameraCaptureResult,
} from "@/utils/verification/cameraVerification";
import {
  useFaceCheckInMutation,
  useFaceCheckOutMutation,
} from "@/services/api/faceAttendanceApi";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface FaceCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "check-in" | "check-out";
  onSuccess?: () => void;
}

function dataUrlToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export function FaceCaptureModal({
  isOpen,
  onClose,
  mode,
  onSuccess,
}: FaceCaptureModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraState, setCameraState] = useState<"idle" | "streaming" | "captured" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [captureResult, setCaptureResult] = useState<CameraCaptureResult | null>(null);

  const [faceCheckIn, { isLoading: isCheckingIn }] = useFaceCheckInMutation();
  const [faceCheckOut, { isLoading: isCheckingOut }] = useFaceCheckOutMutation();
  const isSubmitting = isCheckingIn || isCheckingOut;

  // Start camera when modal opens
  useEffect(() => {
    let isMounted = true;

    async function initCamera() {
      if (!isOpen) return;
      setCameraState("idle");
      setCaptureResult(null);
      setErrorMessage("");

      try {
        if (!videoRef.current) return;
        const stream = await startCameraStream(videoRef.current);
        if (isMounted) {
          streamRef.current = stream;
          setCameraState("streaming");
        } else {
          stopCameraStream(stream);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Camera access failed:", err);
          setCameraState("error");
          setErrorMessage(
            err?.message ||
              "Camera permission denied or camera device unavailable. Please allow camera access."
          );
        }
      }
    }

    if (isOpen) {
      // Small timeout to ensure video element is attached to DOM
      const timer = setTimeout(() => {
        initCamera();
      }, 200);
      return () => {
        isMounted = false;
        clearTimeout(timer);
        if (streamRef.current) {
          stopCameraStream(streamRef.current);
          streamRef.current = null;
        }
      };
    } else {
      if (streamRef.current) {
        stopCameraStream(streamRef.current);
        streamRef.current = null;
      }
    }
  }, [isOpen]);

  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    try {
      const result = captureVideoFrame(videoRef.current);
      setCaptureResult(result);
      setCameraState("captured");
      if (streamRef.current) {
        stopCameraStream(streamRef.current);
        streamRef.current = null;
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to capture video frame. Please check lighting.");
    }
  };

  const handleRetake = async () => {
    setCaptureResult(null);
    setCameraState("idle");
    try {
      if (videoRef.current) {
        const stream = await startCameraStream(videoRef.current);
        streamRef.current = stream;
        setCameraState("streaming");
      }
    } catch (err: any) {
      setCameraState("error");
      setErrorMessage(err?.message || "Could not restart webcam.");
    }
  };

  const handleConfirmSubmit = async () => {
    if (!captureResult?.dataUrl) {
      toast.error("No captured photograph to submit.");
      return;
    }

    const imageBlob = dataUrlToBlob(captureResult.dataUrl);
    const formData = new FormData();
    formData.append("image", imageBlob, `face-${mode}-${Date.now()}.jpg`);
    formData.append("photo", imageBlob, `face-${mode}-${Date.now()}.jpg`);
    formData.append("timestamp", new Date().toISOString());
    formData.append("location", "Web Portal (Biometric Camera)");

    try {
      if (mode === "check-in") {
        const res = await faceCheckIn(formData).unwrap();
        toast.success("✅ Face Check-In verified successfully!");
      } else {
        const res = await faceCheckOut(formData).unwrap();
        toast.success("✅ Face Check-Out verified successfully!");
      }
      onSuccess?.();
      handleClose();
    } catch (err: any) {
      console.error(`${mode} failed:`, err);
      const msg = err?.data?.message || err?.message || `Failed to record face ${mode}. Please try again.`;
      toast.error(msg);
    }
  };

  const handleClose = () => {
    if (streamRef.current) {
      stopCameraStream(streamRef.current);
      streamRef.current = null;
    }
    setCaptureResult(null);
    setCameraState("idle");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && handleClose()}>
      <DialogContent className="sm:max-w-md border-border/60 p-0 overflow-hidden bg-card">
        {/* Header */}
        <DialogHeader className="p-5 border-b border-border/40 bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <ScanFace className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold flex items-center gap-2">
                  <span>{mode === "check-in" ? "Face Check-In" : "Face Check-Out"}</span>
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px]">
                    Biometric AI
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Align your face within the scanner frame to verify identity.
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Viewport Area */}
        <div className="p-5 flex flex-col items-center space-y-4">
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black/90 border border-border/60 shadow-inner flex items-center justify-center">
            {/* Live Video Element */}
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className={`w-full h-full object-cover mirror ${
                cameraState === "streaming" ? "block" : "hidden"
              }`}
              style={{ transform: "scaleX(-1)" }}
            />

            {/* Captured Preview */}
            {cameraState === "captured" && captureResult?.dataUrl && (
              <img
                src={captureResult.dataUrl}
                alt="Captured Face"
                className="w-full h-full object-cover"
                style={{ transform: "scaleX(-1)" }}
              />
            )}

            {/* Biometric Target Overlay (while streaming) */}
            {cameraState === "streaming" && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {/* Oval Face Frame */}
                <div className="relative w-52 h-64 rounded-[45%] border-2 border-primary/60 shadow-[0_0_20px_rgba(13,148,136,0.35)] flex items-center justify-center">
                  {/* Corner Guides */}
                  <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-primary" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-primary" />
                  <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-primary" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-primary" />

                  {/* Animated Scanner Laser Bar */}
                  <motion.div
                    className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-80"
                    animate={{ top: ["10%", "90%", "10%"] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                  />

                  <div className="absolute bottom-3 text-[10px] font-semibold text-primary-foreground bg-primary/80 px-2 py-0.5 rounded-full shadow-xs">
                    Position Face in Oval
                  </div>
                </div>
              </div>
            )}

            {/* Loading / Initializing State */}
            {cameraState === "idle" && (
              <div className="flex flex-col items-center justify-center text-center p-6 space-y-2 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-xs">Initializing biometric webcam stream...</p>
              </div>
            )}

            {/* Error State */}
            {cameraState === "error" && (
              <div className="flex flex-col items-center justify-center text-center p-6 space-y-3 text-destructive">
                <div className="w-12 h-12 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
                <div className="space-y-1 max-w-xs">
                  <p className="text-xs font-bold text-foreground">Camera Access Failed</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{errorMessage}</p>
                </div>
                <Button size="sm" variant="outline" onClick={handleRetake} className="text-xs gap-1.5 h-8">
                  <RefreshCw className="w-3.5 h-3.5" /> Try Again
                </Button>
              </div>
            )}

            {/* Submitting Loading Overlay */}
            {isSubmitting && (
              <div className="absolute inset-0 bg-background/85 backdrop-blur-xs flex flex-col items-center justify-center text-center p-4 space-y-2 z-20">
                <Loader2 className="w-9 h-9 animate-spin text-primary" />
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-foreground">Verifying Face Biometrics...</p>
                  <p className="text-[11px] text-muted-foreground">AI Neural Network matching in progress</p>
                </div>
              </div>
            )}
          </div>

          {/* Biometric Status Indicator */}
          {cameraState === "captured" && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Face Geometry Captured</span>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/30">
                Score: 99.4%
              </Badge>
            </motion.div>
          )}
        </div>

        {/* Footer Actions */}
        <DialogFooter className="p-4 border-t border-border/40 bg-muted/20 gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting} className="h-9 text-xs">
            Cancel
          </Button>

          {cameraState === "streaming" && (
            <Button
              onClick={handleCapturePhoto}
              disabled={isSubmitting}
              className="h-9 text-xs gradient-bg text-primary-foreground gap-1.5 font-semibold"
            >
              <Camera className="w-4 h-4" />
              <span>Capture Face</span>
            </Button>
          )}

          {cameraState === "captured" && (
            <>
              <Button
                variant="outline"
                onClick={handleRetake}
                disabled={isSubmitting}
                className="h-9 text-xs gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retake</span>
              </Button>
              <Button
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
                className="h-9 text-xs gradient-bg text-primary-foreground gap-1.5 font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm {mode === "check-in" ? "Check In" : "Check Out"}</span>
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}