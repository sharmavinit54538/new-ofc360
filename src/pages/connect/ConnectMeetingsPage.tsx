import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ConnectLayout } from "@/components/connect/ConnectLayout";
import { useConnectStore } from "@/stores/connectStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Video,
  Calendar,
  Plus,
  Clock,
  Users,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  Link2,
} from "lucide-react";
import { ConnectEmptyState } from "@/components/connect/ConnectEmptyState";
import { toast } from "sonner";

export default function ConnectMeetingsPage() {
  const navigate = useNavigate();
  const setActiveTab = useConnectStore((s) => s.setActiveTab);
  const meetings = useConnectStore((s) => s.meetings);
  const setIsNewMeetingOpen = useConnectStore((s) => s.setIsNewMeetingOpen);

  const [joinMeetingId, setJoinMeetingId] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab("meetings");
  }, [setActiveTab]);

  const handleJoinById = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinMeetingId.trim()) {
      toast.error("Please enter a valid Meeting ID.");
      return;
    }
    navigate(`/connect/meeting/${joinMeetingId.trim()}`);
  };

  const handleCopyLink = (mId: string) => {
    const url = `${window.location.origin}/connect/meeting/${mId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(mId);
    toast.success("Meeting link copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <ConnectLayout>
      <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin select-none">
        {/* Banner Section */}
        <div className="rounded-2xl gradient-bg p-6 md:p-8 text-primary-foreground flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <span className="text-[11px] uppercase font-bold tracking-wider bg-white/20 px-3 py-1 rounded-full">
              HD Video Conferencing
            </span>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              Connect with your team from anywhere
            </h2>
            <p className="text-xs md:text-sm text-primary-foreground/80 leading-relaxed">
              Crystal-clear video rooms with browser-native screen sharing, in-meeting chat, and zero downloads required.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              onClick={() => setIsNewMeetingOpen(true)}
              className="bg-white text-primary hover:bg-white/90 font-bold text-xs h-10 px-5 rounded-xl shadow-md gap-2"
            >
              <Video className="w-4 h-4" />
              <span>Start / Schedule Meeting</span>
            </Button>
          </div>
        </div>

        {/* Join by ID Bar */}
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-foreground">Join with a Meeting ID</h3>
              <p className="text-[11px] text-muted-foreground">Enter the meeting code shared by your colleague</p>
            </div>
          </div>

          <form onSubmit={handleJoinById} className="flex items-center gap-2 w-full sm:w-auto">
            <Input
              value={joinMeetingId}
              onChange={(e) => setJoinMeetingId(e.target.value)}
              placeholder="e.g. meet_xyz123"
              className="h-9 text-xs rounded-xl w-full sm:w-60 bg-background"
            />
            <Button type="submit" size="sm" className="gradient-bg text-primary-foreground h-9 px-4 rounded-xl text-xs font-semibold shrink-0">
              Join
            </Button>
          </form>
        </div>

        {/* Scheduled Meetings Stream */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Upcoming Meetings
            </h3>
            <span className="text-xs text-muted-foreground font-semibold">
              {meetings.length} scheduled
            </span>
          </div>

          {meetings.length === 0 ? (
            <ConnectEmptyState
              variant="meetings"
              actionLabel="Schedule a Meeting"
              onAction={() => setIsNewMeetingOpen(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {meetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/40 transition-all flex flex-col justify-between space-y-4 shadow-xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                        {meeting.durationMinutes ? `${meeting.durationMinutes} min` : "30 min"}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopyLink(meeting.id)}
                        className="w-6 h-6 text-muted-foreground hover:text-foreground"
                        title="Copy link"
                      >
                        {copiedId === meeting.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </Button>
                    </div>

                    <h4 className="text-sm font-bold text-foreground line-clamp-1">{meeting.title}</h4>
                    {meeting.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {meeting.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-primary" />
                        {new Date(meeting.startTime).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-primary" />
                        {meeting.participants?.length || 1}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => navigate(`/connect/meeting/${meeting.id}`)}
                    className="w-full gradient-bg text-primary-foreground font-semibold text-xs h-8 rounded-xl gap-1.5 shadow-xs"
                  >
                    <span>Enter Room</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ConnectLayout>
  );
}
