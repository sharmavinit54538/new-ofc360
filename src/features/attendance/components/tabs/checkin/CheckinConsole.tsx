import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CheckinClockHeader } from "./CheckinClockHeader";
import { CheckinTimers } from "./CheckinTimers";
import { CheckinWebcamBox } from "./CheckinWebcamBox";
import { AttendanceActions } from "../../AttendanceActions";

export function CheckinConsole(p: {
  currentTime: Date; isClockedIn: boolean; isOnBreak: boolean; workSeconds: number; breakSeconds: number;
  camera: Parameters<typeof CheckinWebcamBox>[0]["camera"]; taskNotes: string; setTaskNotes: (v: string) => void;
  actions: { handleCheckIn: () => void; handleToggleBreak: () => void; handleCheckOut: () => void };
  isCheckingIn?: boolean; isCheckingOut?: boolean;
}) {
  return (
    <Card className="border border-border/80 shadow-sm bg-card">
      <CardContent className="p-4 space-y-3.5">
        <CheckinClockHeader currentTime={p.currentTime} isClockedIn={p.isClockedIn} isOnBreak={p.isOnBreak} />
        <CheckinTimers workSeconds={p.workSeconds} breakSeconds={p.breakSeconds} />
        <CheckinWebcamBox camera={p.camera} />
        <Textarea value={p.taskNotes} onChange={(e) => p.setTaskNotes(e.target.value)} placeholder="Add daily task checklist..." className="text-xs min-h-[50px] bg-background/50" />
        <div className="pt-1 flex justify-end"><AttendanceActions isClockedIn={p.isClockedIn} isOnBreak={p.isOnBreak} onClockIn={p.actions.handleCheckIn} onToggleBreak={p.actions.handleToggleBreak} onClockOut={p.actions.handleCheckOut} isCheckingIn={p.isCheckingIn} isCheckingOut={p.isCheckingOut} /></div>
      </CardContent>
    </Card>
  );
}
