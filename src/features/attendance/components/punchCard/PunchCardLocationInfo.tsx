import { MapPin } from "lucide-react";

export function PunchCardLocationInfo() {
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
      <MapPin className="h-3 w-3 text-primary/70" />
      <span>Main HQ Facial Punch Station (GPS Verified)</span>
    </div>
  );
}
