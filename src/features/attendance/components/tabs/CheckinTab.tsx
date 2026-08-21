import { motion } from "framer-motion";
import {
  Clock,
  Camera,
  RotateCw,
  CheckCircle,
  LogIn,
  LogOut,
  Coffee,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AttendanceActions } from "../AttendanceActions";
import { formatSecs } from "../../utils/attendance.utils";
import type { useAttendanceCamera } from "../../hooks/useAttendanceCamera";
import type { PunchRecord } from "../../types/attendance.types";

interface CheckinTabProps {
  currentTime: Date;
  isClockedIn: boolean;
  isOnBreak: boolean;
  workSeconds: number;
  breakSeconds: number;
  taskNotes: string;
  onTaskNotesChange: (val: string) => void;
  isCheckingIn: boolean;
  isCheckingOut: boolean;
  camera: ReturnType<typeof useAttendanceCamera>;
  punches: PunchRecord[];
  onCheckIn: () => void;
  onToggleBreak: () => void;
  onCheckOut: () => void;
}

export function CheckinTab({
  currentTime,
  isClockedIn,
  isOnBreak,
  workSeconds,
  breakSeconds,
  taskNotes,
  onTaskNotesChange,
  isCheckingIn,
  isCheckingOut,
  camera,
  punches,
  onCheckIn,
  onToggleBreak,
  onCheckOut,
}: CheckinTabProps) {
  return (
    <motion.div
      key="checkin"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Punch Control Console */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 sm:p-8 border border-border/60 bg-card shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-primary tracking-wider uppercase">
                Interactive Clock Station
              </span>
              <h2 className="text-2xl font-extrabold text-foreground tracking-tight mt-0.5">
                {currentTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </h2>
              <p className="text-xs text-muted-foreground">
                {currentTime.toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            <Badge
              variant="outline"
              className={`text-xs px-3 py-1 font-bold ${
                isClockedIn
                  ? isOnBreak
                    ? "bg-amber-500/15 text-amber-500 border-amber-500/30"
                    : "bg-emerald-500/15 text-emerald-500 border-emerald-500/30 animate-pulse"
                  : "bg-secondary text-muted-foreground border-border/60"
              }`}
            >
              {isClockedIn ? (isOnBreak ? "ON BREAK" : "CLOCKED IN") : "CLOCKED OUT"}
            </Badge>
          </div>

          {/* Timers Display */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-secondary/30 border border-border/40">
            <div>
              <span className="text-[11px] text-muted-foreground block font-medium">
                Gross Elapsed
              </span>
              <span className="text-xl sm:text-2xl font-extrabold font-mono text-foreground mt-1 block">
                {formatSecs(workSeconds)}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground block font-medium">
                Break Time
              </span>
              <span className="text-xl sm:text-2xl font-extrabold font-mono text-amber-500 mt-1 block">
                {formatSecs(breakSeconds)}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground block font-medium">
                Net Work Time
              </span>
              <span className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-500 mt-1 block">
                {formatSecs(Math.max(0, workSeconds - breakSeconds))}
              </span>
            </div>
          </div>

          {/* Biometric Facial Verification / Selfie Camera Area */}
          <div className="p-4 rounded-2xl bg-secondary/30 border border-border/40 space-y-3">
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Camera className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-foreground">
                      Biometric Facial Verification
                    </span>
                    <span className="text-[11px] text-muted-foreground block">
                      Real-time webcam photo capture & liveness check
                    </span>
                  </div>
                </div>
                {camera.capturedSelfie ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={camera.handleRetakeSelfie}
                    className="h-8 text-xs font-semibold gap-1.5 border-border/60 bg-background"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Retake Selfie</span>
                  </Button>
                ) : camera.isCameraActive ? (
                  <Button
                    type="button"
                    size="sm"
                    onClick={camera.handleCaptureSelfie}
                    className="h-8 gradient-bg text-primary-foreground font-bold text-xs gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Capture Photo</span>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={camera.startLiveCamera}
                    disabled={camera.cameraLoading}
                    className="h-8 text-xs font-semibold gap-1.5 border-border/60 bg-background"
                  >
                    <RotateCw
                      className={`w-3.5 h-3.5 ${camera.cameraLoading ? "animate-spin" : ""}`}
                    />
                    <span>Start Webcam</span>
                  </Button>
                )}
              </div>

              {camera.capturedSelfie ? (
                <div className="flex flex-col sm:flex-row items-center gap-4 p-3 rounded-xl bg-background/80 border border-border/40">
                  <img
                    src={camera.capturedSelfie.dataUrl}
                    alt="Captured verification selfie"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border-2 border-primary/40 shadow-sm"
                  />
                  <div className="space-y-1.5 text-center sm:text-left flex-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-[10px] font-bold gap-1">
                        <CheckCircle className="w-3 h-3" /> Face Verified
                      </Badge>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {camera.capturedSelfie.faceHash}
                      </span>
                    </div>
                    <p className="text-xs text-foreground font-semibold">
                      Selfie Captured at {camera.capturedSelfie.timestamp}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Facial clarity score:{" "}
                      <span className="font-mono text-emerald-500 font-bold">
                        {camera.capturedSelfie.brightnessScore}/255
                      </span>{" "}
                      • Ready for Punch Station.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-primary/30 aspect-video max-w-sm mx-auto flex items-center justify-center">
                  <video
                    ref={camera.videoRef}
                    playsInline
                    muted
                    autoPlay
                    className="w-full h-full object-cover mirror"
                    style={{ transform: "scaleX(-1)" }}
                  />

                  <div className="absolute inset-4 border border-primary/30 rounded-xl pointer-events-none">
                    <div className="absolute -top-1 -left-1 w-3.5 h-3.5 border-t-2 border-l-2 border-primary" />
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-primary" />
                    <div className="absolute -bottom-1 -left-1 w-3.5 h-3.5 border-b-2 border-l-2 border-primary" />
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 border-b-2 border-r-2 border-primary" />
                  </div>

                  <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-white/90">LIVE FACIAL TELEMETRY</span>
                  </div>

                  {!camera.isCameraActive && (
                    <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center p-4 text-center space-y-2">
                      <Camera className="w-8 h-8 text-muted-foreground/40" />
                      <p className="text-xs font-semibold text-foreground">Webcam Stream Inactive</p>
                      <p className="text-[11px] text-muted-foreground max-w-xs">
                        {camera.cameraError ||
                          "Click 'Start Webcam' to initialize facial authentication."}
                      </p>
                      <Button
                        type="button"
                        size="sm"
                        onClick={camera.startLiveCamera}
                        disabled={camera.cameraLoading}
                        className="gradient-bg text-primary-foreground font-bold text-xs h-8"
                      >
                        Start Webcam
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Daily Work Log Notes */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Daily Work Tasks & Achievements (Optional)
            </Label>
            <Textarea
              placeholder="Briefly describe what tasks you worked on today before clocking out..."
              value={taskNotes}
              onChange={(e) => onTaskNotesChange(e.target.value)}
              rows={2}
              className="text-xs bg-secondary/30 border-border/60 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <AttendanceActions
            isClockedIn={isClockedIn}
            isOnBreak={isOnBreak}
            isCheckingIn={isCheckingIn}
            isCheckingOut={isCheckingOut}
            onCheckIn={onCheckIn}
            onToggleBreak={onToggleBreak}
            onCheckOut={onCheckOut}
          />
        </div>

        {/* Right: Today's Timeline Stream */}
        <div className="glass-card rounded-3xl p-6 border border-border/60 bg-card shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-foreground">Today's Timeline Activity</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Chronological audit log of punches today.
            </p>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[340px] pr-1 scrollbar-thin">
            {punches.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-xs space-y-1">
                <Clock className="w-8 h-8 mx-auto text-muted-foreground/30" />
                <p className="font-bold text-foreground">No Punch History Today</p>
                <p className="text-[11px]">Click "Clock In" to begin recording.</p>
              </div>
            ) : (
              punches.map((p) => (
                <div
                  key={p.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30 border border-border/40 text-xs"
                >
                  <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    {p.type === "Check-In" ? (
                      <LogIn className="w-3.5 h-3.5" />
                    ) : p.type === "Check-Out" ? (
                      <LogOut className="w-3.5 h-3.5" />
                    ) : (
                      <Coffee className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{p.type}</span>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {p.timestamp}
                      </span>
                    </div>
                    <span className="text-[11px] text-muted-foreground block">
                      {p.method} • {p.location}
                    </span>
                    {p.workHours && (
                      <span className="text-[10px] font-mono text-emerald-500 font-bold">
                        Worked: {p.workHours}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
