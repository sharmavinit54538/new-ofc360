import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ConnectLayout } from "@/components/connect/ConnectLayout";
import { useConnect } from "@/features/connect/hooks";
import { useAppSelector } from "@/app/hooks";
import { selectUserPresenceMap } from "@/features/connect/selectors";
import { useGetColleaguesQuery, useCreateConversationMutation } from "@/services/api/connectApi";
import { useAuth } from "@/hooks/useAuth";
import { ConnectUser } from "@/types/connect";
import { connectCallOrchestrator } from "@/services/connectCallOrchestrator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  MessageSquare,
  Phone,
  Video,
  Mail,
} from "lucide-react";
import { PresenceIndicator } from "@/components/connect/PresenceIndicator";
import { ConnectEmptyState } from "@/components/connect/ConnectEmptyState";
import { toast } from "sonner";

export default function ConnectContactsPage() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { setActiveTab, setActiveConversationId } = useConnect();
  const userPresenceMap = useAppSelector(selectUserPresenceMap);

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");

  useEffect(() => {
    setActiveTab("contacts");
  }, [setActiveTab]);

  // RTK Query hooks
  const { data: colleaguesData, isLoading } = useGetColleaguesQuery({
    search: search.length >= 2 ? search : undefined,
    department: departmentFilter !== "ALL" ? departmentFilter : undefined,
  });

  const [createConversation] = useCreateConversationMutation();

  const colleaguesList: ConnectUser[] = useMemo(() => {
    let list: ConnectUser[] = [];
    if (Array.isArray(colleaguesData)) {
      list = colleaguesData;
    } else if (colleaguesData && (colleaguesData as any).colleagues) {
      list = (colleaguesData as any).colleagues;
    }
    return list.filter((emp) => emp?.id && (emp.name || emp.email) && emp.id !== currentUser?.id && emp.email !== currentUser?.email);
  }, [colleaguesData, currentUser]);

  const departments = useMemo(() => {
    const set = new Set<string>();
    colleaguesList.forEach((c) => {
      if (c.department) set.add(c.department);
    });
    return ["ALL", ...Array.from(set)];
  }, [colleaguesList]);

  const filteredEmployees = useMemo(() => {
    return colleaguesList.filter((emp) => {
      const matchesDept = departmentFilter === "ALL" || emp.department === departmentFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        !search.trim() ||
        (emp.name && emp.name.toLowerCase().includes(q)) ||
        (emp.email && emp.email.toLowerCase().includes(q)) ||
        (emp.role && emp.role.toLowerCase().includes(q));

      return matchesDept && matchesSearch;
    });
  }, [colleaguesList, departmentFilter, search]);

  const handleStartMessage = async (emp: ConnectUser) => {
    try {
      const res = await createConversation({ targetUserId: emp.id }).unwrap();
      const convId = res.id;
      setActiveConversationId(convId);
      navigate(`/connect/chat/${convId}`);
    } catch {
      // Fallback local navigation
      const convId = `conv_${emp.id}`;
      setActiveConversationId(convId);
      navigate(`/connect/chat/${convId}`);
    }
  };

  const handleStartCall = async (emp: ConnectUser, type: "audio" | "video") => {
    toast.info(`Calling ${emp.name}...`);
    await connectCallOrchestrator.initiateCall(emp, type);
  };

  return (
    <ConnectLayout>
      <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 md:p-6 space-y-5 scrollbar-thin select-none">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Colleagues Directory
            </h2>
            <p className="text-xs text-muted-foreground">
              Direct access to all teammates across departments for fast communication
            </p>
          </div>
          <span className="text-xs font-semibold text-muted-foreground bg-muted/60 px-3 py-1 rounded-lg self-start">
            {filteredEmployees.length} Colleagues
          </span>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border/80 shadow-2xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, role, email..."
              className="pl-8 text-xs h-8 bg-background rounded-xl border-border/70"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-muted-foreground font-medium shrink-0">Department:</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="h-8 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="ALL">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Contacts Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-40 rounded-2xl bg-card/60 animate-pulse border border-border/40" />
              ))}
            </div>
          ) : filteredEmployees.length === 0 ? (
            <ConnectEmptyState
              variant="contacts"
              title="No colleagues match your criteria"
              description="Try adjusting your department filter or search term."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredEmployees.map((emp) => {
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
                    className="p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/40 transition-all flex flex-col justify-between space-y-4 shadow-xs group"
                  >
                    <div className="space-y-3">
                      {/* Avatar & Presence */}
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="w-12 h-12 border-2 border-border/60">
                            <AvatarImage src={emp.avatar || emp.photoUrl} alt={fullName} />
                            <AvatarFallback className="text-sm font-bold bg-primary/10 text-primary">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <PresenceIndicator
                            status={dynamicPresence}
                            size="md"
                            withPulse={dynamicPresence === "online"}
                            className="absolute -bottom-0.5 -right-0.5 ring-2 ring-card"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                            {fullName}
                          </h4>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {emp.designation || emp.role || "Team Member"}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-primary/80 font-medium truncate">
                              {emp.department || "General"}
                            </span>
                            <span className="text-[10px] text-muted-foreground">•</span>
                            <span
                              className={`text-[10px] font-semibold ${
                                dynamicPresence === "online"
                                  ? "text-emerald-500"
                                  : dynamicPresence === "away"
                                  ? "text-amber-500"
                                  : dynamicPresence === "busy" || dynamicPresence === "dnd"
                                  ? "text-rose-500"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {dynamicPresence === "online"
                                ? "● Online"
                                : dynamicPresence === "away"
                                ? "● Away"
                                : dynamicPresence === "busy"
                                ? "● Busy"
                                : dynamicPresence === "dnd"
                                ? "● DND"
                                : "○ Offline"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Email Info */}
                      {emp.email && (
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate pt-1 border-t border-border/40">
                          <Mail className="w-3 h-3 shrink-0 text-muted-foreground/70" />
                          <span className="truncate">{emp.email}</span>
                        </div>
                      )}
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => handleStartMessage(emp)}
                        className="h-8 rounded-xl text-[11px] gap-1 px-1 font-semibold"
                        title="Chat"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-primary" />
                        <span>Chat</span>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartCall(emp, "audio")}
                        className="h-8 rounded-xl text-[11px] gap-1 px-1 font-semibold border-border/80"
                        title="Audio Call"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Call</span>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartCall(emp, "video")}
                        className="h-8 rounded-xl text-[11px] gap-1 px-1 font-semibold border-border/80"
                        title="Video Call"
                      >
                        <Video className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Video</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ConnectLayout>
  );
}
