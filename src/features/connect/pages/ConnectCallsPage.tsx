import { useState, useMemo, useEffect } from "react";
import { ConnectLayout } from "@/features/connect/components/ConnectLayout";
import { useConnect } from "@/features/connect/hooks";
import {
  useGetCallLogsQuery,
  useGetColleaguesQuery,
  useGetIceServersQuery,
} from "@/services/api/connectApi";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setIceServers } from "@/features/connect/callSlice";
import { selectUserPresenceMap } from "@/features/connect/selectors";
import { useAuth } from "@/hooks/useAuth";
import { ConnectUser } from "@/types/connect";
import { connectCallOrchestrator } from "@/services/connectCallOrchestrator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Phone,
  Video,
  PhoneCall,
  Search,
  Users,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Clock,
} from "lucide-react";
import { ConnectEmptyState } from "@/features/connect/components/ConnectEmptyState";
import { PresenceIndicator } from "@/features/connect/components/PresenceIndicator";
import { toast } from "sonner";

export default function ConnectCallsPage() {
  const dispatch = useAppDispatch();
  const { user: currentUser } = useAuth();
  const { setActiveTab } = useConnect();
  const userPresenceMap = useAppSelector(selectUserPresenceMap);

  const [search, setSearch] = useState("");

  useEffect(() => {
    setActiveTab("calls");
  }, [setActiveTab]);

  // RTK Query hooks
  const { data: callLogs = [], isLoading: isLogsLoading } = useGetCallLogsQuery();
  const { data: colleaguesData } = useGetColleaguesQuery();
  const { data: iceData } = useGetIceServersQuery();

  // Populate dynamic ICE servers
  useEffect(() => {
    if (iceData?.iceServers) {
      dispatch(setIceServers(iceData.iceServers));
    }
  }, [iceData, dispatch]);

  const employeesList: ConnectUser[] = useMemo(() => {
    let list: ConnectUser[] = [];
    if (Array.isArray(colleaguesData)) {
      list = colleaguesData;
    } else if (colleaguesData && (colleaguesData as any).colleagues) {
      list = (colleaguesData as any).colleagues;
    }
    return list.filter((emp) => emp?.id && (emp.name || emp.email) && emp.id !== currentUser?.id && emp.email !== currentUser?.email);
  }, [colleaguesData, currentUser]);

  const filteredEmployees = useMemo(() => {
    if (!search.trim()) return employeesList;
    const q = search.toLowerCase();
    return employeesList.filter(
      (e) =>
        (e.name && e.name.toLowerCase().includes(q)) ||
        (e.email && e.email.toLowerCase().includes(q)) ||
        (e.department && e.department.toLowerCase().includes(q)) ||
        (e.role && e.role.toLowerCase().includes(q))
    );
  }, [employeesList, search]);

  const handleStartCall = async (emp: ConnectUser, type: "audio" | "video") => {
    toast.info(`Calling ${emp.name}...`);
    await connectCallOrchestrator.initiateCall(emp, type);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <ConnectLayout>
      <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden select-none">
        {/* Left Side: Call History */}
        <div className="flex-1 flex flex-col border-r border-border/70 bg-card/40 p-4 md:p-6 overflow-y-auto scrollbar-thin">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-foreground">Call Log</h2>
              <p className="text-xs text-muted-foreground">Recent incoming and outgoing team calls</p>
            </div>
          </div>

          {isLogsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 rounded-2xl bg-card/60 animate-pulse border border-border/40" />
              ))}
            </div>
          ) : callLogs.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <ConnectEmptyState
                variant="calls"
                title="No call history"
                description="Your recent audio and video calls will appear here."
              />
            </div>
          ) : (
            <div className="space-y-2">
              {callLogs.map((log) => {
                const isIncoming =
                  log.direction === "incoming" ||
                  log.callee?.id === currentUser?.id ||
                  log.callee?.email === currentUser?.email;
                const isMissed = log.status === "missed";
                const otherUser = isIncoming ? log.caller : log.callee;

                return (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-card border border-border/60 hover:border-primary/40 transition-all text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-muted/40">
                        {isMissed ? (
                          <PhoneMissed className="w-4 h-4 text-rose-500" />
                        ) : isIncoming ? (
                          <PhoneIncoming className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <PhoneOutgoing className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{otherUser?.name || "Colleague"}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {new Date(log.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} •{" "}
                          {log.duration ? formatDuration(log.duration) : isMissed ? "Missed" : "No answer"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => otherUser && handleStartCall(otherUser, "audio")}
                        className="w-8 h-8 rounded-lg text-primary"
                        title="Call Back (Audio)"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => otherUser && handleStartCall(otherUser, "video")}
                        className="w-8 h-8 rounded-lg text-primary"
                        title="Call Back (Video)"
                      >
                        <Video className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Quick Dial Colleagues */}
        <div className="w-full md:w-96 flex flex-col bg-background p-4 md:p-6 shrink-0 overflow-hidden">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Quick Dial Team
            </h3>
            <p className="text-xs text-muted-foreground">Start an instant audio or video call</p>
          </div>

          {/* Search bar */}
          <div className="relative mb-3">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search colleagues..."
              className="pl-8 text-xs h-8 rounded-xl bg-card border-border/70"
            />
          </div>

          {/* Colleagues List */}
          <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-thin pr-1">
            {filteredEmployees.length === 0 ? (
              <p className="text-center py-8 text-xs text-muted-foreground">No colleagues found</p>
            ) : (
              filteredEmployees.map((emp) => {
                const fullName = emp.name || emp.email;
                const initials = fullName.slice(0, 2).toUpperCase();
                const empId = String(emp.id || "").trim();
                const empUserId = String(emp.userId || "").trim();
                const empEmail = emp.email ? emp.email.trim().toLowerCase() : "";

                const dynamicPresence =
                  (empId && userPresenceMap[empId]) ||
                  (empUserId && userPresenceMap[empUserId]) ||
                  (empEmail && userPresenceMap[empEmail]) ||
                  emp.presence ||
                  "offline";

                return (
                  <div
                    key={emp.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-border/50 bg-card/60 hover:bg-accent/30 transition-all text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={emp.avatar || emp.photoUrl} alt={fullName} />
                          <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <PresenceIndicator
                          status={dynamicPresence}
                          size="sm"
                          withPulse={dynamicPresence === "online"}
                          className="absolute -bottom-0.5 -right-0.5"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate">{fullName}</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground truncate">
                          <span>{emp.department || "General"}</span>
                          <span>•</span>
                          <span
                            className={
                              dynamicPresence === "online"
                                ? "text-emerald-500 font-semibold"
                                : dynamicPresence === "away"
                                ? "text-amber-500 font-semibold"
                                : dynamicPresence === "busy" || dynamicPresence === "dnd"
                                ? "text-rose-500 font-semibold"
                                : "text-muted-foreground"
                            }
                          >
                            {dynamicPresence === "online" ? "Online" : "Offline"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleStartCall(emp, "audio")}
                        className="w-7 h-7 rounded-lg text-primary hover:bg-primary/15"
                        title="Audio Call"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleStartCall(emp, "video")}
                        className="w-7 h-7 rounded-lg text-primary hover:bg-primary/15"
                        title="Video Call"
                      >
                        <Video className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </ConnectLayout>
  );
}
