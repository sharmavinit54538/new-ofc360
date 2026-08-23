import {
  AlertTriangle,
  CameraOff,
  MicOff,
  MonitorOff,
  WifiOff,
  FileWarning,
  Lock,
  CalendarX,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type ErrorStateVariant =
  | "permission_denied"
  | "camera_unavailable"
  | "mic_unavailable"
  | "screen_share_denied"
  | "browser_unsupported"
  | "connection_failed"
  | "meeting_unavailable"
  | "file_unsupported"
  | "file_too_large"
  | "unauthorized"
  | "generic";

interface ConnectErrorStateProps {
  variant?: ErrorStateVariant;
  title?: string;
  description?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

const ERROR_PRESETS: Record<
  ErrorStateVariant,
  { icon: LucideIcon; title: string; description: string; retryLabel?: string }
> = {
  permission_denied: {
    icon: Lock,
    title: "Permission Denied",
    description: "Please allow camera and microphone access in your browser settings to proceed with the call.",
    retryLabel: "Try Again",
  },
  camera_unavailable: {
    icon: CameraOff,
    title: "Camera Not Found or In Use",
    description: "We couldn't detect a working video camera. Please check if another application is using it.",
    retryLabel: "Check Again",
  },
  mic_unavailable: {
    icon: MicOff,
    title: "Microphone Not Found",
    description: "No working audio input was detected. Please verify your microphone connection.",
    retryLabel: "Check Again",
  },
  screen_share_denied: {
    icon: MonitorOff,
    title: "Screen Sharing Cancelled",
    description: "Screen sharing permission was dismissed or denied by your browser.",
    retryLabel: "Share Again",
  },
  browser_unsupported: {
    icon: AlertTriangle,
    title: "Browser Not Supported",
    description: "Your browser does not support modern WebRTC media APIs. Please update Chrome, Edge, or Firefox.",
  },
  connection_failed: {
    icon: WifiOff,
    title: "Connection Failed",
    description: "Unable to establish communication stream. Please check your network connection.",
    retryLabel: "Reconnect",
  },
  meeting_unavailable: {
    icon: CalendarX,
    title: "Meeting Not Found or Ended",
    description: "This meeting link is invalid, expired, or the host has already concluded the session.",
  },
  file_unsupported: {
    icon: FileWarning,
    title: "Unsupported File Format",
    description: "The selected file format is not supported for sharing or previewing.",
  },
  file_too_large: {
    icon: FileWarning,
    title: "File Size Limit Exceeded",
    description: "The selected file exceeds the allowable maximum size limit (50MB).",
  },
  unauthorized: {
    icon: Lock,
    title: "Access Restricted",
    description: "You do not have permission to access this channel or private conversation.",
  },
  generic: {
    icon: AlertTriangle,
    title: "Something Went Wrong",
    description: "An unexpected error occurred. Please try again.",
    retryLabel: "Retry",
  },
};

export function ConnectErrorState({
  variant = "generic",
  title,
  description,
  onRetry,
  onDismiss,
  className = "",
}: ConnectErrorStateProps) {
  const preset = ERROR_PRESETS[variant];
  const IconComponent = preset.icon;
  const displayTitle = title || preset.title;
  const displayDescription = description || preset.description;

  return (
    <div className={`flex flex-col items-center justify-center p-6 text-center rounded-xl bg-destructive/5 border border-destructive/20 ${className}`}>
      <div className="w-12 h-12 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mb-3.5 shadow-sm">
        <IconComponent className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-semibold text-foreground mb-1">{displayTitle}</h4>
      <p className="text-xs text-muted-foreground max-w-xs mb-4 leading-relaxed">{displayDescription}</p>
      <div className="flex items-center gap-2">
        {onRetry && preset.retryLabel && (
          <Button onClick={onRetry} size="sm" variant="default" className="text-xs h-8">
            {preset.retryLabel}
          </Button>
        )}
        {onDismiss && (
          <Button onClick={onDismiss} size="sm" variant="outline" className="text-xs h-8">
            Dismiss
          </Button>
        )}
      </div>
    </div>
  );
}