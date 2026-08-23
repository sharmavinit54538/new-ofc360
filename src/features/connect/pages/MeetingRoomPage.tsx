import { useParams, useNavigate } from "react-router-dom";
import { MeetingRoom } from "@/components/connect/MeetingRoom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function MeetingRoomPage() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();

  if (!meetingId) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-foreground mb-1">Invalid Meeting Link</h2>
        <p className="text-xs text-muted-foreground mb-4">No meeting ID was specified in the route.</p>
        <Button onClick={() => navigate("/connect/meetings")} size="sm" variant="outline" className="text-xs">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Return to Meetings
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-2 md:p-4">
      <MeetingRoom meetingId={meetingId} />
    </div>
  );
}