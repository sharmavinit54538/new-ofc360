import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Video, Calendar, Users, Search, Check, Sparkles } from "lucide-react";
import { useConnectStore } from "@/stores/connectStore";
import { useGetEmployeesQuery } from "@/services/api/employeeApi";
import { useEmployeeStore } from "@/stores/employeeStore";
import { useAuth } from "@/hooks/useAuth";
import { ConnectUser } from "@/types/connect";
import { toast } from "sonner";

interface NewMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewMeetingDialog({ open, onOpenChange }: NewMeetingDialogProps) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("14:00");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [isInstant, setIsInstant] = useState(false);
  const [allowScreenShare, setAllowScreenShare] = useState(true);
  const [allowMicrophone, setAllowMicrophone] = useState(true);
  const [allowCamera, setAllowCamera] = useState(true);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [memberSearch, setMemberSearch] = useState("");

  const { user: currentUser } = useAuth();
  const { createMeeting } = useConnectStore();

  const { data: employeesResponse } = useGetEmployeesQuery(undefined, { skip: !open });
  const storeEmployees = useEmployeeStore((s) => s.employees);

  const employeesList = useMemo(() => {
    let list: any[] = [];
    if (Array.isArray(employeesResponse)) {
      list = employeesResponse;
    } else if (employeesResponse && (employeesResponse as any).data && Array.isArray((employeesResponse as any).data)) {
      list = (employeesResponse as any).data;
    } else if (storeEmployees && storeEmployees.length > 0) {
      list = storeEmployees;
    }

    return list.filter((emp) => emp.id !== currentUser?.id && emp.email !== currentUser?.email);
  }, [employeesResponse, storeEmployees, currentUser]);

  const filteredEmployees = useMemo(() => {
    if (!memberSearch.trim()) return employeesList;
    const q = memberSearch.toLowerCase();
    return employeesList.filter(
      (e) =>
        (e.name && e.name.toLowerCase().includes(q)) ||
        (e.firstName && e.firstName.toLowerCase().includes(q)) ||
        (e.email && e.email.toLowerCase().includes(q)) ||
        (e.department && e.department.toLowerCase().includes(q))
    );
  }, [employeesList, memberSearch]);

  const toggleMember = (empId: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(empId) ? prev.filter((id) => id !== empId) : [...prev, empId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !isInstant) {
      toast.error("Please enter a meeting title.");
      return;
    }

    const hostUser: ConnectUser = {
      id: currentUser?.id ? String(currentUser.id) : "usr_host",
      name: currentUser?.name || currentUser?.email?.split("@")[0] || "Host",
      email: currentUser?.email || "",
      role: currentUser?.role,
    };

    const invitedParticipants: ConnectUser[] = selectedMemberIds.map((id) => {
      const emp = employeesList.find((e) => String(e.id) === id);
      return {
        id: String(emp?.id || id),
        name: emp?.name || `${emp?.firstName || ""} ${emp?.lastName || ""}`.trim() || "Colleague",
        email: emp?.email || "",
        role: emp?.designation || emp?.role,
        department: emp?.department,
      };
    });

    const newMeeting = createMeeting({
      title: title.trim() || `Instant Meeting with ${hostUser.name}`,
      description: description.trim(),
      hostId: hostUser.id,
      hostName: hostUser.name,
      startTime: isInstant ? new Date().toISOString() : `${date}T${time}:00`,
      durationMinutes,
      participants: [hostUser, ...invitedParticipants],
      isPrivate: false,
      allowScreenShare,
      allowMicrophone,
      allowCamera,
    });

    toast.success(isInstant ? "Starting instant meeting..." : "Meeting scheduled successfully.");
    onOpenChange(false);

    if (isInstant) {
      navigate(`/connect/meeting/${newMeeting.id}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden bg-background/95 backdrop-blur-xl border border-border/80 rounded-2xl shadow-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="p-5 pb-4 border-b border-border/50">
            <DialogTitle className="text-base font-semibold flex items-center gap-2">
              <Video className="w-4 h-4 text-primary" />
              {isInstant ? "Start an Instant Meeting" : "Schedule a Meeting"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Create video rooms with screen sharing, participant chat, and local media streams.
            </DialogDescription>
          </DialogHeader>

          <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto scrollbar-thin">
            {/* Quick toggle Instant vs Scheduled */}
            <div className="flex rounded-xl bg-muted/60 p-1 border border-border/60">
              <button
                type="button"
                onClick={() => setIsInstant(false)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  !isInstant ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Schedule for Later
              </button>
              <button
                type="button"
                onClick={() => setIsInstant(true)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  isInstant ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Start Instant Meeting
              </button>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Meeting Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isInstant ? "e.g. Quick Standup" : "e.g. Quarterly Strategic Review"}
                className="text-xs h-9 rounded-xl"
                required={!isInstant}
              />
            </div>

            {/* Date & Time if not instant */}
            {!isInstant && (
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5 col-span-1">
                  <Label className="text-xs font-medium">Date</Label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="text-xs h-9 rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-1.5 col-span-1">
                  <Label className="text-xs font-medium">Time</Label>
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="text-xs h-9 rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-1.5 col-span-1">
                  <Label className="text-xs font-medium">Duration</Label>
                  <select
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value={15}>15 min</option>
                    <option value={30}>30 min</option>
                    <option value={45}>45 min</option>
                    <option value={60}>1 hour</option>
                  </select>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Agenda / Description (Optional)</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Share topics to be discussed..."
                className="text-xs min-h-[56px] rounded-xl resize-none"
              />
            </div>

            {/* Permissions */}
            <div className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-2.5">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Participant Permissions
              </span>
              <div className="flex items-center justify-between text-xs">
                <span>Allow Screen Sharing</span>
                <Switch checked={allowScreenShare} onCheckedChange={setAllowScreenShare} />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Allow Microphone</span>
                <Switch checked={allowMicrophone} onCheckedChange={setAllowMicrophone} />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Allow Video Camera</span>
                <Switch checked={allowCamera} onCheckedChange={setAllowCamera} />
              </div>
            </div>

            {/* Invite Colleagues */}
            <div className="space-y-2">
              <Label className="text-xs font-medium flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-muted-foreground" />
                Invite Colleagues ({selectedMemberIds.length} invited)
              </Label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  placeholder="Filter colleagues to invite..."
                  className="pl-8 text-xs h-8 rounded-lg"
                />
              </div>
              <div className="max-h-28 overflow-y-auto border border-border/60 rounded-xl p-1.5 space-y-1 scrollbar-thin">
                {filteredEmployees.length === 0 ? (
                  <p className="text-center py-3 text-[11px] text-muted-foreground">No colleagues found</p>
                ) : (
                  filteredEmployees.map((emp) => {
                    const fullName = emp.name || `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || emp.email;
                    const isSelected = selectedMemberIds.includes(String(emp.id));

                    return (
                      <div
                        key={emp.id}
                        onClick={() => toggleMember(String(emp.id))}
                        className={`flex items-center justify-between p-1.5 px-2 rounded-lg cursor-pointer transition-colors text-xs ${
                          isSelected ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent/40 text-foreground"
                        }`}
                      >
                        <span className="truncate">{fullName}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="p-4 border-t border-border/50 bg-muted/20 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs h-8 rounded-lg"
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" className="gradient-bg text-primary-foreground text-xs h-8 rounded-lg shadow-sm">
              {isInstant ? "Launch Meeting Now" : "Schedule Meeting"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
