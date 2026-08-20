import { useState } from "react";
import { Calendar as CalendarIcon, Clock, Video, Plus, User, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useATSStore } from "@/stores/atsStore";
import { CandidateStage } from "@/types/ats";
import { toast } from "sonner";

export function InterviewCalendar() {
  const { interviews, candidates, scheduleInterview } = useATSStore();
  const [openModal, setOpenModal] = useState(false);

  // Form
  const [candidateId, setCandidateId] = useState(candidates[0]?.id || "");
  const [date, setDate] = useState("2026-08-14");
  const [time, setTime] = useState("15:00");
  const [interviewer, setInterviewer] = useState("Alex Vance");

  const selectedCand = candidates.find((c) => c.id === candidateId) || candidates[0];

  const handleSchedule = () => {
    if (!selectedCand) return;
    scheduleInterview({
      candidateId: selectedCand.id,
      candidateName: `${selectedCand.firstName} ${selectedCand.lastName}`,
      jobTitle: selectedCand.jobTitle,
      interviewers: [interviewer],
      stage: selectedCand.stage,
      scheduledAt: `${date}T${time}:00.000Z`,
      durationMinutes: 45,
      meetLink: `https://meet.google.com/ats-auto-${Math.floor(Math.random() * 899 + 100)}`,
      status: "Scheduled"
    });

    toast.success(`Interview scheduled with ${selectedCand.firstName}! Meet link generated.`);
    setOpenModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Interview Scheduling & Calendar Sync</h2>
          <p className="text-sm text-muted-foreground">
            Live interviewer calendar sync, automated Google Meet video links, and interview feedback quick-launch.
          </p>
        </div>

        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5 gradient-bg shadow">
              <Plus className="w-4 h-4" /> Schedule Interview
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule Candidate Interview Session</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2 text-sm">
              <div>
                <Label>Select Candidate</Label>
                <Select value={candidateId} onValueChange={setCandidateId}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {candidates.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.firstName} {c.lastName} ({c.jobTitle})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Date</Label>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div>
                  <Label>Time</Label>
                  <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
              </div>

              <div>
                <Label>Assigned Interviewer</Label>
                <Input value={interviewer} onChange={(e) => setInterviewer(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenModal(false)}>Cancel</Button>
              <Button onClick={handleSchedule}>Confirm & Send Invite</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Calendar List View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {interviews.map((int) => (
          <div key={int.id} className="glass-card rounded-xl p-5 border border-border/50 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <Badge variant="outline" className="text-[10px] font-mono mb-1">{int.id}</Badge>
                <h3 className="font-bold text-base">{int.candidateName}</h3>
                <p className="text-xs text-muted-foreground">{int.jobTitle}</p>
              </div>
              <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-xs">
                {int.status}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t border-border/30">
              <span className="flex items-center gap-1.5"><CalendarIcon className="w-3.5 h-3.5 text-primary" /> {int.scheduledAt.split("T")[0]}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary" /> {int.durationMinutes} minutes</span>
              <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-primary" /> {int.interviewers.join(", ")}</span>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <a href={int.meetLink} target="_blank" rel="noreferrer" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1.5">
                <Video className="w-4 h-4" /> Join Google Meet
              </a>
              <Button size="sm" variant="ghost" className="text-xs">Launch Scorecard</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}